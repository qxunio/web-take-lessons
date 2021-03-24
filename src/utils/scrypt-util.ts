let lib = require("jsencrypt/bin/jsencrypt.js");

export class ScryptUtil {

    /**
     * 加密
     * @param data 数据
     * @param key KEY
     */
    public static RSAEncrypt(data?: string, key?: string) {
        let jse = new lib.JSEncrypt();
        jse.setPublicKey(key);
        return jse.encrypt(data);
    }


    /**
     * 解密
     * @param data 数据
     * @param key key
     */
    public static RSADecrypt(data?: string, key?: string) {
        let jse = new lib.JSEncrypt();
        jse.setPrivateKey(key);
        return jse.decrypt(data);
    }
}
