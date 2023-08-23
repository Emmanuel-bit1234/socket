package prosense.file.boundry;

import prosense.boundary.Api;
import prosense.boundary.PATCH;
import prosense.boundary.ResourceLog;
import prosense.control.HasToken;
import prosense.file.control.FileAgent;
import prosense.file.control.FileStore;
import prosense.file.entity.File;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonObject;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.OutputStream;
import java.util.Base64;
import java.util.logging.Logger;

@HasToken
@ResourceLog
@Stateless
@Path("file")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FileResource {
    @Inject
    @Api
    private Logger logger;

    @Inject
    private FileStore fileStore;

    @Inject
    private FileAgent fileAgent;


    //@Inject
    //@Property
    //private String domain;

    @POST
    public Response createEntity(JsonObject json, @Context UriInfo uriInfo) {
        fileAgent.validate(json);
        fileAgent.validateTransient(json);
        File entity = fileAgent.forCreate(json);
        fileAgent.validateCreate(entity);
        entity = fileStore.create(entity);
        return Response.created(uriInfo.getAbsolutePathBuilder().path(String.valueOf(entity.getId())).build()).entity(fileAgent.toJson(entity)).build();
    }

    @GET
    @Path("{id}")
    public Response readEntity(@PathParam("id") Integer id, @Context UriInfo uriInfo) {
        return Response.ok(fileStore.read(id, uriInfo.getQueryParameters())).build();
    }

    @PATCH
    @Path("{id}")
    public Response updateEntity(@PathParam("id") Integer id, JsonObject json, @Context UriInfo uriInfo) {
        fileAgent.validate(json);
        File entity = fileAgent.forUpdate(fileStore.readDetached(id), json);
        fileAgent.validateUpdate(entity);

        return Response.ok(fileAgent.toJson(fileStore.update(entity))).build();
    }

    @DELETE
    @Path("{id}")
    public void deleteEntity(@PathParam("id") Integer id, @Context UriInfo uriInfo) {

        fileStore.delete(id);
    }

    @GET
    public Response readEntities(@Context UriInfo uriInfo) {
        return Response.ok(fileStore.search(uriInfo.getQueryParameters())).build();
    }

    @GET
    @Path("byname/{name}")
    public Response readEntity(@PathParam("name") String name, @Context UriInfo uriInfo) {
        return Response.ok(fileStore.readFile(name, uriInfo.getQueryParameters())).build();
    }

    @GET
    @Path("notissued")
    public Response readEntity(@Context UriInfo uriInfo) {
        return Response.ok(fileAgent.toJson(fileStore.reserveFile(uriInfo.getQueryParameters()))).build();
    }


    @GET
    @Path("file/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response file(@PathParam("id") Integer id, @Context UriInfo uriInfo) {
        final String file_name = fileStore.getFileName(id, uriInfo.getQueryParameters());
        final StreamingOutput output = fileStore.streamFile(id, uriInfo.getQueryParameters());
        return Response.ok(output).header("content-disposition", "attachment; filename = "+file_name).build();
    }

}
