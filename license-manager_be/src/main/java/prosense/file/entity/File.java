package prosense.file.entity;

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
@Table(name = "newfile")
public class File {
    @SequenceGenerator(name = "issue_generator", sequenceName = "issue_seq", allocationSize = 1)
    @Id
    @GeneratedValue(generator = "issue_generator")
    private Integer id;
    @Column(length = 70, nullable = false)
    private String name;
    @Column(length = 500, nullable = false)
    private String key;
   // @Lob
   // private String newfile;

    @Column(nullable = false)
    private Boolean issued;
    @Column(nullable = false)
    private Boolean reserved;

    @Column(length = 50, nullable = false)
    private ZonedDateTime created;
    @Column(length = 50, nullable = false)
    private String creator;
    @Column(length = 50, nullable = false)
    private ZonedDateTime updated;
    @Column(length = 50, nullable = false)
    private String updator;

}
