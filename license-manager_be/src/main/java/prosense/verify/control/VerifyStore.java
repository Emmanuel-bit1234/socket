package prosense.verify.control;

import prosense.boundary.Api;
import prosense.control.ApiStore;
import prosense.entity.ApiException;
import prosense.entity.TokenUser;
import prosense.verify.entity.Verify;
import prosense.verify.entity.Verify_;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.persistence.EntityNotFoundException;
import javax.persistence.NoResultException;
import javax.persistence.Tuple;
import javax.persistence.criteria.*;
import javax.ws.rs.core.MultivaluedMap;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.logging.Logger;

@Stateless
public class VerifyStore {
    @Inject
    @Api
    private Logger logger;

    @Inject
    private TokenUser user;

    @Inject
    private VerifyAgent verifyAgent;

    @Inject
    private ApiStore store;

    public boolean exists(final Integer id) {
        return store.exists(Verify_.id, id);
    }

    public Verify create(final Verify entity) {
        entity.setCreated(ZonedDateTime.now());
        entity.setCreator(user.getUsername());
        store.em.persist(entity);
        return entity;
    }

    public Verify readDetached(final Integer id) {
        return store.readDetached(Verify_.id, id).orElseThrow(() -> ApiException.builder().notFound404().message("verify not found").build());
    }

    public JsonObject read(final Integer id, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<Verify> root = criteriaQuery.from(Verify.class);
        criteriaQuery.multiselect(store.selections(verifyAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(Verify_.id), id));
        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();
            return store.toJsonObject(verifyAgent.attributes(), queryParameters, result);
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("verification not found").build();
        }
    }

    public void delete(final Integer id) {
        try {
            store.em.remove(store.em.getReference(Verify.class, id));
        } catch (EntityNotFoundException e) {
            throw ApiException.builder().notFound404().message("verify not found").build();
        }
    }

    public JsonArray search(final MultivaluedMap<String, String> parameters) {
        final Map<String, Optional<?>> validatedParameters = verifyAgent.validateParameters(parameters);
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<Verify> root = criteriaQuery.from(Verify.class);
        final Set<Predicate> predicates = new LinkedHashSet<>();
        store.matchExact(validatedParameters, verifyAgent.attributes(), parameters, predicates, builder, root, Verify_.id);
        store.matchFuzzy(validatedParameters, verifyAgent.attributes(), parameters, predicates, builder, root, Verify_.licensefile);
        store.matchFrom(validatedParameters, predicates, builder, root, Verify_.created);
        store.matchTo(validatedParameters, predicates, builder, root, Verify_.created);
        store.matchFuzzy(validatedParameters, verifyAgent.attributes(), parameters, predicates, builder, root, Verify_.creator);
        criteriaQuery.multiselect(store.selections(verifyAgent.attributes(), parameters, root)).where(store.and(builder, predicates));
        store.sortAsc(verifyAgent.attributes(), parameters, builder, criteriaQuery, root);
        store.sortDesc(verifyAgent.attributes(), parameters, builder, criteriaQuery, root);
        try {
            final List<Tuple> results = store.em.createQuery(criteriaQuery).setMaxResults(store.queryLimit(parameters)).getResultList();
            return store.toJsonArray(verifyAgent.attributes(), parameters, results);
        } catch (IllegalArgumentException e) {
            throw ApiException.builder().internalServerError500().message(e.getMessage()).build();
        }
    }
}

