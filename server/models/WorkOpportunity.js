const mongoose = require('mongoose');

const workOpportunitySchema = new mongoose.Schema({
  // Work Details - Fully dynamic, no predefined categories
  title: {
    type: String,
    required: [true, 'Work title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Work description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Location
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  
  // Salary (optional)
  salary: {
    type: String,
    trim: true,
    default: null
  },
  
  // Contact Information
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  
  // Employer/Organization Details
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },
  website: {
    type: String,
    trim: true,
    default: null
  },
  
  // Target Audience
  targetAudience: {
    type: String,
    enum: ['educated', 'non-educated', 'both'],
    default: 'non-educated'
  },
  
  // Work Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'filled', 'expired'],
    default: 'active'
  },
  
  // Posted By (optional - for registered employers)
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Application/Interest Count
  interestCount: {
    type: Number,
    default: 0
  },
  
  // Additional Details (all optional - employers can write anything)
  requirements: {
    type: String,
    trim: true,
    default: null
  },
  
  workingHours: {
    type: String,
    trim: true,
    default: null
  },
  
  experience: {
    type: String,
    trim: true,
    default: null
  },
  
  // GPS Coordinates
  lat: {
    type: Number,
    default: null
  },
  lng: {
    type: Number,
    default: null
  },
  
  // Job-specific fields that can be freely defined
  workType: {
    type: String,
    trim: true,
    default: null
  },
  
  // For simple identification - not a category, just free text
  skillsNeeded: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
workOpportunitySchema.index({ targetAudience: 1, status: 1, createdAt: -1 });
workOpportunitySchema.index({ location: 1 });
workOpportunitySchema.index({ organizationName: 1 });
workOpportunitySchema.index({ title: 'text', description: 'text' });

// Virtual for days since posted
workOpportunitySchema.virtual('daysSincePosted').get(function() {
  const now = new Date();
  const posted = this.createdAt;
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for formatted posting date
workOpportunitySchema.virtual('postedDate').get(function() {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return this.createdAt.toLocaleDateString('en-IN', options);
});

const WorkOpportunity = mongoose.model('WorkOpportunity', workOpportunitySchema);

module.exports = WorkOpportunity;
