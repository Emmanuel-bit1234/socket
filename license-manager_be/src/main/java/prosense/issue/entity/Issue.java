package prosense.issue.entity;

import lombok.*;

import javax.persistence.*;
import java.time.ZonedDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
@Entity
@Cacheable(false)
@Table(name = "issue")
public class Issue {
    @SequenceGenerator(name = "issue_generator", sequenceName = "issue_seq", allocationSize = 1)
    @Id
    @GeneratedValue(generator = "issue_generator")
    private Integer id;
    @Column(nullable = false)
    private String branch;
    @Column(nullable = false)
    private String domainuser;
    @Column(nullable = false)
    private String oldserialkey;
    @Column(nullable = false)
    private Integer distributor;
    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private Boolean nooldlicense;

    @Column(length = 70, nullable = false)
    private String licensefile;
    @Column(length = 500, nullable = false)
    private String serialkey;

    @Column(length = 50, nullable = false)
    private ZonedDateTime created;
    @Column(length = 50, nullable = false)
    private String creator;
    @Column(length = 50, nullable = false)
    private ZonedDateTime updated;
    @Column(length = 50, nullable = false)
    private String updator;

}
