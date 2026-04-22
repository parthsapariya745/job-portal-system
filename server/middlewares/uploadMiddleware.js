const multer = require("multer");
const path = require("path");

// Configure Storage - Use memory storage for Cloudinary stream upload
const storage = multer.memoryStorage();

// Filters
const resumeFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  // Multer doesn't always provide correct mimetype for Word docs, so primarily check extname.
  // We'll pass it if extension matches.
  if (extname || file.mimetype.includes("pdf") || file.mimetype.includes("word") || file.mimetype.includes("document")) cb(null, true);
  else cb(new Error("Only PDF, DOC, and DOCX files are allowed!"), false);
};

const avatarFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = allowedExtensions.test(ext);
  const isValidMime = file.mimetype.startsWith("image/");

  if (isValidExt || isValidMime) cb(null, true);
  else
    cb(
      new Error("Only JPEG, JPG, PNG, WEBP and GIF images are allowed!"),
      false
    );
};

// Exports
const uploadResumeMiddleware = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: resumeFilter,
});

const uploadAvatarMiddleware = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Increase to 25MB as users may upload high-res images/covers
  fileFilter: avatarFilter,
});

module.exports = {
  uploadResume: uploadResumeMiddleware,
  uploadAvatar: uploadAvatarMiddleware,
};
