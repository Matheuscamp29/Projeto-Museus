package security;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Key;
import java.util.Base64;
import java.util.Properties;

public class DecryptConfigFile {
    public static Properties decryptFile(String secretKey, String encryptedFilePath) throws Exception {
        Key key = new SecretKeySpec(Base64.getDecoder().decode(secretKey), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] encryptedData = Files.readAllBytes(Paths.get(encryptedFilePath));
        byte[] decryptedData = cipher.doFinal(encryptedData);

        Properties props = new Properties();
        try (FileInputStream fis = new FileInputStream(encryptedFilePath)) {
            props.load(new java.io.ByteArrayInputStream(decryptedData));
        }
        return props;
    }
}
