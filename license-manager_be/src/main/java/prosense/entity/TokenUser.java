package prosense.entity;

import javax.enterprise.context.RequestScoped;

@RequestScoped
public class TokenUser {
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
