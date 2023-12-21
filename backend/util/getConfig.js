const crypto = require("crypto");

const getConfig = (encryptedData) => {
  try {
    var encryptionMethod = "AES-256-CBC";
    var secret = "roAdvl!i$nk#freightroAdvl!i$nk#f";
    var iv = "1234567891011121";
    var decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
    return (
      decryptor.update(encryptedData, "base64", "utf8") +
      decryptor.final("utf8")
    );
  } catch (error) {
    console.error("decryptData:: error in encryptedData decryption - ", error);
  }
};

module.exports = { getConfig };
