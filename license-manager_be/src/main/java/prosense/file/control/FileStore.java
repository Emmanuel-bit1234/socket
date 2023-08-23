package prosense.file.control;

import prosense.boundary.Api;
import prosense.control.ApiStore;
import prosense.entity.ApiException;
import prosense.entity.TokenUser;
import prosense.file.control.FileAgent;
import prosense.file.entity.File;
import prosense.file.entity.File_;

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
import javax.ws.rs.core.StreamingOutput;
import java.io.OutputStream;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.logging.Logger;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

@Stateless
public class FileStore {
    @Inject
    @Api
    private Logger logger;

    @Inject
    private TokenUser user;

    @Inject
    private FileAgent fileAgent;

    @Inject
    private ApiStore store;


    public boolean exists(final Integer id) {
        return store.exists(File_.id, id);
    }

    public File create(final File entity) {
        entity.setCreated(ZonedDateTime.now());
        entity.setCreator(user.getUsername());
        store.em.persist(entity);
        return entity;
    }

    public File readDetached(final Integer id) {
        return store.readDetached(File_.id, id).orElseThrow(() -> ApiException.builder().notFound404().message("license file not found").build());
    }

    public JsonObject read(final Integer id, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<File> root = criteriaQuery.from(File.class);
        criteriaQuery.multiselect(store.selections(fileAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(File_.id), id));
        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();
            return store.toJsonObject(fileAgent.attributes(), queryParameters, result);
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("license file not found").build();
        }
    }

    public JsonObject readFile(final String name, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<File> root = criteriaQuery.from(File.class);
        criteriaQuery.multiselect(store.selections(fileAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(File_.name), name));
        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();
            return store.toJsonObject(fileAgent.attributes(), queryParameters, result);
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("license file not found").build();
        }
    }

    public File reserveFile(final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<File> root = criteriaQuery.from(File.class);

        criteriaQuery.multiselect(store.selections(fileAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(File_.issued), FALSE)).where(builder.equal(root.get(File_.reserved), FALSE));

        try {
            final Tuple result = store.em.createQuery(criteriaQuery).setFirstResult(0).setMaxResults(1).getSingleResult();
                //Update reserved on file record
                Integer in_id = (Integer)result.get("id");
                final File toUpdate = store.readDetached(File_.id, in_id).orElseThrow(() -> ApiException.builder().notFound404().message("license file not found").build());
                toUpdate.setReserved(TRUE);
                return update(toUpdate);
            //return store.toJsonObject(fileAgent.attributes(), queryParameters, result);
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("no unallocated licenses found").build();
        }
    }

    public String getFileName(final Integer id, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<File> root = criteriaQuery.from(File.class);
        criteriaQuery.multiselect(store.selections(fileAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(File_.id), id));
        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();
            String fileName = result.get("name").toString();
            return fileName;
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("license file not found").build();
        }
    }

    public StreamingOutput streamFile(final Integer id, final MultivaluedMap<String, String> queryParameters) {
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<File> root = criteriaQuery.from(File.class);

        criteriaQuery.multiselect(store.selections(fileAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(File_.id), id));

        try {
            final Tuple result = store.em.createQuery(criteriaQuery).getSingleResult();

            byte[] bytes = result.get("key").toString().getBytes();
            final StreamingOutput output = (OutputStream stream) -> stream.write(bytes);
            return output;
        } catch (NoResultException e) {
            throw ApiException.builder().notFound404().message("license file not found during streaming").build();
        }

        //criteriaQuery.multiselect(store.selections(fileAgent.attributes(), queryParameters, root)).where(builder.equal(root.get(File_.issued), FALSE));
        //try {
        //    final Tuple result = store.em.createQuery(criteriaQuery).setFirstResult(0).setMaxResults(1).getSingleResult();
        //
        //    //byte[] bytes = Base64.getDecoder().decode(result.get("newfile").toString());
        //    byte[] bytes = result.get("key").toString().getBytes();
        //    final StreamingOutput output = (OutputStream stream) -> stream.write(bytes);
        //    return output;
        //} catch (NoResultException e) {
        //    throw ApiException.builder().notFound404().message("no unallocated licenses found").build();
        //}
    }

    public File update(final File entity) {
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
            store.em.remove(store.em.getReference(File.class, id));
        } catch (EntityNotFoundException e) {
            throw ApiException.builder().notFound404().message("license file not found").build();
        }
    }

    public JsonArray search(final MultivaluedMap<String, String> parameters) {
        final Map<String, Optional<?>> validatedParameters = fileAgent.validateParameters(parameters);
        final CriteriaBuilder builder = store.em.getCriteriaBuilder();
        final CriteriaQuery<Tuple> criteriaQuery = builder.createTupleQuery();
        final Root<File> root = criteriaQuery.from(File.class);
        final Set<Predicate> predicates = new LinkedHashSet<>();
        store.matchExact(validatedParameters, fileAgent.attributes(), parameters, predicates, builder, root, File_.id);
        store.matchExact(validatedParameters, fileAgent.attributes(), parameters, predicates, builder, root, File_.name);
        store.matchExact(validatedParameters, fileAgent.attributes(), parameters, predicates, builder, root, File_.key);
        store.matchExact(validatedParameters, fileAgent.attributes(), parameters, predicates, builder, root, File_.issued);

        store.matchFrom(validatedParameters, predicates, builder, root, File_.created);
        store.matchTo(validatedParameters, predicates, builder, root, File_.created);
        store.matchFuzzy(validatedParameters, fileAgent.attributes(), parameters, predicates, builder, root, File_.creator);
        store.matchFrom(validatedParameters, predicates, builder, root, File_.updated);
        store.matchTo(validatedParameters, predicates, builder, root, File_.updated);
        store.matchFuzzy(validatedParameters, fileAgent.attributes(), parameters, predicates, builder, root, File_.updator);

        criteriaQuery.multiselect(store.selections(fileAgent.attributes(), parameters, root)).where(store.and(builder, predicates));
        store.sortAsc(fileAgent.attributes(), parameters, builder, criteriaQuery, root);
        store.sortDesc(fileAgent.attributes(), parameters, builder, criteriaQuery, root);
        try {
            final List<Tuple> results = store.em.createQuery(criteriaQuery).setMaxResults(store.queryLimit(parameters)).getResultList();
            return store.toJsonArray(fileAgent.attributes(), parameters, results);
        } catch (IllegalArgumentException e) {
            throw ApiException.builder().internalServerError500().message(e.getMessage()).build();
        }
    }

}
