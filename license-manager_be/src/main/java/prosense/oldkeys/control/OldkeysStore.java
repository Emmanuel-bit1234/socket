package prosense.oldkeys.control;

import prosense.boundary.Api;

import prosense.control.ApiStore;
import prosense.control.Property;
import prosense.entity.ApiException;
import prosense.entity.TokenUser;
import prosense.oldkeys.entity.Oldkeys;
import prosense.oldkeys.entity.Oldkeys_;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.persistence.EntityNotFoundException;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.Tuple;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.SingularAttribute;
import javax.ws.rs.core.MultivaluedMap;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.logging.Logger;

@Stateless
public class OldkeysStore {
    @Inject
    @Api
    private Logger logger;

    @Inject
    private TokenUser user;

    @Inject
    private OldkeysAgent oldkeysAgent;

    @Inject
    private ApiStore store;


    public boolean exists(final Integer id) {
        return store.exists(Oldkeys_.id, id);
    }

    public Oldkeys create(final Oldkeys entity) {
        entity.setDeactivated(false);
        entity.setCreated(ZonedDateTime.now());
        entity.setCreator(user.getUsername());
        store.em.persist(entity);
        return entity;
    }

    public Oldkeys readDetached(final Integer id) {
        return store.readDetached(Oldkeys_.id, id).orElseThrow(() -> ApiException.builder().notFound404().message("oldkeys not found").build());
    }

    public JsonObject read(final Integer id, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<Oldkeys> root = criteriaQuery.from(Oldkeys.class);
        criteriaQuery.multiselect(store.selections(oldkeysAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(Oldkeys_.id), id));
        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();
            return store.toJsonObject(oldkeysAgent.attributes(), queryParameters, result);
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("oldkeys not found").build();
        }
    }

    public JsonObject readOldkey(final String oldserialkey, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<Oldkeys> root = criteriaQuery.from(Oldkeys.class);
        criteriaQuery.multiselect(store.selections(oldkeysAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(Oldkeys_.oldserialkey), oldserialkey));
        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();
            return store.toJsonObject(oldkeysAgent.attributes(), queryParameters, result);
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("oldkeys not found").build();
        }
    }

    public Oldkeys update(final Oldkeys entity) {
        try {
            entity.setUpdated(ZonedDateTime.now());
            entity.setUpdator(user.getUsername());
            store.em.merge(entity);
        } catch (IllegalArgumentException e) {
            throw ApiException.builder().badRequest400().message(e.getMessage()).build();
        }
        return entity;
    }

    public void delete(final Integer id) {
        try {
            store.em.remove(store.em.getReference(Oldkeys.class, id));
        } catch (EntityNotFoundException e) {
            throw ApiException.builder().notFound404().message("oldserialkey not found").build();
        }
    }

    public JsonArray search(final MultivaluedMap<String, String> parameters) {
        final Map<String, Optional<?>> validatedParameters = oldkeysAgent.validateParameters(parameters);
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<Oldkeys> root = criteriaQuery.from(Oldkeys.class);
        final Set<Predicate> predicates = new LinkedHashSet<>();
        store.matchExact(validatedParameters, oldkeysAgent.attributes(), parameters, predicates, builder, root, Oldkeys_.id);
        store.matchExact(validatedParameters, oldkeysAgent.attributes(), parameters, predicates, builder, root, Oldkeys_.oldserialkey);
        store.matchBool(validatedParameters, oldkeysAgent.attributes(), parameters, predicates, builder, root, Oldkeys_.deactivated);

        store.matchFrom(validatedParameters, predicates, builder, root, Oldkeys_.created);
        store.matchTo(validatedParameters, predicates, builder, root, Oldkeys_.created);
        store.matchFuzzy(validatedParameters, oldkeysAgent.attributes(), parameters, predicates, builder, root, Oldkeys_.creator);
        store.matchFrom(validatedParameters, predicates, builder, root, Oldkeys_.updated);
        store.matchTo(validatedParameters, predicates, builder, root, Oldkeys_.updated);
        store.matchFuzzy(validatedParameters, oldkeysAgent.attributes(), parameters, predicates, builder, root, Oldkeys_.updator);

        criteriaQuery.multiselect(store.selections(oldkeysAgent.attributes(), parameters, root)).where(store.and(builder, predicates));
        store.sortAsc(oldkeysAgent.attributes(), parameters, builder, criteriaQuery, root);
        store.sortDesc(oldkeysAgent.attributes(), parameters, builder, criteriaQuery, root);
        try {
            final List<Tuple> results = store.em.createQuery(criteriaQuery).setMaxResults(store.queryLimit(parameters)).getResultList();
            return store.toJsonArray(oldkeysAgent.attributes(), parameters, results);
        } catch (IllegalArgumentException e) {
            throw ApiException.builder().internalServerError500().message(e.getMessage()).build();
        }
    }

    public boolean readDeactivated(final String oldserialkey) {

        boolean deactivated_value;
        CriteriaBuilder builder = store.em.getCriteriaBuilder();
        CriteriaQuery<Boolean> criteriaQuery = builder.createQuery(Boolean.class);
        Root<Oldkeys> root = criteriaQuery.from(Oldkeys.class);
        criteriaQuery.select(root.get(Oldkeys_.deactivated)).where(builder.equal(builder.lower(root.get(Oldkeys_.oldserialkey)), oldserialkey.toLowerCase()));

        try {
            deactivated_value = store.em.createQuery(criteriaQuery).setMaxResults(1).getSingleResult();
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("old serial key not found").build();
        }

        return deactivated_value;
    }



}
