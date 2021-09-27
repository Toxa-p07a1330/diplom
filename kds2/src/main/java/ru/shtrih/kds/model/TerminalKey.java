package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import javax.persistence.criteria.CriteriaBuilder;

@Entity
@Table(name = "termkeys")
@Access(AccessType.FIELD)
public class TerminalKey {

    public TerminalKey(Long id) { this.id = id; }
    public TerminalKey() {  }

    public TerminalKey(Terminal t, InnerTerminalKey ikey)
    {
        this.id = ikey.id;
        this.name = ikey.name;
        this.tag = ikey.tag;
        this.material = ikey.material;
        this.keyLoader = ikey.keyLoader;
        this.terminal = t;
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
    public Terminal terminal;

    @ManyToOne
    @JoinColumn(name="keyloaderid")
    public Keyloader keyLoader;

}
