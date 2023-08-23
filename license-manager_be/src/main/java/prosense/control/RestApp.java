package prosense.control;

import prosense.boundary.Api;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

@ApplicationPath("api")
public class RestApp extends Application {
    private Properties environment;

    @Inject
    @Api
    private Logger logger;

    @Produces
    @PersistenceContext(unitName = "licenseUserPu")
    private EntityManager em;

    public void init(@Observes @Initialized(ApplicationScoped.class) Object init) {
        Logger.getLogger(this.getClass().getName()).info("cdi app scope init");
        em.getMetamodel();
    }

    @PostConstruct
    public void init() {
        environment = new Properties();
        try {
            environment.load(RestApp.class.getResourceAsStream("environment.properties"));
        } catch (IOException e) {
            logger.log(Level.SEVERE, "loading properties", e);
        }
    }

    @Produces
    @Property
    public String property(final InjectionPoint ip) {
        final Property annotation = ip.getAnnotated().getAnnotation(Property.class);
        if (annotation.value().isEmpty()) {
            return environment.getProperty(ip.getMember().getName());
        }
        return environment.getProperty(annotation.value());
    }

    @Produces
    @Property
    public Boolean bool(final InjectionPoint ip) {
        return Boolean.valueOf(property(ip));
    }
}

