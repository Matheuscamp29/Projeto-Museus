package security;

import java.security.*;
import java.math.*;
public class MD5 {
    public static String Hash(String s) throws Exception{
    
        MessageDigest m=MessageDigest.getInstance("MD5");
        m.update(s.getBytes(),0,s.length());
        //System.out.println("Texto Original: " + s);
        s = new BigInteger(1,m.digest()).toString(16);
        //System.out.println("Texto Criptografado: "+ s);
        return s;
    }
}
