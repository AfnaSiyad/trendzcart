const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if(file){
        // const tmpPath = path.join('/tmp');
        cb(null, './public/productPhotos');  // For localhost
        // cb(null, tmpPath);  // For Render server
      }
      
    },
    filename: function (req, file, cb) {
      if(file){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }
  })
  
  const upload = multer({ storage: storage });

  module.exports = upload;