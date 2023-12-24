const multer = require("multer");
const catchAsync = require("./catchAsync");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadSinglePhoto = upload.single("photo");

exports.resizePhoto = function (type) {
  return catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    console.log(req.file.filename);
    req.file.filename = `${type}-${(Math.random() * 1000).toFixed(
      2
    )}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/uploads/${type}/${req.file.filename}`);

    next();
  });
};
