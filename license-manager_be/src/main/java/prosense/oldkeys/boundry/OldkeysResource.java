package prosense.oldkeys.boundry;

import prosense.boundary.Api;
import prosense.boundary.PATCH;
import prosense.boundary.ResourceLog;

import prosense.control.HasToken;
import prosense.control.Property;
import prosense.entity.ApiException;
import prosense.oldkeys.control.OldkeysAgent;
import prosense.oldkeys.control.OldkeysStore;
import prosense.oldkeys.entity.Oldkeys;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.Json;
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
@Path("oldkeys")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OldkeysResource {
    @Inject
    @Api
    private Logger logger;

    @Inject
    private OldkeysStore oldkeysStore;

    @Inject
    private OldkeysAgent oldkeysAgent;


    @Inject
    @Property
    private String domain;

    @POST
    public Response createEntity(JsonObject json, @Context UriInfo uriInfo) {
        oldkeysAgent.validate(json);
        oldkeysAgent.validateTransient(json);
        Oldkeys entity = oldkeysAgent.forCreate(json);
        oldkeysAgent.validateCreate(entity);
        entity = oldkeysStore.create(entity);
        return Response.created(uriInfo.getAbsolutePathBuilder().path(String.valueOf(entity.getId())).build()).entity(oldkeysAgent.toJson(entity)).build();
    }

    @GET
    @Path("{id}")
    public Response readEntity(@PathParam("id") Integer id, @Context UriInfo uriInfo) {
        return Response.ok(oldkeysStore.read(id, uriInfo.getQueryParameters())).build();
    }

    @PATCH
    @Path("{id}")
    public Response updateEntity(@PathParam("id") Integer id, JsonObject json, @Context UriInfo uriInfo) {
        oldkeysAgent.validate(json);
        Oldkeys entity = oldkeysAgent.forUpdate(oldkeysStore.readDetached(id), json);
        oldkeysAgent.validateUpdate(entity);

        return Response.ok(oldkeysAgent.toJson(oldkeysStore.update(entity))).build();
    }

    @DELETE
    @Path("{id}")
    public void deleteEntity(@PathParam("id") Integer id, @Context UriInfo uriInfo) {

        oldkeysStore.delete(id);
    }

    @GET
    public Response readEntities(@Context UriInfo uriInfo) {
        return Response.ok(oldkeysStore.search(uriInfo.getQueryParameters())).build();
    }

    @GET
    @Path("deactivated/{oldserialkey}")
    public Response readActiveEntity(@PathParam("oldserialkey") String oldserialkey, @Context UriInfo uriInfo) {
        return Response.ok(Json.createObjectBuilder().add("deactivated", oldkeysStore.readDeactivated(oldserialkey)).build()).build();
    }

    @GET
    @Path("byoldkey/{oldserialkey}")
    public Response readEntity(@PathParam("oldserialkey") String oldserialkey, @Context UriInfo uriInfo) {
        return Response.ok(oldkeysStore.readOldkey(oldserialkey, uriInfo.getQueryParameters())).build();
    }

}
