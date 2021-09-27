package ru.shtrih.kds.tools;


import jdk.nashorn.internal.runtime.options.Option;
import org.bouncycastle.asn1.*;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.ExtendedKeyUsage;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.KeyPurposeId;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.openssl.MiscPEMGenerator;
import org.bouncycastle.openssl.jcajce.JcaMiscPEMGenerator;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.util.io.pem.PemObjectGenerator;
import org.bouncycastle.util.io.pem.PemWriter;
import org.springframework.remoting.support.DefaultRemoteInvocationExecutor;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import ru.shtrih.kds.KdsApplication;
import ru.shtrih.kds.model.Activator;
import ru.shtrih.kds.model.Terminal;
import ru.shtrih.kds.model.TerminalModel;
import ru.shtrih.kds.repository.ActivatorRepository;
import ru.shtrih.kds.repository.TerminalRepository;

import javax.security.auth.x500.X500Principal;
import javax.xml.bind.annotation.XmlElement;
import java.io.*;
import java.math.BigInteger;
import java.net.InetSocketAddress;
import java.net.Socket;

import java.security.*;
import java.security.cert.X509Certificate;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static ru.shtrih.kds.tools.Utils.*;

public class Reset {

    public static Object[] LoadCA(String bundle, String pwd)
    {
        Object[] res = new Object[2];
        byte[] b = Base64.getDecoder().decode(bundle);
        ByteArrayInputStream s =  new ByteArrayInputStream(b);
        try {
            KeyStore ps = KeyStore.getInstance("PKCS12");
            ps.load(s, pwd.toCharArray());
            String alias  = ps.aliases().nextElement();
            res[0] = ps.getCertificate(alias);
            res[1] = ps.getKey(alias, pwd.toCharArray());
            return res;
        }
        catch(Exception ex)
        {

        }
        return null;
    }

    public static void beginReset(Activator act, ActivatorRepository activatorRepository, TerminalRepository terminalRepository)
    {
        KdsApplication.logger.info("begin reset");
        ExecutorService ex = Executors.newFixedThreadPool(1);
        ex.execute(() ->{
            sendRunReset(act, activatorRepository, terminalRepository);
        });

    }
    public static String appendCommand(Long id, ActivatorRepository activatorRepository, String cmd)
    {
        String res = null;
        Optional<Activator> a = activatorRepository.findById(id);
        if (a != null)
        {
            Activator act = a.get();
            List<Map<String, String>> list = Utils.stringToMap(act.cmd);
            if (list == null)
                list = new ArrayList<>();
            Map<String, String> map = new HashMap<>();
            map.put("command", cmd);
            map.put("status", "pending");
            list.add(map);
            act.cmd = Utils.mapToString(list);
            activatorRepository.save(act);
            res = act.cmd;
        }
        return res;
    }

    public static boolean setStatus(Long id, ActivatorRepository activatorRepository, String status)
    {
        boolean active = false;
        Optional<Activator> a = activatorRepository.findById(id);
        if (a != null)
        {
            Activator act = a.get();
            List<Map<String, String>> list = Utils.stringToMap(act.cmd);
            int cnt = list.size();
            if (list != null && cnt > 0) {
                list.get(cnt - 1).put("status", status);
                act.cmd = Utils.mapToString(list);
                activatorRepository.save(act);
            }
            active = "active".equals(act.activeFlag);
        }
        return active;
    }

    public static boolean isActive(Long id, ActivatorRepository activatorRepository)
    {
        boolean active = false;
        Optional<Activator> a = activatorRepository.findById(id);
        if (a != null)
        {
            active = "active".equals(a.get().activeFlag);
        }
        return active;
    }

    public static void sendRunReset(Activator act,
                                    ActivatorRepository activatorRepository,
                                    TerminalRepository terminalRepository)
    {
        KdsApplication.logger.info("send run reset");
        Socket socket = new Socket();
        try {
            boolean isConnected = false;

            KdsApplication.logger.info(act.cmd);

            socket.connect(new InetSocketAddress(act.terminalIp, 4433), 5000);
            Element cmd = Utils.makeCommand(Command.runreset);
            DataInputStream in = new DataInputStream(new BufferedInputStream(socket.getInputStream()));
            DataOutputStream out = new DataOutputStream(new BufferedOutputStream(socket.getOutputStream()));


            if (!setStatus(act.id, activatorRepository, "done"))
                throw new Exception("#canceled");
            appendCommand(act.id, activatorRepository, "connectterminal");

            KdsApplication.logger.info("connect terminal");

            nsWrite(out, cmd);
            while (true) {
                Element req = Utils.nsReadXml(in);
                Command msg = getCommandCode(req);
                if (msg == Command.runreset)
                {
                    ErrorCode ec = getErrorCode(req);

                    KdsApplication.logger.info("runreset respond with " + ec.toString());

                    setStatus(act.id, activatorRepository, "done");
                    appendCommand(act.id, activatorRepository, "result");
                    setStatus(act.id, activatorRepository, ec.toString());
                    try {
                        String sn = Utils.getValue(req, "sn", null);
                        String cert = Utils.getValue(req, "cert", null);
                        String model = act.terminalModel.getName();
                        if (sn != null && model != null && cert != null && sn.length() > 0 && model.length() > 0 && cert.length() > 0) {
                            Terminal t;
                            Optional<Terminal> tt = terminalRepository.findByModelAndSerial(model, sn);
                            if (tt == null)
                            {
                                t = new Terminal();
                                t.sn = sn;
                                t.terminalModel = new TerminalModel(act.terminalModel.getId());
                            }
                            else
                                t = tt.get();
                            t.keyLoaderCert = cert;
                            terminalRepository.save(t);
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    break;
                }
                else if (msg == Command.keepalive)
                {
                    if (!isActive(act.id, activatorRepository))
                    {
                        KdsApplication.logger.info("send cancel to keepalive");
                        Element rsp = makeResponse(Command.keepalive, ErrorCode.cancelled);
                        nsWrite(out, serialize(rsp));
                        continue;
                    }
                    String s = Utils.getValue(req, "reset-connected-indicator", "0");
                    if (!isConnected && "0".equals(s))
                    {
                        isConnected = true;
                        if (!setStatus(act.id, activatorRepository, "done"))
                            throw new Exception("#canceled");
                        appendCommand(act.id, activatorRepository, "waitforactivator");
                        isConnected = true;
                        KdsApplication.logger.info(act.cmd);

                        // Do reset exchange
                        ExecutorService ex = Executors.newFixedThreadPool(1);
                        ex.execute(() ->{
                            doReset(act, activatorRepository, socket);
                        });
                    }
                    Element rsp = makeResponse(Command.keepalive, ErrorCode.ok);
                    nsWrite(out, serialize(rsp));

                }
                else
                    throw new Exception("#protocolerror");
            }
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.startsWith("#"))
                msg = msg.substring(1);
            else
                msg = "failed";
            setStatus(act.id, activatorRepository, msg);
            appendCommand(act.id, activatorRepository, "result");
            setStatus(act.id, activatorRepository, "failed");
        }
        try
        {
            if (socket != null && !socket.isClosed())
                socket.close();
        }
        catch (Exception ex)
        {

        }
    }

    public static RSAPublicKey getPublicKeyFromPemString(String key) {
        try {
            String publicKeyPEM = key;
            publicKeyPEM = publicKeyPEM.replace("-----BEGIN PUBLIC KEY-----", "");
            publicKeyPEM = publicKeyPEM.replace("-----END PUBLIC KEY-----", "");
            publicKeyPEM = publicKeyPEM.replace("\n", "");
            publicKeyPEM = publicKeyPEM.replace("\r", "");

            byte[] encoded = Base64.getDecoder().decode((publicKeyPEM));
            KeyFactory kf = KeyFactory.getInstance("RSA");
            RSAPublicKey pubKey = (RSAPublicKey) kf.generatePublic(new X509EncodedKeySpec(encoded));
            return pubKey;
        }
        catch (Exception ex)
        {
            return  null;
        }
    }

    public static String writeCertificateToPemString(X509Certificate cert) {
        try {
            StringWriter st = new StringWriter();
            PemWriter pw = new PemWriter(st);
            PemObjectGenerator g = new JcaMiscPEMGenerator(cert);
            pw.writeObject(g);
            pw.flush();
            return st.toString();
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public static Element makeCert(String deviceId, String sn, String pubkey, X509Certificate ca, RSAPrivateKey privkey)
    {
        try {

            final Instant now = Instant.now();
            final Date from = Date.from(now.minus(Duration.ofDays(1)));
            final Date to = Date.from(now.plus(Duration.ofDays(3650)));

            String subj = "CN=" + deviceId + ",O=YARUS,C=RU,ST=Moscow,L=Moscow";
            //String iss = "CN=SVCRK, O=Test CA, C=RU, ST=Moscow, L=Moscow";
            X500Principal issuer = new X500Principal(ca.getSubjectDN().getName());
            X500Principal subject = new X500Principal(subj);
            RSAPublicKey pub = getPublicKeyFromPemString(pubkey);
            byte[] id = new byte[20];
            SecureRandom random = new SecureRandom();
            random.nextBytes(id);
            BigInteger serial = BigInteger.ONE; //(160, random);

            X509v3CertificateBuilder cb = new JcaX509v3CertificateBuilder(
                    issuer, serial, from, to, subject, pub);
            cb.addExtension(new ASN1ObjectIdentifier("1.2.643.51.4"), false, new ASN1Integer(1));
            cb.addExtension(new ASN1ObjectIdentifier("1.2.643.51.6"), false, new DERUTF8String(sn));
            cb.addExtension(Extension.extendedKeyUsage, false, new ExtendedKeyUsage(KeyPurposeId.id_kp_clientAuth));

            SecureRandom r = new SecureRandom();

            ContentSigner sigGen = new JcaContentSignerBuilder("SHA256withRSA").build(privkey);
            X509CertificateHolder h = cb.build(sigGen);
            X509Certificate cert = new JcaX509CertificateConverter().getCertificate( h );

            Document doc = Utils.createXml("signed-cert");

            String pem = writeCertificateToPemString(cert);
            Element x = doc.createElement("cert");
            x.setTextContent(Utils.hexToString(pem.getBytes()));
            doc.getDocumentElement().appendChild(x);

            pem = writeCertificateToPemString(ca);
            x = doc.createElement("ca");
            x.setTextContent(Utils.hexToString(pem.getBytes()));
            doc.getDocumentElement().appendChild(x);

            return doc.getDocumentElement();
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public static void doReset(Activator ac, ActivatorRepository activatorRepository, Socket cmdsocket)
    {
        KdsApplication.logger.info("do reset");
        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(ac.terminalIp, 4434), 5000);
            DataInputStream in = new DataInputStream(new BufferedInputStream(socket.getInputStream()));
            DataOutputStream out = new DataOutputStream(new BufferedOutputStream(socket.getOutputStream()));

            if (!setStatus(ac.id, activatorRepository, "done"))
                throw new Exception("#canceled");
            appendCommand(ac.id, activatorRepository, "createconfcert");

            KdsApplication.logger.info("createconfcert");

            nsWrite(out, serialize(makeCommand(Command.reset)));
            Element req = deserialize(nsRead(in));
            Command cmd = getCommandCode(req);
            if (cmd != Command.signconfigclientcertificate)
                throw new Exception("#protocolerror");
            Object[] obj = LoadCA(ac.confCa, "YARUSLTD");
            if (obj == null)
                throw new Exception("#confcaerror");
            Element cert = makeCert(
                    Utils.getValue(req, "device-identifier", "undefined"),
                    Utils.getValue(req, "sn", "undefined"),
                    Utils.getValue(req, "key", null),
                    (X509Certificate)obj[0], (RSAPrivateKey) obj[1]);
            if (cert == null) {
                Element rsp = makeResponse(cmd, ErrorCode.failed);
                nsWrite(out, serialize(rsp));
                throw new Exception("#confcerterror");
            }
            Element rsp = makeResponse(cmd, ErrorCode.ok);
            rsp.appendChild(rsp.getOwnerDocument().importNode(cert, true));
            nsWrite(out, serialize(rsp));

            if (!setStatus(ac.id, activatorRepository, "done"))
                throw new Exception("#canceled");
            appendCommand(ac.id, activatorRepository, "createkldcert");

            KdsApplication.logger.info("createkldcert");

            // keyloader cert
            req = deserialize(nsRead(in));
            cmd = getCommandCode(req);
            if (cmd != Command.signkeyloaderclientcertificate)
                throw new Exception("#protocolerror");
            obj = LoadCA(ac.kldCa, "YARUSLTD");
            if (obj == null)
                throw new Exception("#kldcaerror");
            cert = makeCert(
                    Utils.getValue(req, "device-identifier", "undefined"),
                    Utils.getValue(req, "sn", "undefined"),
                    Utils.getValue(req, "key", null),
                    (X509Certificate)obj[0], (RSAPrivateKey) obj[1]);
            if (cert == null) {
                rsp = makeResponse(cmd, ErrorCode.failed);
                nsWrite(out, serialize(rsp));
                throw new Exception("#kldcerterror");
            }
            rsp = makeResponse(cmd, ErrorCode.ok);
            rsp.appendChild(rsp.getOwnerDocument().importNode(cert, true));
            nsWrite(out, serialize(rsp));

            KdsApplication.logger.info("createacquirercert");

            if (!setStatus(ac.id, activatorRepository, "done"))
                throw new Exception("#canceled");
            appendCommand(ac.id, activatorRepository, "createacquirercert");

            // acquirer cert

            req = deserialize(nsRead(in));
            cmd = getCommandCode(req);
            if (cmd != Command.signacquirerclientcertificate)
                throw new Exception("#protocolerror");
            obj = LoadCA(ac.acquirerCa, "YARUSLTD");
            if (obj == null)
                throw new Exception("#acqcaerror");
            cert = makeCert(
                    Utils.getValue(req, "device-identifier", "undefined"),
                    Utils.getValue(req, "sn", "undefined"),
                    Utils.getValue(req, "key", null),
                    (X509Certificate)obj[0], (RSAPrivateKey) obj[1]);
            if (cert == null) {
                rsp = makeResponse(cmd, ErrorCode.failed);
                nsWrite(out, serialize(rsp));
                throw new Exception("#acquirercerterror");
            }
            rsp = makeResponse(cmd, ErrorCode.ok);
            rsp.appendChild(rsp.getOwnerDocument().importNode(cert, true));
            nsWrite(out, serialize(rsp));

            KdsApplication.logger.info("updatetmscredentials");


            if (!setStatus(ac.id, activatorRepository, "done"))
                throw new Exception("#canceled");
            appendCommand(ac.id, activatorRepository, "updatetmscredentials");

            // tms credentials

            req = deserialize(nsRead(in));
            cmd = getCommandCode(req);
            if (cmd != Command.queryconfigcredentials)
                throw new Exception("#protocolerror");
            rsp = makeResponse(cmd, ErrorCode.ok);
            Element cd = rsp.getOwnerDocument().createElement("confdata");
            Element v = rsp.getOwnerDocument().createElement("cert");
            String x = Utils.hexToString(Base64.getDecoder().decode(ac.tmsCa));
            v.setTextContent(x);
            cd.appendChild(v);
            v = rsp.getOwnerDocument().createElement("sign");
            x = Utils.hexToString(Base64.getDecoder().decode(ac.tmsCaSign));
            v.setTextContent(x);
            cd.appendChild(v);
            v = rsp.getOwnerDocument().createElement("url");
            v.setTextContent(ac.confUrl);
            cd.appendChild(v);
            rsp.appendChild(cd);
            nsWrite(out, serialize(rsp));

            // response to reset

            req = deserialize(nsRead(in));
            cmd = getCommandCode(req);
            if (cmd != Command.reset)
                throw new Exception("#protocolerror");
            ErrorCode ec = getErrorCode(req);
            if (ec != ErrorCode.ok)
                throw new Exception(ec.toString());

            if (!setStatus(ac.id, activatorRepository, "done"))
                throw new Exception("#canceled");

        }
        catch(Exception ex)
        {
            try {
                    String msg = ex.getMessage();
                    if (msg != null && msg.startsWith("#"))
                        msg = msg.substring(1);
                    else
                        msg = "failed";
                    KdsApplication.logger.info("exception 1 " + msg);
                    setStatus(ac.id, activatorRepository, msg);
                    appendCommand(ac.id, activatorRepository, "result");
                    setStatus(ac.id, activatorRepository, "failed");
                if (cmdsocket != null && !cmdsocket.isClosed())
                        cmdsocket.close();
            }
            catch (Exception exx)
            {

            }
        }
    }
}
