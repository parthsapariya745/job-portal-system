const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values to not trigger unique constraint
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    companyProfile: {
      companyName: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      industry: {
        type: String,
        trim: true,
      },
      size: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
      },
      foundedYear: {
        type: String,
        trim: true,
      },
      socialLinks: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String,
      },
      benefits: [String],
      logo: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/4091/4091968.png",
      },
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: [
        "Job Seeker",
        "Company",
        "Company HR",
        "Moderator",
        "Admin",
        "Super Admin",
        "Support Executive",
        "Content Reviewer",
        "Analytics Manager",
      ],
      default: "Job Seeker",
      required: true,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, "Please add a valid 10-digit phone number"],
    },
    aadharCard: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[0-9]{12}$/, "Please add a valid 12-digit Aadhar number"],
    },
    userType: {
      type: String,
      enum: ["Educated", "Non-Educated"],
      required: function () {
        return this.role === "Job Seeker";
      },
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80",
    },
    profile: {
      bio: String,
      location: String,
      website: String,

      // Professional Classification
      industry: {
        type: String,
        // Simple enum or free text? Enum is better for filtering.
        // But list is huge. Let's allowing free text or a broad enum + Other.
        // keeping it String for flexibility but frontend will have dropdown.
        trim: true,
      },
      jobRole: {
        // "Best Title" / Designation
        type: String,
        trim: true,
      },

      skills: [String],
      resume: String, // URL
      profileViews: {
        type: Number,
        default: 0
      },
      connections: {
        type: Number,
        default: 0
      },
      noticePeriod: {
        type: String,
        enum: [
          "Immediate",
          "15 Days",
          "1 Month",
          "2 Months",
          "3 Months",
          "More than 3 Months",
        ],
      },
      currentSalary: {
        type: String,
        trim: true,
      },
      expectedSalary: {
        type: String,
        trim: true,
      },
      salaryType: {
        type: String,
        enum: ['Per Year', 'Per Month'],
        default: 'Per Year'
      },
      experienceYears: {
        type: Number,
        default: 0,
      },
      education: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          startDate: Date,
          endDate: Date,
          details: String,
        },
      ],
      experience: [
        {
          jobTitle: String,
          company: String,
          startDate: Date,
          endDate: Date,
          description: String,
          current: Boolean,
        },
      ],
      savedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
    },
    jobAlerts: [
      {
        keywords: String,
        location: String,
        frequency: {
          type: String,
          enum: ["Daily", "Weekly", "Instant"],
          default: "Daily",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      emailAlerts: { type: Boolean, default: true },
      jobRecommendations: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  },
);

// Middleware: Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Middleware: Soft delete query filter
userSchema.pre(/^find/, function () {
  this.find({ isActive: { $ne: false } });
});

// Method: Check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method: Changed password after token?
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// Method: Generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
