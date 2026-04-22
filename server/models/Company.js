const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a company name'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with http or https'
        ]
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    logo: {
        type: String,
        default: 'no-photo.jpg'
    },
    industry: {
        type: String,
        required: true
    },
    size: {
        type: String, // e.g., '1-10', '11-50', '51-200'
        enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The user who created the company (Recruiter/Employer)
        required: true
    },
    recruiters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create company slug from the name
companySchema.pre('save', async function() {
    this.slug = this.name.split(' ').join('-').toLowerCase();
});

// Cascade delete jobs when a company is deleted
companySchema.pre('remove', async function(next) {
    await this.model('Job').deleteMany({ company: this._id });
    next();
});

// Reverse populate with virtuals
companySchema.virtual('jobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'company',
    justOne: false
});

module.exports = mongoose.model('Company', companySchema);
