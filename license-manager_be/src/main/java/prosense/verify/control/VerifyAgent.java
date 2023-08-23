package prosense.verify.control;


import com.sun.xml.ws.client.BindingProviderProperties;
import org.apache.commons.io.IOUtils;
import prosense.boundary.Api;
import prosense.control.ApiAgent;
import prosense.control.ApiJson;
import prosense.control.Property;
import prosense.control.RestApp;
import prosense.entity.ApiException;

import prosense.verify.entity.Verify;
import prosense.verify.entity.Verify_;

import javax.enterprise.context.Dependent;
import javax.imageio.ImageIO;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.persistence.metamodel.SingularAttribute;
import javax.ws.rs.core.MultivaluedMap;
import javax.xml.ws.BindingProvider;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@SuppressWarnings("WeakerAccess")
@Dependent
public class VerifyAgent {
    @Inject
    @Api
    Logger logger;

    @Inject
    private ApiAgent agent;

    public void validate(final JsonObject object) {
        final Set<String> badRequests = new LinkedHashSet<>();
        ApiJson.optional(object, Verify_.licensefile).ifPresent(apiJson -> {
            if (!apiJson.isString()) {
                agent.invalid(badRequests, apiJson.attribute());
            }
        });

        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
    }

    public Verify forCreate(final JsonObject object) {
        final Verify.VerifyBuilder builder = Verify.builder();
        ApiJson.optional(object, Verify_.licensefile).filter(ApiJson::isNotNull).map(ApiJson::stringValue).ifPresent(builder::licensefile);
        return builder.build();
    }

    public void validateCreate(final Verify entity) {
        final Set<String> badRequests = new LinkedHashSet<>();
        if (entity.getId() != null) {
            agent.invalid(badRequests, Verify_.id);
        }
        if (entity.getLicensefile() == null) {
            agent.mandatory(badRequests, Verify_.licensefile);
        }
        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
    }

    public Map<String, Optional<?>> validateParameters(final MultivaluedMap<String, String> parameters) {
        final Set<String> badRequests = new LinkedHashSet<>();
        Map<String, Optional<?>> map = new LinkedHashMap<>();
        agent.addIntegerParam(map, parameters, Verify_.id, badRequests);
        agent.addParam(map, parameters, Verify_.licensefile);
        agent.addFromParam(map, parameters, Verify_.created, badRequests);
        agent.addToParam(map, parameters, Verify_.created, badRequests);
        agent.addParam(map, parameters, Verify_.creator);
        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
        return map;
    }

    public Set<SingularAttribute<Verify, ?>> attributes() {
        return new LinkedHashSet<>(Arrays.asList(
                Verify_.id,
                Verify_.licensefile,
                Verify_.created,
                Verify_.creator
        ));
    }

    public JsonObject toJson(final Verify entity) {
        final JsonObjectBuilder builder = Json.createObjectBuilder();
        agent.addToBuilder(builder, Verify_.id, entity.getId());
        agent.addToBuilder(builder, Verify_.licensefile, entity.getLicensefile());
        agent.addToBuilder(builder, Verify_.created, entity.getCreated());
        agent.addToBuilder(builder, Verify_.creator, entity.getCreator());
        return builder.build();
    }

}
