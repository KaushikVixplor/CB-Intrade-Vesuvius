var multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function(req, file, callback) {
    // console.error('file.originalname.split(".") = ',file.originalname.split("."))
    temp = file.originalname.split(".")
    type = temp[temp.length - 1]
    console.error("type = ",type)
    if('pdf' == type){
      var tempName = file.originalname
      callback(null, tempName);
    }
    else{
      callback(null, file.fieldname + "-" + Date.now()+".xlsx");
    }
  }
});

module.exports.upload = multer({
  storage: storage
});
module.exports.getPublicUrl = (originalName) => {
  const originalPath = "./uploads/"+originalName
  // console.log(">>>>>>>>>>>>>>>>>>>> originalPath = ",originalPath)
  return originalPath;
}
