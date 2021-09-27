package ru.shtrih.kds.tools;

import com.sun.javafx.fxml.builder.URLBuilder;
import org.springframework.web.util.UriBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;

import static ru.shtrih.kds.tools.Utils.*;

public class KeyManager {

    public static String readKey( String ip, String tid, String sn, String tag, String cert, String keyMaterial)
    {
        try
        {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(ip, 4433), 5000);
            DataInputStream in = new DataInputStream(new BufferedInputStream(socket.getInputStream()));
            DataOutputStream out = new DataOutputStream(new BufferedOutputStream(socket.getOutputStream()));
            Element cmd = makeCommand(Command.encryptkey);
            Document doc = cmd.getOwnerDocument();
            Element v = doc.createElement("cert");
            v.setTextContent(cert);
            cmd.appendChild(v);

            v = doc.createElement("payload");
            v.setTextContent(keyMaterial);
            cmd.appendChild(v);

            v = doc.createElement("tag");
            v.setTextContent(tag);
            cmd.appendChild(v);

            nsWrite(out, cmd);
            Element resp = nsReadXml(in);

            return Utils.getValue(resp, "keyblock", null);

        }
        catch(Exception ex)
        {

        }
        return null;
    }
}
