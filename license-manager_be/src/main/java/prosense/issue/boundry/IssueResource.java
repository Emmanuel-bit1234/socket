package prosense.issue.boundry;

import prosense.boundary.Api;
import prosense.boundary.PATCH;
import prosense.boundary.ResourceLog;
import prosense.control.HasToken;
import prosense.control.Property;
import prosense.issue.control.IssueAgent;
import prosense.issue.control.IssueStore;
import prosense.issue.entity.Issue;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.OutputStream;
import java.util.Base64;
import java.util.logging.Logger;

@HasToken
@ResourceLog
@Stateless
@Path("issue")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IssueResource {
    @Inject
    @Api
    private Logger logger;

    @Inject
    private IssueStore issueStore;

    @Inject
    private IssueAgent issueAgent;


    //@Inject
    //@Property
    //private String domain;

    @POST
    public Response createEntity(JsonObject json, @Context UriInfo uriInfo) {
        issueAgent.validate(json);
        issueAgent.validateTransient(json);
        Issue entity = issueAgent.forCreate(json);
        issueAgent.validateCreate(entity);
        entity = issueStore.create(entity);
        return Response.created(uriInfo.getAbsolutePathBuilder().path(String.valueOf(entity.getId())).build()).entity(issueAgent.toJson(entity)).build();
    }

    @GET
    @Path("{id}")
    public Response readEntity(@PathParam("id") Integer id, @Context UriInfo uriInfo) {
        return Response.ok(issueStore.read(id, uriInfo.getQueryParameters())).build();
    }

    @PATCH
    @Path("{id}")
    public Response updateEntity(@PathParam("id") Integer id, JsonObject json, @Context UriInfo uriInfo) {
        issueAgent.validate(json);
        Issue entity = issueAgent.forUpdate(issueStore.readDetached(id), json);
        issueAgent.validateUpdate(entity);

        return Response.ok(issueAgent.toJson(issueStore.update(entity))).build();
    }

    @DELETE
    @Path("{id}")
    public void deleteEntity(@PathParam("id") Integer id, @Context UriInfo uriInfo) {

        issueStore.delete(id);
    }

    @GET
    public Response readEntities(@Context UriInfo uriInfo) {
        return Response.ok(issueStore.search(uriInfo.getQueryParameters())).build();
    }

    @GET
    @Path("bylicensefile/{licensefile}")
    public Response readEntity(@PathParam("licensefile") String licensefile, @Context UriInfo uriInfo) {
        return Response.ok(issueStore.readIssue(licensefile, uriInfo.getQueryParameters())).build();
    }

  //  @GET
  //  @Path("file")
  //  @Produces(MediaType.APPLICATION_OCTET_STREAM)
  //  public Response file() {
  //      byte[] bytes = Base64.getDecoder().decode("aGVsbG8gc3RyZWFtaW5nIHdvcmxkIQo=");
  //      final StreamingOutput output = (OutputStream stream) -> stream.write(bytes);
  //      return Response.ok(output).header("content-disposition", "attachment; filename = file.txt").build();
  //  }

}
