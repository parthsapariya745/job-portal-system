const mongoose = require('mongoose');
const slugify = require('slugify');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [5000, 'Description cannot be more than 5000 characters']
    },
    requirements: {
        type: String,
        required: [true, 'Please add requirements']
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Internship'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'INR'
        },
        salaryType: {
            type: String,
            enum: ['Per Year', 'Per Month'],
            default: 'Per Year'
        },
        negotiable: {
            type: Boolean,
            default: false
        }
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    user: { // Recruiter
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'archived'],
        default: 'open'
    },
    applicantsCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware: Slugify
jobSchema.pre('save', function() {
    this.slug = slugify(this.title, { lower: true });
});

// Middleware: Soft delete
jobSchema.pre(/^find/, function () {
    this.find({ isDeleted: { $ne: true } });
});

// Indexing for search (company is a ref, so only index title + description)
jobSchema.index({ title: 'text', description: 'text', requirements: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ salary: 1 });

module.exports = mongoose.model('Job', jobSchema);
