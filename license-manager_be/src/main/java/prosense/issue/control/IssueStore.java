package prosense.issue.control;

import prosense.boundary.Api;
import prosense.control.ApiStore;
import prosense.entity.ApiException;
import prosense.entity.TokenUser;
import prosense.issue.control.IssueAgent;
import prosense.issue.entity.Issue;
import prosense.issue.entity.Issue_;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.persistence.EntityNotFoundException;
import javax.persistence.NoResultException;
import javax.persistence.Tuple;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.ws.rs.core.MultivaluedMap;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.logging.Logger;

@Stateless
public class IssueStore {
    @Inject
    @Api
    private Logger logger;

    @Inject
    private TokenUser user;

    @Inject
    private IssueAgent issueAgent;

    @Inject
    private ApiStore store;


    public boolean exists(final Integer id) {
        return store.exists(Issue_.id, id);
    }

    public Issue create(final Issue entity) {
        entity.setCreated(ZonedDateTime.now());
        entity.setCreator(user.getUsername());
        store.em.persist(entity);
        return entity;
    }

    public Issue readDetached(final Integer id) {
        return store.readDetached(Issue_.id, id).orElseThrow(() -> ApiException.builder().notFound404().message("license issue not found").build());
    }

    public JsonObject read(final Integer id, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<Issue> root = criteriaQuery.from(Issue.class);
        criteriaQuery.multiselect(store.selections(issueAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(Issue_.id), id));
        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();
            return store.toJsonObject(issueAgent.attributes(), queryParameters, result);
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("license issue not found").build();
        }
    }

    public JsonObject readIssue(final String licensefile, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<Issue> root = criteriaQuery.from(Issue.class);
        criteriaQuery.multiselect(store.selections(issueAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(Issue_.licensefile), licensefile));
        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();
            return store.toJsonObject(issueAgent.attributes(), queryParameters, result);
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("license issue not found").build();
        }
    }

    public Issue update(final Issue entity) {
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
            store.em.remove(store.em.getReference(Issue.class, id));
        } catch (EntityNotFoundException e) {
            throw ApiException.builder().notFound404().message("license issue not found").build();
        }
    }

    public JsonArray search(final MultivaluedMap<String, String> parameters) {
        final Map<String, Optional<?>> validatedParameters = issueAgent.validateParameters(parameters);
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<Issue> root = criteriaQuery.from(Issue.class);
        final Set<Predicate> predicates = new LinkedHashSet<>();
        store.matchExact(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.id);
        store.matchFuzzy(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.branch);
        store.matchFuzzy(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.domainuser);
        store.matchExact(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.oldserialkey);
        store.matchExact(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.distributor);
        store.matchExact(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.sequence);
        store.matchExact(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.nooldlicense);
        store.matchExact(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.licensefile);
        store.matchExact(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.serialkey);

        store.matchFrom(validatedParameters, predicates, builder, root, Issue_.created);
        store.matchTo(validatedParameters, predicates, builder, root, Issue_.created);
        store.matchFuzzy(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.creator);
        store.matchFrom(validatedParameters, predicates, builder, root, Issue_.updated);
        store.matchTo(validatedParameters, predicates, builder, root, Issue_.updated);
        store.matchFuzzy(validatedParameters, issueAgent.attributes(), parameters, predicates, builder, root, Issue_.updator);

        criteriaQuery.multiselect(store.selections(issueAgent.attributes(), parameters, root)).where(store.and(builder, predicates));
        store.sortAsc(issueAgent.attributes(), parameters, builder, criteriaQuery, root);
        store.sortDesc(issueAgent.attributes(), parameters, builder, criteriaQuery, root);
        try {
            final List<Tuple> results = store.em.createQuery(criteriaQuery).setMaxResults(store.queryLimit(parameters)).getResultList();
            return store.toJsonArray(issueAgent.attributes(), parameters, results);
        } catch (IllegalArgumentException e) {
            throw ApiException.builder().internalServerError500().message(e.getMessage()).build();
        }
    }

}
