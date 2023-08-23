package prosense.boundry;

import prosense.control.Property;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.Json;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

@Stateless
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/")
public class AppResource {
    @Inject
    @Property
    private String environment;

    @GET
    public Response read(@Context UriInfo uriInfo) {
        return Response.ok(Json.createObjectBuilder().add("environment", environment).build()).build();
    }
}
