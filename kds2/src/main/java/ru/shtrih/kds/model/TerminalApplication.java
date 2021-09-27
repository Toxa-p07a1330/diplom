package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "applications")
@Access(AccessType.FIELD)
public class TerminalApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "description")
    public String description;

    @Column(name = "version", nullable = false)
    public String version;

    @Column(name = "signature")
    public String signature;

    @Column(name = "tag", nullable = false)
    public String tag;

    @Column(name = "typetag", nullable = false)
    public String typeTag;

    @Column(name = "filename")
    public String fileName;

    @Column(name = "path")
    public String path;

    @ManyToOne
    @JoinColumn(name="modelid")
    public TerminalModel terminalModel;

    @ManyToMany
    @JsonIgnore
    @JoinTable( name = "terminalapplications",
            joinColumns = @JoinColumn(name = "appid"),
            inverseJoinColumns = @JoinColumn(name = "terminalid"))
    public Set<Terminal> terminals  = new HashSet<Terminal>();

}
