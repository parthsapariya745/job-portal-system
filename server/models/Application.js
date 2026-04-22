const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'applied', 'viewed', 'shortlisted', 'interview', 'accepted', 'rejected', 'hired', 'withdrawn'],
        default: 'pending'
    },
    resume: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Limit one application per job per user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
