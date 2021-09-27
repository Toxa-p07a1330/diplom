package ru.shtrih.kds.tools;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Joiner;
import com.google.common.base.Splitter;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.w3c.dom.*;

import org.xml.sax.InputSource;
import ru.shtrih.kds.model.Log;
import ru.shtrih.kds.repository.LogRepository;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Utils {

    public static byte[] stringToHex(String s)
    {
        byte[] hex;
        try
        {
            hex = Hex.decodeHex(s.toCharArray());
        }
        catch (DecoderException ex)
        {
            hex = null;
        }
        return hex;
    }

    public static String hexToString(byte[] b) {
        return Hex.encodeHexString(b, false);
    }


    public static Document createXml(String root)
    {
        try {
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            Document doc = docBuilder.newDocument();
            Element rootElement = doc.createElement(root);
            doc.appendChild(rootElement);
            return doc;
        }
        catch(Exception ex)
        {
            return null;
        }
    }

    static public String getValue(Document doc, String path, String defval)
    {
        if (doc == null)
            return defval;
        return getValue(doc.getDocumentElement(), path, defval);
    }

    static public String getRootName(Document doc)
    {
        if (doc == null)
            return null;
        Element root = doc.getDocumentElement();
        if (root == null)
            return null;
        return root.getTagName();
    }

    public static Element getDirectChild(Element parent, String name)
    {
        for(Node child = parent.getFirstChild(); child != null; child = child.getNextSibling())
        {
            if(child instanceof Element && name.equals(child.getNodeName())) return (Element) child;
        }
        return null;
    }

    static public String getValue(Element root, String path, String defval)
    {
        if (root == null)
            return defval;
        Element xe = root;
        try
        {
            String[] sa = path.split("\\.");
            for (String s : sa)
            {
                if (s.startsWith("a:"))
                {
                    Attr at = xe.getAttributeNode(s.substring(2));
                    if (at == null)
                        return defval;
                    return at.getValue();
                }
                else
                {
                    xe = getDirectChild(xe, s);
                }
            }
        }
        catch(Exception ex)
        {
            return defval;
        }
        return xe.getTextContent();
    }

    static public Element getNode(Document doc, String path)
    {
        if (doc == null)
            return null;
        return getNode(doc.getDocumentElement(), path);
    }

    static public Element getNode(Element root, String path)
    {
        if (root == null)
            return null;
        Element xe = root;
        try
        {
            String[] sa = path.split("\\.");
            for (String s : sa)
            {
                xe = getDirectChild (xe, s);
            }
        }
        catch(Exception ex)
        {
            return null;
        }
        return xe;
    }


    public static String xmlDocumentToString(Document xmlDocument)
    {
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer;
        try {
            transformer = tf.newTransformer();
            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(xmlDocument), new StreamResult(writer));
            return writer.getBuffer().toString();
        }
        catch (TransformerException e)
        {
        }
        catch (Exception e)
        {
        }
        return "";
    }

    public static String xmlElementToString(Element xmlElement)
    {
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer;
        try {
            transformer = tf.newTransformer();
            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(xmlElement), new StreamResult(writer));
            return writer.getBuffer().toString();
        }
        catch (TransformerException e)
        {
        }
        catch (Exception e)
        {
        }
        return "";
    }

    public static Document parseXml(String xml)
    {
        try {
            DocumentBuilderFactory factory =
                    DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(xml)));
            return doc;
        }
        catch(Exception ex)
        {
            return null;
        }
    }

    public static List<Map<String,String>> stringToMap(String src)
    {
        try {
            return new ObjectMapper().readValue(src, List.class);
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public static String mapToString(List<Map<String,String>> map)
    {
        try {
            return new ObjectMapper().writeValueAsString(map);
        }
        catch (Exception ex)
        {
            return null;
        }
    }

//    public static String mapToString(Map<String, String> map) {
//        return Joiner.on(",").withKeyValueSeparator("=").join(map);
//    }

//    public static Map<String, String> stringToMap(String mapAsString) {
//        return Splitter.on(',').withKeyValueSeparator('=').split(mapAsString);
//    }

    public static Element nsReadXml(DataInputStream ns) {
        return deserialize(nsRead(ns));
    }

    public static byte[] nsRead(DataInputStream ns)
    {
        try {
            byte[] bsz = new byte[4];
            int cbRet = ns.read(bsz, 0, bsz.length);
            if (cbRet != 4)
                throw new Exception("Network read error");
            int sz = bsz[0] * 0x1000000 + bsz[1] * 0x10000 + bsz[2] * 0x100 + bsz[3];
            if ((sz > 8096) || (sz < 1))
                throw new Exception("Invalid data size");
            int ReadCount = 0;
            byte[] req = new byte[sz];
            while (ReadCount < sz) {
                int cnt = ns.read(req, ReadCount, sz - ReadCount);
                ReadCount += cnt;
            }
            return req;
        }
        catch(Exception ex)
        {

        }
        return null;
    }

    public static void nsWrite(DataOutputStream ns, Element data) {
        nsWrite(ns, serialize(data));
    }

    public static void nsWrite(DataOutputStream ns, byte[] buf)
    {
        byte[] bsz = new byte[4];
        int sz = buf.length;
        bsz[0] = (byte)((sz & 0xFF000000) >> 24);
        bsz[1] = (byte)((sz & 0x00FF0000) >> 16);
        bsz[2] = (byte)((sz & 0x0000FF00) >> 8);
        bsz[3] = (byte)(sz & 0x000000FF);
        try {
            ns.write(bsz, 0, bsz.length);
            ns.write(buf, 0, buf.length);
            ns.flush();
        }
        catch (Exception ex)
        {
            int i = 0;

        }
    }

    public static byte[] serialize(Element data)
    {
        return Utils.xmlElementToString(data).getBytes();
    }

    public static Element deserialize(byte[] data)
    {
        if (data == null)
            return null;
        Document doc;
        Element xe;
        try
        {
            doc = Utils.parseXml(new String(data));
            xe = doc.getDocumentElement();
        }
        catch (Exception ex)
        {
            xe = null;
        }
        return xe;
    }

    public static Element makeResponse(Command cmd, ErrorCode ecode)
    {
        Document doc = Utils.createXml(cmd.toString().toLowerCase());
        Element xe = doc.getDocumentElement();
        Element st = doc.createElement("status");
        st.setTextContent(ecode.toString().toLowerCase());
        xe.appendChild(st);
        return xe;
    }

    public static Element makeCommand(Command cmd)
    {
        Document doc = Utils.createXml(cmd.toString().toLowerCase());
        return doc.getDocumentElement();
    }

    public static Command getCommandCode(Element req)
    {
        if (req == null)
            return Command.undefined;
        Command cmd;
        String name = req.getTagName();
        cmd  = Command.valueOf(name);
        return cmd;
    }

    public static ErrorCode getErrorCode(Element req)
    {
        return ErrorCode.valueOf(Utils.getValue(req, "status", "undefined"));
    }

    public static String incrementStage(String stage)
    {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd.");
        String st = dateFormat.format(new Date());
        Long v = 0L;
        if (((stage != null) && stage.length() >= 11) && (stage.charAt(10) == '.') && stage.substring(0, 11).equals(st))
        {
            v = Long.parseLong(stage.substring(11));
        }
        st  += (++v).toString();
        return st;
    }


    public static String ComputeHash(String pwd, String salt)
    {
        MessageDigest digest;
        byte[] w = org.springframework.security.crypto.codec.Hex.decode(new String(org.springframework.security.crypto.codec.Hex.encode(pwd.getBytes())) + salt);
        try {
            digest = MessageDigest.getInstance("SHA-256");
        }
        catch (Exception ex)
        {
            return new String();
        }
        return new String(org.springframework.security.crypto.codec.Hex.encode(digest.digest(w)));
    }

    public static ResponseEntity<Object> UniqueTest(Exception ex, String name, String message)
    {
        if (ex.getMessage().contains(name + "_UNIQUE")) {
            return ErrorResponse(message);
        }
        return null;
    }

    public static ResponseEntity<Object> ErrorResponse(String message)
    {
        HashMap<String, String> map = new HashMap<>();
        map.put("error", message);
        return ResponseEntity.ok(map);
    }


}

