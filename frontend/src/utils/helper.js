var crypto = require("crypto");

export const day = 1000 * 60 * 60 * 24;

export function queryBuilder(url, query) {
  var newUrl = url;
  if (
    query &&
    Object.keys(query).length > 0 &&
    Object.values(query).find((v) => v && v != "")
  ) {
    newUrl += "?";
    Object.keys(query).map((q, index) => {
      if (query[q]) {
        if (index > 0 && newUrl.charAt(newUrl.length - 1) != "?") {
          newUrl += "&" + q + "=" + query[q];
        } else {
          newUrl += q + "=" + query[q];
        }
      }
    });
  }
  return newUrl;
}

export const handleSearch = (data, query, keys) => {
  // console.error(data)
  if (query) {
    var op = [];
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < keys.length; j++) {
        if (
          data[i][keys[j]] &&
          data[i][keys[j]]
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          !op.find((f) => f.id == data[i].id)
        ) {
          op.push(data[i]);
        }
      }
    }
    return op;
  } else {
    return data;
  }
};

export const encryptData = (data) => {
  try {
    var encryptionMethod = "AES-256-CBC";
    var secret = "roAdvl!i$nk#freightroAdvl!i$nk#f";
    var iv = "1234567891011121";
    var encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
    return encryptor.update(data, "utf8", "base64") + encryptor.final("base64");
  } catch (error) {
    console.error("encryptData:: error in data encryption - ", error);
  }
};

export const decryptData = (encryptedData) => {
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

export const getDateString = (dateObj, timeFlag = false) => {
  if (!timeFlag) {
    var dateStr =
      dateObj.getDate() +
      "-" +
      (dateObj.getMonth() + 1) +
      "-" +
      dateObj.getFullYear();
    console.log("dateObj : ", dateObj);
    return dateStr;
  } else {
    var dateStr =
      dateObj.getDate() +
      "-" +
      (dateObj.getMonth() + 1) +
      "-" +
      dateObj.getFullYear() +
      ", " +
      dateObj.getHours() +
      ":" +
      dateObj.getMinutes() +
      ":" +
      dateObj.getSeconds();
    console.log("dateObj : ", dateObj);
    return dateStr;
  }
};

export const getDateInput = (dateObj) => {
  var Year = dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  if (month < 10) month = "0" + String(month);
  var day = dateObj.getDate();
  if (day < 10) day = "0" + String(day);
  var dateStr = Year + "-" + month + "-" + day;
  console.log("dateObj : ", dateStr);
  return dateStr;
};

export const getDateInputNextn = (date, n) => {
  var dateObj = new Date(date.getTime() + day * n);
  var dateStr =
    dateObj.getFullYear() +
    "-" +
    (dateObj.getMonth() + 1) +
    "-" +
    dateObj.getDate();
  console.log("n", n);
  console.log("dateStr : ", dateStr);
  return dateStr;
};

export const getDateInputprevn = (date, n) => {
  var dateObj = new Date(date.getTime() - day * n);
  var dateStr =
    dateObj.getFullYear() +
    "-" +
    (dateObj.getMonth() + 1) +
    "-" +
    dateObj.getDate();
  console.log("n", n);
  console.log("dateStr : ", dateStr);
  return dateStr;
};
