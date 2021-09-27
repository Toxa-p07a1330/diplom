package ru.shtrih.kds;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import ru.shtrih.kds.tools.ApplicationPrivateProperties;
import ru.shtrih.kds.tools.Utils;

import javax.crypto.Cipher;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

@SpringBootApplication
@EnableConfigurationProperties({ ApplicationPrivateProperties.class })
public class KdsApplication {
	public static final Logger logger = LoggerFactory.getLogger(KdsApplication.class);


	public static void main(String[] args) {
		SpringApplication.run(KdsApplication.class, args);

//		try {
//
//			String spk =
//					"MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDShj31imeYPKsz"+
//							"GyHpO2vKwScLcFgBn0BWv60zL8Vjqu8oXwD9YNyqk7Mp3wueGzJ+5qHl05UKuson"+
//							"8Bs40AzK09BQ/FWTKkpq+4Ax9xypxIce2EFp5rlPo3vcbDBI+Jtm2z0ho1sdS9MO"+
//							"bwukESK6TbroUIj/GGj0SNay/P+w68ZUh0AL/V/W7vtjQP/0DVxmE94Nykb/moxD"+
//							"J+81OVI3+FJM6OldtlFck97g3SdSEDsqGyYhz2UPrIqEiXqg46B6lo1CcZUfFPD5"+
//							"HKw4gmAsV6fmUuPPgxXBbXACKvVH58hrurHkzp/3/dEYno6eZIU6UY4cxPq0B13c"+
//							"KmagbdPHAgMBAAECggEAPRAE7rBrZePLAHLRPjYnCNNHgPDgBfBsF/1Wvm8PwN32"+
//							"qm4L+nJa7vsST4XLd9uJpPc+ZEwfgdI2CqmBK9RksXwIg0T9iUcN+MPkJhn37WH8"+
//							"kzzElHQAshHIPmH/C1tYr9fNfnFEX1X77MbWyIrT2Nfs669YXS12W8y4wYfSnjzu"+
//							"FpBH/VQnmk9Ulg5q2W0C/MO5vWBHrWMupQgv4uDNKNJW2uUVag3xXSprGqbJ/A1b"+
//							"z8IGbwb7FiemY+hCI19c5L24u7UxCm5Ny0VQaPU7XVyRVMzZoYaHKLFMXOh3aW7M"+
//							"zbsDE5aoOtrquBKLjOxZ4dJbyWBfjFsbBR0zRxht8QKBgQD0/zNQTVxk3NJGIrVp"+
//							"mYq8+3LPVX0G623tgxmZAOxVDQXpE53oSbu+lwAg4CdxJqxLN6ASzu6bIcyEroeD"+
//							"ZtA6DNchWVRKeDdFnZ2y0tgnwByYTO4/nIiwySzmBYt5X+cWpgWLgTMlOU+dn9er"+
//							"3TgBh0kRm43wgFs8CY6JTg27SQKBgQDb+rOPdWsqe7/TTlKALM3YdB0tyaJIOyMZ"+
//							"KkZgEzBX7dNYp+aZ7hqbPcMkuv2zAb6ujGMnrBEDgAac3UIAjRvCfWNyaNbf3HYM"+
//							"hCpxuU0831mix0YXfNgY8Z66hSuX8lDZQFR1EgoaNE1LyzvQYP3hOjpqOD86ntYe"+
//							"PMg4duqGjwKBgC+6E2X+XBRuDCyLkGms9qEQHvKTBdM2Q+j0FCWBT4jWC6O3JZjd"+
//							"3EwpoGXHJQfe78uLX4yqcUMZV301fsKzYbcdTz945nnHZ4URSmpOtrsvqqJkwjj0"+
//							"JpDB8BQzWlNfwmXgG85scek7e+4J+HrLkqCBmVNryT/j0WIlvnWzFeu5AoGBAJKf"+
//							"+T2fE05e686Jvx3mP1KOmsBhTMT+ffeRIRV61NdXE29dgqyJc7yUH1WFOgMuH44y"+
//							"zwirfS+rDz1RkWPSqnUppLamwMq4JQtUsQHadGwlp5aDYunW8ic2Lgm/J/6AqnkU"+
//							"kvbxjkBHKlph3b2YWMDeUf9o/GQzaR8Afqh8QvhrAoGBAN9bvDzwI7Xqa80hKmX8"+
//							"O+IMNLWt3BYUHkUi672g6tdtvcRSg6fnplqD8fAs4f9rIgEftNm5uR3kdD2AJ5so"+
//							"Uyw/65xS91rn/KOd9rOdcNeTCdcyFkHW+7DzL9wCFdhBFW8XUYC/RU51GggsRZO/"+
//							"jOHhNRqIUCEG+BK0K+rDdH04";
//
//			byte[] decoded = Base64.getDecoder().decode(spk);
//			PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
//			KeyFactory kf = KeyFactory.getInstance("RSA");
//			RSAPrivateKey pk = (RSAPrivateKey)kf.generatePrivate(spec);
////			Cipher cipher = Cipher.getInstance("RSA/ECB/NoPadding");
//			Cipher cipher = Cipher.getInstance("RSA");
//			cipher.init(Cipher.DECRYPT_MODE, pk);
//			String e = "093F36F3E9282246FB0193588237C46A43B4A8F881EFE7D7760E204C364BA960C28E2528C1DE6EE1E04CE02B4626811853CEE844ADA1F011AAF84F6A0A68229621733FACCB63CD3A9F2B628AB34C3359AAB34B4C09B48BDDD64DA01D03663812603BE73F515772D0423285EF38971E2D93E3C9EB1580395B1EE942378A8FB3F9615149FDA8EC794898DB2C4D95AA7647CD64F2EB9BD684EAEB5ABBE3AD2F01427DA027961710A939D0837FAA7CC78FF46A5627D722F3C091EDD33C4B03A80410D63B1060D2FD100DF236D07569F87C82030CCC6BFA082581DA05F7D3473B9E0AE88640F89A9F993395C8CC4562EBFA59A33387654F5FA4026E54DAB70184E93A";
//			//String e = "4ACC6B5D824EA2ABFE0E7DAC1D1471A347A03CB23E2164E4A21423EBFCD4AB1235FC06680402368F9D6B80F31E524DE6798B208725DB061252D2FC82373527BB64F84564F5F7CF003176C4025AF7848D02B1B2174A440025A564634AA81D04CB3E6FA006BF7F6300D2E85BD27F9193362071162B7B8BE094D4A6E01341554108CE8A9D8C7F0778CEDF8CF8F1477F7958FADB1E9A1088EC535FDBC6082AC9F9AC6B4148AEB0CE6FE8A07E49F240817825C940557AA85E9F93D97019DB1883C444ACDC252E2B6B39CEB23E6E48B0AD24B5C292DC40EB6C215D5DECDE9878B624B816EEA48A65B5F01D6128C38D0DE6CB0287C367B22D2CF5DD6394EBCCA730A613";
//			//String e = "A46B36AB82985BD9AD097FCAACCD40E9BEE67DF887935BE249708B681CB26D6397599BBC3530B905C08CEE8C0DA946307D4F6D271CFAF776CE45AC90E55097A34DF1EE923F306CF93E594CFEAA446225C1BFBDF6DBE6F8C613B2FBFAFB1A9E443C435848F7486858C6424A3032D21E96893AF07DF7944FF240F551D739FD60F99F22562CAB29C52FA75B66DB25D94004471B85759AC44DAC3A9DB8C1DB291DCE6E60D51CEB7B64025EC7D0A441DBCBD6810486AEFFEA5973E98A89ADB7F8A002321518DB61DDFA0C05B1CC4119F14A91016C29CF4A7B436C3C0736BB1A8C302EA307EFAC9132F7523A9EB6CEEF680C7AA01BBD227A1E93876502590818816A0E";
//			byte[] data = Utils.stringToHex(e);
//			byte[] dec = cipher.doFinal(data);
//			String x = Utils.hexToString(dec);
//			int a = 1;
//
//		} catch (Exception ex) {
//			int a = 2;
//		}

	}

	@Bean
	public CommonsRequestLoggingFilter requestLoggingFilter() {
		CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
		loggingFilter.setIncludeClientInfo(true);
		loggingFilter.setIncludeQueryString(true);
		loggingFilter.setIncludePayload(true);
		loggingFilter.setIncludeHeaders(true);
		loggingFilter.setMaxPayloadLength(64000);
		return loggingFilter;
	}


}

