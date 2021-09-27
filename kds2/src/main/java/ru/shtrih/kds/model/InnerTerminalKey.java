package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

@Entity
@Table(name = "termkeys")
@Access(AccessType.FIELD)
public class InnerTerminalKey {


    public InnerTerminalKey() { }

    public InnerTerminalKey(Long id) { this.id = id; }

    public InnerTerminalKey(TerminalKey t)
    {
        this.id = t.id;
        this.name = t.name;
        this.material = t.material;
        this.tag = t.tag;
        this.terminal = t.terminal;
        this.keyLoader = t.keyLoader;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "tag", nullable = false)
    public String tag;

    @Column(name = "material", nullable = false)
    public String material;

    @ManyToOne
    @JoinColumn(name="termid")
    @JsonIgnore
    public Terminal terminal;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name="keyloaderid")
    public Keyloader keyLoader;


}
