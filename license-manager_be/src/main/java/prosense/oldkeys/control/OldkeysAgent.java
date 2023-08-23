package prosense.oldkeys.control;


//import com.sun.xml.ws.developer.JAXWSProperties;
//import org.w3c.dom.Document;
//import org.w3c.dom.NodeList;
import prosense.boundary.Api;
import prosense.oldkeys.entity.Oldkeys;
import prosense.oldkeys.entity.Oldkeys_;
import prosense.control.ApiAgent;
import prosense.control.ApiJson;
import prosense.control.Property;
import prosense.entity.ApiException;
//import prosense.service.enrolment.Share;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.persistence.metamodel.SingularAttribute;
import javax.ws.rs.core.MultivaluedMap;
//import javax.xml.namespace.QName;
//import javax.xml.soap.*;
//import javax.xml.ws.BindingProvider;
//import javax.xml.ws.Dispatch;
//import javax.xml.ws.Service;
//import javax.xml.ws.WebServiceException;
//import java.io.ByteArrayInputStream;
//import java.nio.charset.StandardCharsets;
//import java.security.*;
//import java.security.cert.CertificateException;
//import java.security.cert.CertificateFactory;
//import java.security.cert.X509Certificate;
import java.util.*;
import java.util.logging.Logger;

@SuppressWarnings("WeakerAccess")
@Dependent
public class OldkeysAgent {
    @Inject
    @Api
    Logger logger;

    @Inject
    private ApiAgent agent;

    @Inject
    @Property
    private String domain;

    //@Inject
    //@Property("read.user")
    //private String readUser;


    public void validate(final JsonObject object) {
        final Set<String> badRequests = new LinkedHashSet<>();
        final Set<String> unprocessableEntities = new LinkedHashSet<>();

        ApiJson.optional(object, Oldkeys_.deactivated).filter(ApiJson::isNotNull).ifPresent(apiJson -> {
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

    public Oldkeys forCreate(final JsonObject object) {
        final Oldkeys.OldkeysBuilder builder = Oldkeys.builder();
        ApiJson.optional(object, Oldkeys_.oldserialkey).filter(ApiJson::isNotNull).map(ApiJson::stringValue).ifPresent(builder::oldserialkey);
        return builder.build();
    }

    public void validateCreate(final Oldkeys entity) {
        final Set<String> badRequests = new LinkedHashSet<>();
        if (entity.getId() != null) {
            agent.invalid(badRequests, Oldkeys_.id);
        }
        if (entity.getOldserialkey() == null) {
            agent.mandatory(badRequests, Oldkeys_.oldserialkey);
        }

        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
    }

    @SuppressWarnings("unused")
    public Oldkeys forUpdate(final Oldkeys entity, final JsonObject object) {
        ApiJson.optional(object, Oldkeys_.deactivated).filter(ApiJson::isNotNull).ifPresent(apiJson -> entity.setDeactivated(apiJson.booleanValue()));
        return entity;
    }

    public void validateUpdate(final Oldkeys entity) {
        final Set<String> badRequests = new LinkedHashSet<>();
        if (entity.getId() == null) {
            agent.invalid(badRequests, Oldkeys_.id);
        }
        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
    }

    public Map<String, Optional<?>> validateParameters(final MultivaluedMap<String, String> parameters) {
        final Set<String> badRequests = new LinkedHashSet<>();
        Map<String, Optional<?>> map = new LinkedHashMap<>();
        agent.addIntegerParam(map, parameters, Oldkeys_.id, badRequests);

        agent.addParam(map, parameters, Oldkeys_.oldserialkey);

        agent.addBooleanParam(map, parameters, Oldkeys_.deactivated);

        agent.addFromParam(map, parameters, Oldkeys_.created, badRequests);
        agent.addToParam(map, parameters, Oldkeys_.created, badRequests);
        agent.addParam(map, parameters, Oldkeys_.creator);
        agent.addFromParam(map, parameters, Oldkeys_.updated, badRequests);
        agent.addToParam(map, parameters, Oldkeys_.updated, badRequests);
        agent.addParam(map, parameters, Oldkeys_.updator);
        if (!badRequests.isEmpty()) {
            throw ApiException.builder().badRequest400().messages(badRequests).build();
        }
        return map;
    }

    public Set<SingularAttribute<Oldkeys, ?>> attributes() {
        return new LinkedHashSet<>(Arrays.asList(
                Oldkeys_.id,
                Oldkeys_.oldserialkey,
                Oldkeys_.deactivated,
                Oldkeys_.created,
                Oldkeys_.creator,
                Oldkeys_.updated,
                Oldkeys_.updator
        ));
    }

    public JsonObject toJson(final Oldkeys entity) {
        final JsonObjectBuilder builder = Json.createObjectBuilder();
        agent.addToBuilder(builder, Oldkeys_.id, entity.getId());
        agent.addToBuilder(builder, Oldkeys_.oldserialkey, entity.getOldserialkey());
        agent.addToBuilder(builder, Oldkeys_.deactivated, entity.getDeactivated());
        agent.addToBuilder(builder, Oldkeys_.created, entity.getCreated());
        agent.addToBuilder(builder, Oldkeys_.creator, entity.getCreator());
        agent.addToBuilder(builder, Oldkeys_.updated, entity.getUpdated());
        agent.addToBuilder(builder, Oldkeys_.updator, entity.getUpdator());
        return builder.build();
    }


}
