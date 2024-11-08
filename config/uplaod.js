const multer=require('multer');
const crypto= require('crypto');
const path=require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {

      const name = Date.now()+path.extname(file.originalname);
      cb(null, name)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports=upload;

  
