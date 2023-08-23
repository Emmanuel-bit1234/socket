package prosense.control;

import prosense.entity.ApiException;
import prosense.entity.TokenUser;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.ext.Provider;
import java.util.Objects;

@HasToken
@Provider
public class TokenInterceptor implements ContainerRequestFilter {
    @Inject
    TokenUser tokenUser;

    @Inject
    @Property
    private String environment;

    @Override
    public void filter(ContainerRequestContext containerRequestContext) {
        if ("local".equals(environment)) {
            final String auth = Objects.toString(containerRequestContext.getHeaderString(HttpHeaders.AUTHORIZATION), "");
            if (!auth.toLowerCase().startsWith("bearer ")) {
                throw ApiException.builder().badRequest400().message("auth invalid").build();
            }
            final String user = auth.substring(7);
            if (user.trim().isEmpty() || user.length() > 20) {
                throw ApiException.builder().badRequest400().message("user invalid").build();
            }
            tokenUser.setUsername(user);
            return;
        }
        final String user = containerRequestContext.getHeaders().getFirst("User");
        if (Objects.isNull(user) || user.trim().isEmpty()) {
            throw ApiException.builder().badRequest400().message("user mandatory").build();
        }
        if (user.length() > 20) {
            throw ApiException.builder().badRequest400().message("user max length 20").build();
        }
        tokenUser.setUsername(user);
    }
}

