const logger = require('../utils/logger');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map((detail) => detail.message).join(', ');
            logger.warn(`Validation Error: ${message}`, { details: error.details, body: req.body });
            return res.status(400).json({
                status: 'error',
                message: message
            });
        }
        next();
    };
};

module.exports = validateRequest;