import multer from "multer";
import fs from "fs";

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {

      ensureDirExists("./public/temp");
      cb(null, "./public/temp");
    } catch (error) {
      console.error("Error setting destination:", error);
      fs.appendFileSync("error.log", `Error setting destination: ${error}\n`);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    } catch (error) {
      console.error("Error setting filename:", error);
      fs.appendFileSync("error.log", `Error setting filename: ${error}\n`);
      cb(error);
    }
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export { upload };
