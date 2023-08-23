package prosense.file.control;

import prosense.boundary.Api;
import prosense.control.ApiAgent;
import prosense.control.ApiJson;
import prosense.control.Property;
import prosense.entity.ApiException;
import prosense.file.entity.File;
import prosense.file.entity.File_;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.persistence.metamodel.SingularAttribute;
import javax.ws.rs.core.MultivaluedMap;
import java.util.*;
import java.util.logging.Logger;

@SuppressWarnings("WeakerAccess")
@Dependent
public class FileAgent {
    @Inject
    @Api
    Logger logger;

    @Inject
    private ApiAgent agent;

    @Inject
    @Property
    private String domain;


    public void validate(final JsonObject object) {
        final Set<String> badRequests = new LinkedHashSet<>();
        final Set<String> unprocessableEntities = new LinkedHashSet<>();


        ApiJson.optional(object, File_.issued).filter(ApiJson::isNotNull).ifPresent(apiJson -> {
            if (!apiJson.isBoolean()) {
                agent.invalid(badRequests, apiJson.attribute());
            }
        });
        ApiJson.optional(object, File_.reserved).filter(ApiJson::isNotNull).ifPresent(apiJson -> {
            if (!apiJson.isBoolean()) {
                agent.invalid(badRequests, apiJson.attribute());
            }
        });

        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
        if (!unprocessableEntities.isEmpty()) {
            throw ApiException.builder().unprocessableEntity422().messages(unprocessableEntities).build();
        }
    }

    public void validateTransient(final JsonObject object) {
        final Set<String> badRequests = new LinkedHashSet<>();
        final Set<String> unprocessableEntities = new LinkedHashSet<>();

        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
        if (!unprocessableEntities.isEmpty()) {
            throw ApiException.builder().unprocessableEntity422().messages(unprocessableEntities).build();
        }
    }

    public File forCreate(final JsonObject object) {
        final File.FileBuilder builder = File.builder();
        ApiJson.optional(object, File_.name).filter(ApiJson::isNotNull).map(ApiJson::stringValue).ifPresent(builder::name);
        ApiJson.optional(object, File_.key).filter(ApiJson::isNotNull).map(ApiJson::stringValue).ifPresent(builder::key);

        //ApiJson.optional(object, File_.newfile).filter(ApiJson::isNotNull).ifPresent(apiJson -> builder.newfile(apiJson.stringValue()));

        builder.issued(ApiJson.optional(object, File_.issued).map(ApiJson::booleanValue).orElse(Boolean.FALSE));
        builder.reserved(ApiJson.optional(object, File_.reserved).map(ApiJson::booleanValue).orElse(Boolean.FALSE));

        return builder.build();
    }

    public void validateCreate(final File entity) {

        final Set<String> badRequests = new LinkedHashSet<>();
        if (entity.getId() != null) {
            agent.invalid(badRequests, File_.id);
        }
        if (entity.getName() == null) {
            agent.mandatory(badRequests, File_.name);
        }
        if (entity.getKey() == null) {
            agent.mandatory(badRequests, File_.key);
        }
        //if (entity.getNewfile() == null) {
        //    agent.mandatory(badRequests, File_.newfile);
        //}
        if (entity.getIssued() == null) {
            agent.mandatory(badRequests, File_.issued);
        }
        if (entity.getReserved() == null) {
            agent.mandatory(badRequests, File_.reserved);
        }


        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
    }


    public File forUpdate(final File entity, final JsonObject object) {

        ApiJson.optional(object, File_.name).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setName(apiJson.stringValue()));
        ApiJson.optional(object, File_.key).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setKey(apiJson.stringValue()));

        //ApiJson.optional(object, File_.newfile).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setNewfile(apiJson.stringValue()));

        ApiJson.optional(object, File_.issued).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setIssued(apiJson.booleanValue()));
        ApiJson.optional(object, File_.reserved).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setReserved(apiJson.booleanValue()));
        return entity;
    }

    public void validateUpdate(final File entity) {
        final Set<String> badRequests = new LinkedHashSet<>();
        if (entity.getId() == null) {
            agent.invalid(badRequests, File_.id);
        }
        if (entity.getName() == null) {
            agent.mandatory(badRequests, File_.name);
        }
        if (entity.getKey() == null) {
            agent.mandatory(badRequests, File_.key);
        }
        //if (entity.getNewfile() == null) {
        //    agent.mandatory(badRequests, File_.newfile);
       // }
        if (entity.getIssued() == null) {
            agent.mandatory(badRequests, File_.issued);
        }
        if (entity.getReserved() == null) {
            agent.mandatory(badRequests, File_.reserved);
        }

        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
    }

    public Map<String, Optional<?>> validateParameters(final MultivaluedMap<String, String> parameters) {
        final Set<String> badRequests = new LinkedHashSet<>();
        Map<String, Optional<?>> map = new LinkedHashMap<>();
        agent.addIntegerParam(map, parameters, File_.id, badRequests);

        agent.addParam(map, parameters, File_.name);
        agent.addParam(map, parameters, File_.key);
        //agent.addParam(map, parameters, File_.newfile);

        agent.addBooleanParam(map, parameters, File_.issued);
        agent.addBooleanParam(map, parameters, File_.reserved);

        agent.addFromParam(map, parameters, File_.created, badRequests);
        agent.addToParam(map, parameters, File_.created, badRequests);
        agent.addParam(map, parameters, File_.creator);
        agent.addFromParam(map, parameters, File_.updated, badRequests);
        agent.addToParam(map, parameters, File_.updated, badRequests);
        agent.addParam(map, parameters, File_.updator);
        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
        return map;
    }

    public Set<SingularAttribute<File, ?>> attributes() {
        return new LinkedHashSet<>(Arrays.asList(
                File_.id,
                File_.name,
                File_.key,
                //File_.newfile,
                File_.issued,
                File_.reserved,
                File_.created,
                File_.creator,
                File_.updated,
                File_.updator
        ));
    }

    public JsonObject toJson(final File entity) {
        final JsonObjectBuilder builder = Json.createObjectBuilder();
        agent.addToBuilder(builder, File_.id, entity.getId());
        agent.addToBuilder(builder, File_.name, entity.getName());
        agent.addToBuilder(builder, File_.key, entity.getKey());
        //agent.addToBuilder(builder, File_.newfile, entity.getNewfile());
        agent.addToBuilder(builder, File_.issued, entity.getIssued());
        agent.addToBuilder(builder, File_.reserved, entity.getReserved());
        agent.addToBuilder(builder, File_.created, entity.getCreated());
        agent.addToBuilder(builder, File_.creator, entity.getCreator());
        agent.addToBuilder(builder, File_.updated, entity.getUpdated());
        agent.addToBuilder(builder, File_.updator, entity.getUpdator());
        return builder.build();
    }


}
