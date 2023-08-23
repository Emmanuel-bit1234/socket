package prosense.issue.control;

import prosense.boundary.Api;
import prosense.control.ApiAgent;
import prosense.control.ApiJson;
import prosense.control.Property;
import prosense.entity.ApiException;
import prosense.issue.entity.Issue;
import prosense.issue.entity.Issue_;

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
public class IssueAgent {
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

        ApiJson.optional(object, Issue_.distributor).filter(ApiJson::isNotNull).ifPresent(apiJson -> {
            if (!apiJson.isNumber()) {
                agent.invalid(badRequests, apiJson.attribute());
            }
        });
        ApiJson.optional(object, Issue_.sequence).filter(ApiJson::isNotNull).ifPresent(apiJson -> {
            if (!apiJson.isNumber()) {
                agent.invalid(badRequests, apiJson.attribute());
            }
        });
        ApiJson.optional(object, Issue_.nooldlicense).filter(ApiJson::isNotNull).ifPresent(apiJson -> {
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

    public Issue forCreate(final JsonObject object) {
        final Issue.IssueBuilder builder = Issue.builder();
        ApiJson.optional(object, Issue_.branch).filter(ApiJson::isNotNull).map(ApiJson::stringValue).ifPresent(builder::branch);

        ApiJson.optional(object, Issue_.domainuser).filter(ApiJson::isNotNull).ifPresent(apiJson -> builder.domainuser(apiJson.stringValue().toLowerCase()));

        ApiJson.optional(object, Issue_.oldserialkey).filter(ApiJson::isNotNull).map(ApiJson::stringValue).ifPresent(builder::oldserialkey);
        ApiJson.optional(object, Issue_.distributor).filter(ApiJson::isNotNull).map(ApiJson::intValue).ifPresent(builder::distributor);
        ApiJson.optional(object, Issue_.sequence).filter(ApiJson::isNotNull).map(ApiJson::intValue).ifPresent(builder::sequence);
        builder.nooldlicense(ApiJson.optional(object, Issue_.nooldlicense).map(ApiJson::booleanValue).orElse(Boolean.TRUE));

        return builder.build();
    }

    public void validateCreate(final Issue entity) {

        final Set<String> badRequests = new LinkedHashSet<>();
        if (entity.getId() != null) {
            agent.invalid(badRequests, Issue_.id);
        }
        if (entity.getBranch() == null) {
            agent.mandatory(badRequests, Issue_.branch);
        }
        if (entity.getDomainuser() == null) {
            agent.mandatory(badRequests, Issue_.domainuser);
        }
        if (entity.getOldserialkey() != null && entity.getDistributor() != null) {
            badRequests.add("Cannot specify Old Serialkey and Distributor");
            agent.invalid(badRequests, Issue_.oldserialkey);
        }
        if (entity.getOldserialkey() != null && entity.getSequence() != null) {
            badRequests.add("Cannot specify Old Serialkey and Sequence");
            agent.invalid(badRequests, Issue_.oldserialkey);
        }
        if (entity.getOldserialkey() != null && entity.getNooldlicense()) {
            badRequests.add("Cannot specify Old Serialkey and No Old License=true");
            agent.invalid(badRequests, Issue_.oldserialkey);
        }
        if (entity.getDistributor() != null && entity.getSequence() == null) {
            badRequests.add("Both Distributor and Sequence must be specified");
            agent.invalid(badRequests, Issue_.distributor);
        }
        if (entity.getDistributor() == null && entity.getSequence() != null) {
            badRequests.add("Both Distributor and Sequence must be specified");
            agent.invalid(badRequests, Issue_.sequence);
        }
        if (entity.getDistributor() != null && entity.getNooldlicense()) {
            badRequests.add("Cannot specify Distributor and No Old License=true");
            agent.invalid(badRequests, Issue_.distributor);
        }

        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
    }


    public Issue forUpdate(final Issue entity, final JsonObject object) {

        ApiJson.optional(object, Issue_.branch).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setBranch(apiJson.stringValue()));
        ApiJson.optional(object, Issue_.domainuser).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setDomainuser(apiJson.stringValue()));

        ApiJson.optional(object, Issue_.oldserialkey).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setOldserialkey(apiJson.stringValue()));
        ApiJson.optional(object, Issue_.distributor).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setDistributor(apiJson.intValue()));
        ApiJson.optional(object, Issue_.sequence).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setSequence(apiJson.intValue()));

        ApiJson.optional(object, Issue_.licensefile).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setLicensefile(apiJson.stringValue()));
        ApiJson.optional(object, Issue_.serialkey).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setSerialkey(apiJson.stringValue()));
        ApiJson.optional(object, Issue_.nooldlicense).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setNooldlicense(apiJson.booleanValue()));
        return entity;
    }

    public void validateUpdate(final Issue entity) {
        final Set<String> badRequests = new LinkedHashSet<>();
        if (entity.getId() == null) {
            agent.invalid(badRequests, Issue_.id);
        }
        if (entity.getBranch() == null) {
            agent.mandatory(badRequests, Issue_.branch);
        }
        if (entity.getDomainuser() == null) {
            agent.mandatory(badRequests, Issue_.domainuser);
        }
        if (entity.getOldserialkey() != null && entity.getDistributor() != null) {
            badRequests.add("Cannot specify Old Serialkey and Distributor");
            agent.invalid(badRequests, Issue_.oldserialkey);
        }
        if (entity.getOldserialkey() != null && entity.getSequence() != null) {
            badRequests.add("Cannot specify Old Serialkey and Sequence");
            agent.invalid(badRequests, Issue_.oldserialkey);
        }
        if (entity.getOldserialkey() != null && entity.getNooldlicense()) {
            badRequests.add("Cannot specify Old Serialkey and No Old License=true");
            agent.invalid(badRequests, Issue_.oldserialkey);
        }
        if (entity.getDistributor() != null && entity.getSequence() == null) {
            badRequests.add("Both Distributor and Sequence must be specified");
            agent.invalid(badRequests, Issue_.distributor);
        }
        if (entity.getDistributor() == null && entity.getSequence() != null) {
            badRequests.add("Both Distributor and Sequence must be specified");
            agent.invalid(badRequests, Issue_.sequence);
        }
        if (entity.getDistributor() != null && entity.getNooldlicense()) {
            badRequests.add("Cannot specify Distributor and No Old License=true");
            agent.invalid(badRequests, Issue_.distributor);
        }

        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
    }

    public Map<String, Optional<?>> validateParameters(final MultivaluedMap<String, String> parameters) {
        final Set<String> badRequests = new LinkedHashSet<>();
        Map<String, Optional<?>> map = new LinkedHashMap<>();
        agent.addIntegerParam(map, parameters, Issue_.id, badRequests);

        agent.addParam(map, parameters, Issue_.branch);
        agent.addParam(map, parameters, Issue_.domainuser);
        agent.addParam(map, parameters, Issue_.oldserialkey);
        agent.addIntegerParam(map, parameters, Issue_.distributor, badRequests);
        agent.addIntegerParam(map, parameters, Issue_.sequence, badRequests);

        agent.addBooleanParam(map, parameters, Issue_.nooldlicense);

        agent.addParam(map, parameters, Issue_.licensefile);
        agent.addParam(map, parameters, Issue_.serialkey);

        agent.addFromParam(map, parameters, Issue_.created, badRequests);
        agent.addToParam(map, parameters, Issue_.created, badRequests);
        agent.addParam(map, parameters, Issue_.creator);
        agent.addFromParam(map, parameters, Issue_.updated, badRequests);
        agent.addToParam(map, parameters, Issue_.updated, badRequests);
        agent.addParam(map, parameters, Issue_.updator);
        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
        return map;
    }

    public Set<SingularAttribute<Issue, ?>> attributes() {
        return new LinkedHashSet<>(Arrays.asList(
                Issue_.id,
                Issue_.branch,
                Issue_.domainuser,
                Issue_.oldserialkey,
                Issue_.distributor,
                Issue_.sequence,
                Issue_.nooldlicense,
                Issue_.licensefile,
                Issue_.serialkey,
                Issue_.created,
                Issue_.creator,
                Issue_.updated,
                Issue_.updator
        ));
    }

    public JsonObject toJson(final Issue entity) {
        final JsonObjectBuilder builder = Json.createObjectBuilder();
        agent.addToBuilder(builder, Issue_.id, entity.getId());
        agent.addToBuilder(builder, Issue_.branch, entity.getBranch());
        agent.addToBuilder(builder, Issue_.domainuser, entity.getDomainuser());
        agent.addToBuilder(builder, Issue_.oldserialkey, entity.getOldserialkey());
        agent.addToBuilder(builder, Issue_.distributor, entity.getDistributor());
        agent.addToBuilder(builder, Issue_.sequence, entity.getSequence());
        agent.addToBuilder(builder, Issue_.nooldlicense, entity.getNooldlicense());
        agent.addToBuilder(builder, Issue_.licensefile, entity.getLicensefile());
        agent.addToBuilder(builder, Issue_.serialkey, entity.getSerialkey());
        agent.addToBuilder(builder, Issue_.created, entity.getCreated());
        agent.addToBuilder(builder, Issue_.creator, entity.getCreator());
        agent.addToBuilder(builder, Issue_.updated, entity.getUpdated());
        agent.addToBuilder(builder, Issue_.updator, entity.getUpdator());
        return builder.build();
    }


}
