package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import javafx.application.Application;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "terminals")
@Access(AccessType.FIELD)
public class Terminal {

    public Terminal() { }
    public Terminal(Long id) { this.id = id; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "tid")
    public String tid;

    @Column(name = "sn")
    public String sn;

    @Column(name = "description")
    public String description;

    @Column(name = "stage")
    public String stage;

    @ManyToOne
    @JoinColumn(name="modelid")
    public TerminalModel terminalModel;

    @ManyToOne
    @JoinColumn(name="confpackid")
    public ConfPack conf;

    @ManyToOne
    @JoinColumn(name="merchantid")
    public Merchant merchant;

    @ManyToMany
    @JoinTable( name = "term_group",
            joinColumns = @JoinColumn(name = "termid"),
            inverseJoinColumns = @JoinColumn(name = "groupid"))
    public Set<Group> groups  = new HashSet<Group>();

    @Column
    public String cmd;

    @Column(name = "keyloadercert")
    public String keyLoaderCert;

    @OneToMany
    @JoinColumn(name = "termid")
    public List<InnerTerminalKey> terminalKeys = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "termid")
    public List<Command> terminalCommands = new ArrayList<>();

    @Column(name = "xml", nullable = true)
    public String xml;

    @Column(name = "ip", nullable = true)
    public String ip;

    public void addToGroup(Group g) {
        this.groups.add(g);
        g.terminals.add(this);
    }

    public void removeFromGroup(Group g) {
        this.groups.remove(g);
        g.terminals.remove(this);
    }

    @ManyToMany(mappedBy = "terminals", fetch = FetchType.LAZY)
    public Set<TerminalApplication> applications = new HashSet<TerminalApplication>();

    public void addApplication(TerminalApplication t) {
        this.applications.add(t);
        t.terminals.add(this);
    }

    public void removeApplication(TerminalApplication t) {
        this.applications.remove(t);
        t.terminals.remove(this);
    }

}
