const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('Job Seeker', 'Company').optional(),
  companyProfile: Joi.object({
      companyName: Joi.string().allow('').optional(),
      description: Joi.string().allow('').optional(),
      website: Joi.string().uri().allow('').optional(),
      location: Joi.string().allow('').optional(),
      industry: Joi.string().allow('').optional(),
      size: Joi.string().allow('').optional(),
      logo: Joi.string().allow('').optional()
  }).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const createJobSchema = Joi.object({
    title: Joi.string().required().max(100),
    description: Joi.string().required(),
    requirements: Joi.string().required(),
    type: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance').required(),
    category: Joi.string().required(),
    level: Joi.string().valid('Entry Level', 'Mid Level', 'Senior Level', 'Internship').required(),
    location: Joi.string().required(),
    salary: Joi.alternatives().try(
        Joi.string(),
        Joi.object({
            min: Joi.number().optional(),
            max: Joi.number().optional(),
            negotiable: Joi.boolean().optional()
        })
    ),
    companyName: Joi.string(),
    companyId: Joi.string()
});

const updateJobSchema = Joi.object({
    title: Joi.string().max(100),
    description: Joi.string(),
    requirements: Joi.string(),
    type: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'),
    category: Joi.string(),
    level: Joi.string().valid('Entry Level', 'Mid Level', 'Senior Level', 'Internship'),
    location: Joi.string(),
    status: Joi.string().valid('open', 'closed', 'archived'),
    salary: Joi.alternatives().try(
        Joi.string(),
        Joi.object({
            min: Joi.number().optional(),
            max: Joi.number().optional(),
            negotiable: Joi.boolean().optional()
        })
    )
}).min(1);

const companySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    location: Joi.string().required(),
    website: Joi.string().uri()
});

module.exports = {
    registerSchema,
    loginSchema,
    createJobSchema,
    updateJobSchema,
    companySchema
};
