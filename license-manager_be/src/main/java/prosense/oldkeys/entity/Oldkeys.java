package prosense.oldkeys.entity;

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
@Table(name = "oldkeys")
public class Oldkeys {
    @SequenceGenerator(name = "oldkeys_generator", sequenceName = "oldkeys_seq", allocationSize = 1)
    @Id
    @GeneratedValue(generator = "oldkeys_generator")
    private Integer id;
    @Column(nullable = false)
    private String oldserialkey;

    @Column(nullable = false)
    private Boolean deactivated;

    @Column(length = 50, nullable = false)
    private ZonedDateTime created;
    @Column(length = 50, nullable = false)
    private String creator;
    @Column(length = 50, nullable = false)
    private ZonedDateTime updated;
    @Column(length = 50, nullable = false)
    private String updator;

}
