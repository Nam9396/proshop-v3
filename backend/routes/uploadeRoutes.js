import path from 'path';
import express from 'express';
import multer from 'multer';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination (req, file, cb) { 
    cb(null, 'uploads/image/')
  }, 
  filename (req, file, cb) { 
    // cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname).replace(/\\/g, "/")}`)
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, filename);
  },
});

const checkFileType = (file, cb) =>  { 
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
  const minetype = filetypes.test(file.minetype);
  if (extname && minetype) { 
    return cb(null, true)
  } else { 
    cb('Images only');
  }
};

const upload = multer({
  storage,
});

uploadRouter.post('/', upload.single('image'), (req, res, next) => {
  res.send({
    message: 'Image Uploaded', 
    image: `/${req.file.path}`.replace(/\\/g, "/") // o day da hien thi toan bo absolute path den anh cu the
  })
});







export default uploadRouter;