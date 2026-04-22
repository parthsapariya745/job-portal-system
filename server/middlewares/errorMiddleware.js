const logger = require('../utils/logger');

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // Handle Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
      err.message = "File is too large! Max limit for images is 25MB.";
      err.statusCode = 400;
    }

    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    logger.error(
        `${req.method} ${req.originalUrl} | ${statusCode} | ${err.message}`,
        {
            stack: err.stack,
            body: req.body,
            user: req.user ? req.user._id : null
        }
    );

    res.status(statusCode).json({
        status: err.status || 'error',
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };