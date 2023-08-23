package prosense.verify.boundry;

import prosense.verify.control.VerifyStore;
import prosense.boundary.Api;
//import prosense.boundary.PATCH;
import prosense.boundary.ResourceLog;
import prosense.control.HasToken;
import prosense.entity.ApiException;

import prosense.verify.control.VerifyAgent;
import prosense.verify.control.VerifyStore;
import prosense.verify.entity.Verify;
import weblogic.javaee.TransactionTimeoutSeconds;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonObject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.util.logging.Logger;

@HasToken
@ResourceLog
@Stateless
@Path("verify")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@TransactionTimeoutSeconds(70)
public class VerifyResource {
    @Inject
    @Api
    private Logger logger;

    @Inject
    private VerifyStore verifyStore;

    @Inject
    private VerifyAgent verifyAgent;

    @POST
    public Response createEntity(JsonObject json, @Context UriInfo uriInfo) {
        final Verify entity = verify(json);
        return Response.created(uriInfo.getAbsolutePathBuilder().path(String.valueOf(entity.getId())).build()).entity(verifyAgent.toJson(entity)).build();
    }

    private Verify verify(JsonObject json) {
        verifyAgent.validate(json);
        Verify entity = verifyAgent.forCreate(json);
        verifyAgent.validateCreate(entity);
        if (entity.getLicensefile().isEmpty()) {
            throw ApiException.builder().badRequest400().message("licensefile invalid").build();
        }

        entity = verifyStore.create(entity);
        return entity;
    }

    @GET
    @Path("{id}")
    public Response readEntity(@PathParam("id") Integer id, @Context UriInfo uriInfo) {
        return Response.ok(verifyStore.read(id, uriInfo.getQueryParameters())).build();
    }

    @DELETE
    @Path("{id}")
    public void deleteEntity(@PathParam("id") Integer id) {
        verifyStore.delete(id);
    }

    @GET
    public Response readEntities(@Context UriInfo uriInfo) {
        return Response.ok(verifyStore.search(uriInfo.getQueryParameters())).build();
    }
}
