const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
require("dotenv").config();
// const db = require("./model/dbconnect");
const pathFile = require("path");
const fs = require("fs");
const multer = require("multer");
const { ERROR_MESSAGE } = require("./config/error");
const { log } = require("console");

const app = express();

var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

// db.sequelize.sync();
// db.sequelize.sync({ force: false }).then(() => {
//   console.log("Drop and re-sync db.");
// });

//simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application" });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: pathFile.join(
    __dirname,
    process.env.DIST_DIR || "",
    "./static/uploads/"
  ),
  filename: (req, file, cb) => {
    let uploadedFileName;
    fs.stat(
      pathFile.join(
        __dirname,
        process.env.DIST_DIR || "",
        `./static/uploads/${file.originalname.replace(/["'()\ ]/g, "")}`
      ),
      (err) => {
        if (err === null) {
          uploadedFileName = `${Date.now()}-${file.originalname.replace(
            /["'()\ ]/g,
            ""
          )}`;
        } else if (err.code === "ENOENT") {
          uploadedFileName = `${Date.now()}-${file.originalname.replace(
            /["'()\ ]/g,
            ""
          )}`;
        } else {
          // logger.info('Some other error: ', err);
          console.log("error");
        }

        cb(null, uploadedFileName);
      }
    );
  },
});

const uploadImage = multer({
  storage,
  limits: { fileSize: 52428799 },
  fileFilter: function (req, file, callback) {
    var ext = pathFile.extname(file.originalname).toLowerCase();

    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".svg" &&
      ext !== ".webp" &&
      ext !== ".jpeg"
    ) {
      return callback(new Error("ERR_6006"));
    }
    callback(null, true);
  },
});

app.post("/api/upload/uploadImage", async (req, res) => {
  try {
    uploadImage.any()(req, null, async (err) => {
      // const code = err.message;
      if (err) {
        return res.send({
          code: 400,
          signal: 0,
          // errorCode: code ? code : ERROR_MESSAGE.ERROR,
          errorCode: ERROR_MESSAGE.ERROR,
          message: "Upload failed!",
        });
      }

      if (!req.files) {
        return res.send({
          code: 400,
          signal: 0,
          errorCode: ERROR_MESSAGE.REQUIRED_PARAMS,
          message: "Upload failed!",
        });
      }

      const filePaths = {};
      req.files.forEach((file) => {
        filePaths[file.fieldname] = `${
          process.env.API_SERVER
        }/uploads/${file.filename.replace(/["'()\ ]/g, "")}`;
      });

      return res.status(200).send({
        code: 200,
        signal: 1,
        message: "Upload success!",
        data: { filePaths },
      });
    });
  } catch (error) {
    return res.send({
      code: 400,
      signal: 0,
      message: "Error Upload!",
    });
  }
});

app.use(routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
