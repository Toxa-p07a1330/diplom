package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.*;
import ru.shtrih.kds.repository.CommandRepository;
import ru.shtrih.kds.repository.ConfPackRepository;
import ru.shtrih.kds.repository.ConfTemplateRepository;
import ru.shtrih.kds.repository.TerminalRepository;
import ru.shtrih.kds.tools.ApplicationPrivateProperties;
import ru.shtrih.kds.tools.KeyManager;
import ru.shtrih.kds.tools.Utils;
import javax.validation.Valid;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import static ru.shtrih.kds.tools.Utils.xmlDocumentToString;
import org.springframework.core.io.Resource;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class ConfController {

    @Autowired
    private ConfTemplateRepository confTemplateRepository;
    @Autowired
    private TerminalRepository terminalRepository;
    @Autowired
    private ConfPackRepository packRepository;

    @Autowired
    private CommandRepository commandRepository;

    @Autowired
    ApplicationPrivateProperties applicationPrivateProperties;

    @GetMapping("/conftemplates")
    public List<ConfTemplate> getAllConfTemplates() {
        return confTemplateRepository.findAll();
    }

    @GetMapping("/conftemplates/{id}")
    public ResponseEntity<ConfTemplate> getConfTemplateById(@PathVariable(value = "id") Long templateId)
            throws ResourceNotFoundException {
        ConfTemplate templ = confTemplateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found"));
        return ResponseEntity.ok().body(templ);
    }


    @PostMapping("/conftemplates")
    public ResponseEntity<Object> createConfTemplate(@Valid @RequestBody ConfTemplate template) throws DataVerificationException {

        ConfTemplate t = null;
        try {
            template.tag = "todo";
            template.xml = "<todo/>";
            t = confTemplateRepository.save(template);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("Template with this name already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
        return new ResponseEntity<Object>(t, HttpStatus.OK);
    }

    @PutMapping("/conftemplates/{id}")
    public ResponseEntity<ConfTemplate> updateConfTemplate(@PathVariable(value = "id") Long terminalId,
                                                   @Valid @RequestBody ConfTemplate templateDetails)
            throws ResourceNotFoundException, DataVerificationException {
        ConfTemplate template = confTemplateRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));

        try {
            template.name = templateDetails.name;
            template.description = templateDetails.description;
            template.stage = templateDetails.stage;
            try {
                Document d = Utils.parseXml(templateDetails.xml);
                template.tag = d.getDocumentElement().getTagName(); // templateDetails.tag;
            } catch(Exception ex) {}
            template.xml = templateDetails.xml;
            final ConfTemplate updatedTemplate = confTemplateRepository.save(template);
            return ResponseEntity.ok(updatedTemplate);
        }
        catch (Exception ex) {
            String msg = ex.getMessage();
            if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("Template with this name already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PostMapping("/deletetemplates")
    public ResponseEntity deleteConfTemplates(@Valid @RequestBody List<ConfTemplate> templates) {
        confTemplateRepository.deleteAll(templates);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/conftemplates/{id}")
    public Map<String, Boolean> deleteConfTemplate(@PathVariable(value = "id") Long templateId)
            throws ResourceNotFoundException {
        ConfTemplate template = confTemplateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));
        confTemplateRepository.delete(template);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @PostMapping("/conftemplates/{id}/upload")
    public ResponseEntity<ConfTemplate> singleFileUpload(@PathVariable(value = "id") Long templateId,
                                                         @RequestParam("file") MultipartFile file) throws DataVerificationException {
        if (file.isEmpty()) {
            return ResponseEntity.ok(null);
        }
        try {
            ConfTemplate template = confTemplateRepository.findById(templateId)
                    .orElseThrow(() -> new ResourceNotFoundException("Template not found"));
            byte[] bytes = file.getBytes();
            DocumentBuilderFactory factory =
                    DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            ByteArrayInputStream input = new ByteArrayInputStream(bytes);
            Document doc = builder.parse(input);
            Element root = doc.getDocumentElement();
            template.tag = root.getTagName();

            template.xml = xmlDocumentToString(doc);
            final ConfTemplate updatedTemplate = confTemplateRepository.save(template);
            return ResponseEntity.ok(updatedTemplate);
        } catch (Exception ex) {
            throw new DataVerificationException("Failed to upload template file");
        }
    }

    @GetMapping(value="conf/{model}/terminals/{sn}", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getTerminalConfiguration(@PathVariable(value = "model") String model, @PathVariable(value = "sn") String serialNumber) {
        Document doc = null;
        try {
            List<Object[]> res = terminalRepository.getTerminalConfig(model.toUpperCase(), serialNumber, "terminal");
            if (res != null && res.size() == 1 && res.get(0).length == 3)
            {
                String stage = (String)res.get(0)[0];
                String xml = (String)res.get(0)[1];
                String name = (String)res.get(0)[2];
                Document xdoc = Utils.parseXml(xml);
                List<Object[]> m = terminalRepository.getTerminalParameters(serialNumber);
                if (m != null && m.size() == 1 && m.get(0).length == 5) {
                    doc = Utils.createXml("epay");
                    Long confid = (Long)m.get(0)[4];
                    String tid = (String) m.get(0)[0];
                    String mid = (String) m.get(0)[1];
                    String catCode = (String) m.get(0)[2];
                    String nameAndL = (String) m.get(0)[3];
                    String mxml = (String)m.get(0)[5];
                    //doc.getDocumentElement().sdoc.createAttribute("stage");
                    Element root = doc.getDocumentElement();
                    root.setAttribute("header", "/common/header_" + confid.toString());
                    Element t = (Element)doc.importNode(xdoc.getDocumentElement(), true);
                    t.setAttribute("stage", stage);
                    t.setAttribute("name", name);
                    root.appendChild(t);
                    Element opt = Utils.getNode(t, "options");
                    if (opt == null) {
                        opt = doc.createElement("options");
                        t.appendChild(opt);
                    }
                    Element app = Utils.getNode(opt, "application");
                    if (app == null) {
                        app = doc.createElement("application");
                        opt.appendChild(app);
                    }

                    if (tid != null && tid.length() == 8) {
                        Element v = doc.createElement("tag");
                        String n = Utils.hexToString(tid.getBytes());
                        v.setAttribute("name", "9F1C");
                        v.setTextContent(n);
                        app.appendChild(v);
                    }
                    if (mid != null && mid.length() == 15) {
                        Element v = doc.createElement("tag");
                        String n = Utils.hexToString(mid.getBytes());
                        v.setAttribute("name", "9F16");
                        v.setTextContent(n);
                        app.appendChild(v);
                    }
                    if (catCode != null && catCode.length() == 2) {
                        Element v = doc.createElement("tag");
                        String n = Utils.hexToString(catCode.getBytes());
                        v.setAttribute("name", "9F15");
                        v.setTextContent(n);
                        app.appendChild(v);
                    }
                    if (nameAndL != null) {
                        Element v = doc.createElement("tag");
                        v.setAttribute("name", "9F4E");
                        String n = Utils.hexToString(nameAndL.getBytes());
                        v.setTextContent(n);
                        app.appendChild(v);
                    }

                    // import terminal private data
                    if (mxml != null) {
                        Document mdoc = Utils.parseXml(mxml);
                        if (mdoc != null) {
                            Element mroot = mdoc.getDocumentElement();
                            if (mroot != null) {
                                Node node = mroot.getFirstChild();
                                while (node != null) {
                                    if (node.getNodeType() == Node.ELEMENT_NODE) {
                                        root.appendChild(doc.importNode(node, true));
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
        catch (Exception ex)
        {
            doc = null;
        }
        if (doc == null)
            return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<String>(xmlDocumentToString(doc), HttpStatus.OK);
    }

    @PostMapping("conf/incrementstage")
    public ResponseEntity<Object> incrementStage(@Valid @RequestBody Map<String, String> map) {
        String stage = map.get("stage");
        String st = Utils.incrementStage(stage);
        HashMap<String, String> xmap = new HashMap<>();
        xmap.put("stage", st);
        return new ResponseEntity<Object>(xmap, HttpStatus.OK);
    }
    /*
    terminal messages
    <tm>
        <sn>1234567890123456</sn>
        <ts>20200324070530</ts> //local time
        <state>ok</state>
    </tm>

    empty response to keep-alive
    <tm/>

    response to keep-alive with command
    <tm>
        <cmd>
            <code>info</code>
            <id>abcd-12-ed45...</id>
        </cmd>
    </tm>

    response to command
    <tm>
        <rsp>
            <id>abcd-12-ed45...</id>
            <status>ok</status>
        </rsp>
    </tm>

    cmd field syntax
    <command>:<status>
    <command> = code.id
    id = guid
    <status> = statuscode.payload(base64)
     */

    @PostMapping(value="conf/{model}/message", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> deviceKeepAlive(@PathVariable(value = "model") String model, @RequestBody String xml) {
        Document doc = Utils.parseXml(xml);
        Document rsp = Utils.createXml("tm");
        if ("tm".equals(Utils.getRootName(doc)))
        {
            String sn = Utils.getValue(doc, "sn", null);
            if (sn != null)
            {
                Optional<Terminal> tt = terminalRepository.findByModelAndSerial(model.toUpperCase(), sn);
                if (tt.isPresent()) {
                    Terminal t = tt.get();
                    List<Command> cc = commandRepository.findByTerminal(t.id);
                    if (cc.size() > 0)
                    {
                        Command c = cc.get(0);
                        if ("pending".equals(c.status))
                        {
                            c.status = "sent";
                            commandRepository.save(c);
                            Document cmd = Utils.parseXml(c.cmd);
                            Element root = rsp.getDocumentElement();
                            root.appendChild(rsp.importNode(cmd.getDocumentElement(), true));
                            Element cid = rsp.createElement("id");
                            cid.setTextContent(String.valueOf(c.id));
                            root.appendChild(cid);
                            String code = Utils.getValue(root, "code", "");
                            if ("updatesoftware".equals(code))
                            {
                                Element map = rsp.createElement("appmap");
                                for (TerminalApplication a : t.applications)
                                {
                                    Element app = rsp.createElement("app");
                                    Element v = rsp.createElement("id");
                                    v.setTextContent(String.valueOf(a.id));
                                    app.appendChild(v);
                                    v = rsp.createElement("typetag");
                                    v.setTextContent(a.typeTag);
                                    app.appendChild(v);
                                    v = rsp.createElement("name");
                                    v.setTextContent(a.name);
                                    app.appendChild(v);
                                    v = rsp.createElement("tag");
                                    v.setTextContent(a.tag);
                                    app.appendChild(v);
                                    v = rsp.createElement("version");
                                    v.setTextContent(a.version);
                                    app.appendChild(v);
                                    map.appendChild(app);
                                }
                                root.appendChild(map);
                            }
                        }
                        else if ("sent".equals(c.status))
                        {
                            String rst = Utils.getValue(doc, "rsp.status", null);
                            if (rst != null)
                            {
                                String rid = Utils.getValue(doc, "rsp.id", null);
                                if (String.valueOf(c.id).equals(rid))
                                {
                                    c.result = Utils.xmlDocumentToString(doc);
                                    c.status = "completed";
                                    commandRepository.save(c);
                                }
                            }
                        }
                    }
                }
            }
            return new ResponseEntity<>(xmlDocumentToString(rsp), HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value="conf/{model}/message2", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> deviceKeepAlive2(@PathVariable(value = "model") String model, @RequestBody String xml) {
        Document doc = Utils.parseXml(xml);
        Document rsp = Utils.createXml("tm");
        if ("tm".equals(Utils.getRootName(doc)))
        {
            String sn = Utils.getValue(doc, "sn", null);
            if (sn != null)
            {
                Optional<Terminal> tt = terminalRepository.findByModelAndSerial(model.toUpperCase(), sn);
                if (tt != null) {
                    Terminal t = tt.get();
                    // first check we have anything in terminal's cmd field
                    String cmd = t.cmd;
                    if (cmd != null && cmd.length() > 0) {
                        String[] sa = cmd.split(":");
                        String status = sa[1]; //should always be
                        if ("pending".equals(status)) //need to send
                        {
                            String[] x = sa[0].split("\\.");
                            Element v = rsp.createElement("cmd");
                            v.setTextContent(x[0]);
                            rsp.getDocumentElement().appendChild(v);
                            v = rsp.createElement("id");
                            v.setTextContent(x[1]);
                            rsp.getDocumentElement().appendChild(v);
                            t.cmd = x[0] + "." + x[1] + ":" + "sent";
                            terminalRepository.save(t);
                        }
                        else if ("sent".equals(status)) // expect response. otherwse ignore
                        {
                            String rst = Utils.getValue(doc, "rsp.status", null);
                            if ( rst != null && status.length() > 0)
                            {
                                String rid = Utils.getValue(doc, "rsp.id", null);
                                String[] x = sa[0].split("\\."); // x[1] -> id
                                if (rid != null && rid.length() > 0 && rid.equals(x[1]))
                                {
                                    //get response payload
                                    Element payload = Utils.getNode(doc, "rsp.payload");
                                    t.cmd = sa[0] + ":" + rst; // change command status
                                    if (payload != null) {
                                        byte[] b = Utils.xmlElementToString(payload).getBytes();
                                        String p = Base64.getEncoder().encodeToString(b);
                                        t.cmd += "." + p;
                                    }
                                    terminalRepository.save(t);
                                }
                            }
                        }
                    }
                }
            }
            return new ResponseEntity<>(xmlDocumentToString(rsp), HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value="conf/{model}/application", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<Resource> getApplicationFile(@PathVariable(value = "model") String model, @RequestBody String xml) {
        Document rsp = Utils.createXml("appmap");
        try {
            Document doc = Utils.parseXml(xml);
            if ("getapp".equals(Utils.getRootName(doc))) {
                String sn = Utils.getValue(doc, "sn", null);
                String id = Utils.getValue(doc, "appid", null);
                Optional<Terminal> tt = terminalRepository.findByModelAndSerial(model, sn);
                if (!tt.isPresent())
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                Terminal t = tt.get();
                for (TerminalApplication ta : t.applications) {
                    if (String.valueOf(t.id).equals(id))
                    {
                        Path p = Paths.get(applicationPrivateProperties.getUploadDir(), ta.path).toAbsolutePath().normalize();
                        //ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(p));
                        InputStreamResource resource = new InputStreamResource(new FileInputStream(p.toString()));

                        return ResponseEntity.ok()
                                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ta.fileName + "\"")
                                .body(resource);
                    }
                }
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {

        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value="conf/{model}/appmap", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> checkUpdates(@PathVariable(value = "model") String model, @RequestBody String xml) {
        Document rsp = Utils.createXml("appmap");
        try {
            Document doc = Utils.parseXml(xml);
            if ("getappmap".equals(Utils.getRootName(doc))) {
                String sn = Utils.getValue(doc, "sn", null);
                Element map = rsp.createElement("appmap");
                rsp.getDocumentElement().appendChild(map);
                Element v;
                Optional<Terminal> tt = terminalRepository.findByModelAndSerial(model, sn);
                if (tt.isPresent()) {
                    Terminal t = tt.get();
                    Set<TerminalApplication> list = t.applications;
                    for (TerminalApplication a : list) {
                        Element app = rsp.createElement("app");
                        v = rsp.createElement("id");
                        v.setTextContent(String.valueOf(a.id));
                        app.appendChild(v);
                        v = rsp.createElement("typetag");
                        v.setTextContent(a.typeTag);
                        app.appendChild(v);
                        v = rsp.createElement("name");
                        v.setTextContent(a.name);
                        app.appendChild(v);
                        v = rsp.createElement("tag");
                        v.setTextContent(a.tag);
                        app.appendChild(v);
                        v = rsp.createElement("version");
                        v.setTextContent(a.version);
                        app.appendChild(v);
                        map.appendChild(app);
                    }
                }
                v = rsp.createElement("status");
                v.setTextContent("ok");
                rsp.getDocumentElement().appendChild(v);

                return new ResponseEntity<>(xmlDocumentToString(rsp), HttpStatus.OK);
            }
        }
        catch (Exception ex) {
            String msg = ex.getMessage();
            if (msg != null && msg.startsWith("#"))
            {
                msg = msg.substring(1);
                Element v = rsp.createElement("status");
                v.setTextContent("failed");
                rsp.getDocumentElement().appendChild(v);
                v = rsp.createElement("message");
                v.setTextContent(msg);
                rsp.getDocumentElement().appendChild(v);
                return new ResponseEntity<>(xmlDocumentToString(rsp), HttpStatus.OK);
            }
        }
        return new ResponseEntity(HttpStatus.NOT_FOUND);

    }

    @PostMapping(value="conf/{model}/parameters", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> requestKeys(@PathVariable(value = "model") String model, @RequestBody String xml) {
        Document rsp = Utils.createXml("keyrequest");
        try {
            Document doc = Utils.parseXml(xml);
            if ("keyrequest".equals(Utils.getRootName(doc))) {
                String sn = Utils.getValue(doc, "sn", null);
                String tid = Utils.getValue(doc, "tid", null);

                Element v = rsp.createElement("sn");
                v.setTextContent(sn);
                rsp.getDocumentElement().appendChild(v);

                v = rsp.createElement("tid");
                v.setTextContent(tid);
                rsp.getDocumentElement().appendChild(v);

                Element keys = rsp.createElement("keys");
                rsp.getDocumentElement().appendChild(keys);

                Optional<Terminal> tt = terminalRepository.findByModelAndSerial(model, sn);
                if (tt == null)
                    throw new Exception("#terminalnotfound");
                Terminal t = tt.get();
                if ((t.terminalKeys == null) || (t.terminalKeys.size() == 0))
                    throw new Exception("#terminaldoesnothavekeys");
                if (t.tid == null || t.tid.isEmpty())
                    throw new Exception("#terminalidnotdefined");
                for (InnerTerminalKey key: t.terminalKeys) {
                    if (key.keyLoader == null || key.keyLoader.url == null || key.keyLoader.url.isEmpty())
                        throw new Exception("keyloaderisnotdefinedormisconfigured");
                    String res = KeyManager.readKey(key.keyLoader.url, t.tid, t.sn, key.keyLoader.keyTag, t.keyLoaderCert, key.material);
                    if (res == null || res.isEmpty())
                        res = "#failed";
                    if (res.startsWith("#"))
                        throw new Exception(res);

                    Element tkey = rsp.createElement("key");
                    keys.appendChild(tkey);

                    v = rsp.createElement("value");
                    v.setTextContent(res);
                    tkey.appendChild(v);

                    v = rsp.createElement("tag");
                    v.setTextContent(key.tag);
                    tkey.appendChild(v);

                }

                v = rsp.createElement("status");
                v.setTextContent("ok");
                rsp.getDocumentElement().appendChild(v);

                return new ResponseEntity<>(xmlDocumentToString(rsp), HttpStatus.OK);

            }
        } catch (Exception ex) {
            String msg = ex.getMessage();
            if (msg != null && msg.startsWith("#"))
            {
                msg = msg.substring(1);
                Element v = rsp.createElement("status");
                v.setTextContent("failed");
                rsp.getDocumentElement().appendChild(v);
                v = rsp.createElement("message");
                v.setTextContent(msg);
                rsp.getDocumentElement().appendChild(v);
                return new ResponseEntity<>(xmlDocumentToString(rsp), HttpStatus.OK);
            }
        }
        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

    @GetMapping(value="conf/{model}/common/{name}", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getConfigBundle(@PathVariable(value = "model") String model, @PathVariable(value = "name") String confName) {
        try {
            if (confName.startsWith("header_")) {
                Long packid = Long.parseLong(confName.substring(7));
                Optional<ConfPack> pack = packRepository.findById(packid);
                if (pack == null)
                    return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
                Document doc = Utils.createXml("hconf");
                for (InnerConfTemplate ct : pack.get().confTemplates) {
                    if ("terminal".equals(ct.tag))
                        continue;
                    Element inc = doc.createElement("include");
                    inc.setAttribute("root", ct.tag);
                    inc.setAttribute("name", ct.name);
                    inc.setAttribute("stage", ct.stage);
                    inc.setAttribute("src", "/common/" + ct.tag + "_" + ct.id);
                    doc.getDocumentElement().appendChild(inc);
                }
                return new ResponseEntity<String>(xmlDocumentToString(doc), HttpStatus.OK);
            } else {
                int pos = confName.lastIndexOf("_");
                if (pos > 0) {
                    Long confid = Long.parseLong(confName.substring(pos + 1));
                    Optional<ConfTemplate> ct = confTemplateRepository.findById(confid);
                    if (ct != null) {
                        Document doc = Utils.parseXml(ct.get().xml);
                        Element root = doc.getDocumentElement();
                        root.setAttribute("name", ct.get().name);
                        root.setAttribute("stage", ct.get().stage);
                        return new ResponseEntity<String>(xmlDocumentToString(doc), HttpStatus.OK);
                    }
                }
            }
            return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
        }
        catch (Exception ex)
        {
            return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
