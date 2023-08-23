package prosense.verify.entity;

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
@Table(name = "verify")
public class Verify {
    @SequenceGenerator(name = "verify_generator", sequenceName = "verify_seq", allocationSize = 1)
    @Id
    @GeneratedValue(generator = "verify_generator")
    private Integer id;
    @Column(nullable = false)
    private String licensefile;
    @Column(length = 70, nullable = false)
    private ZonedDateTime created;
    @Column(length = 50, nullable = false)
    private String creator;

}
