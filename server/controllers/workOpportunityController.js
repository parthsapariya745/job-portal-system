const WorkOpportunity = require('../models/WorkOpportunity');

// @desc    Create new work opportunity
// @route   POST /api/v1/work-opportunities
// @access  Public/Private
exports.createWorkOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      salary,
      contactNumber,
      organizationName,
      email,
      website,
      targetAudience,
      requirements,
      workingHours,
      experience,
      workType,
      skillsNeeded
    } = req.body;

    // Create work opportunity
    const workOpportunity = await WorkOpportunity.create({
      title,
      description,
      location,
      salary,
      contactNumber,
      organizationName,
      email,
      website,
      targetAudience: targetAudience || 'non-educated',
      requirements,
      workingHours,
      experience,
      workType,
      skillsNeeded,
      postedBy: req.user ? req.user._id : null,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      data: workOpportunity
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all work opportunities
// @route   GET /api/v1/work-opportunities
// @access  Public
exports.getWorkOpportunities = async (req, res) => {
  try {
    const { targetAudience, status, location, search } = req.query;
    
    // Build query
    const query = {};
    
    if (targetAudience) {
      query.targetAudience = targetAudience;
    }
    
    if (status) {
      query.status = status;
    } else {
      // Default to active opportunities
      query.status = 'active';
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const workOpportunities = await WorkOpportunity.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workOpportunities.length,
      data: workOpportunities
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single work opportunity
// @route   GET /api/v1/work-opportunities/:id
// @access  Public
exports.getWorkOpportunity = async (req, res) => {
  try {
    const workOpportunity = await WorkOpportunity.findById(req.params.id);

    if (!workOpportunity) {
      return res.status(404).json({
        success: false,
        message: 'Work opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: workOpportunity
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update work opportunity
// @route   PATCH /api/v1/work-opportunities/:id
// @access  Private
exports.updateWorkOpportunity = async (req, res) => {
  try {
    let workOpportunity = await WorkOpportunity.findById(req.params.id);

    if (!workOpportunity) {
      return res.status(404).json({
        success: false,
        message: 'Work opportunity not found'
      });
    }

    // Update fields
    const fieldsToUpdate = [
      'title', 'description', 'location', 'salary', 'contactNumber',
      'organizationName', 'email', 'website', 'targetAudience', 'status',
      'requirements', 'workingHours', 'experience', 'workType', 'skillsNeeded'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        workOpportunity[field] = req.body[field];
      }
    });

    await workOpportunity.save();

    res.status(200).json({
      success: true,
      data: workOpportunity
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete work opportunity
// @route   DELETE /api/v1/work-opportunities/:id
// @access  Private
exports.deleteWorkOpportunity = async (req, res) => {
  try {
    const workOpportunity = await WorkOpportunity.findById(req.params.id);

    if (!workOpportunity) {
      return res.status(404).json({
        success: false,
        message: 'Work opportunity not found'
      });
    }

    await workOpportunity.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Work opportunity deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get non-educated work opportunities
// @route   GET /api/v1/work-opportunities/type/non-educated
// @access  Public
exports.getNonEducatedOpportunities = async (req, res) => {
  try {
    const { location, search } = req.query;
    
    const query = {
      $or: [
        { targetAudience: 'non-educated' },
        { targetAudience: 'both' }
      ],
      status: 'active'
    };
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$and = [
        query,
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    const opportunities = await WorkOpportunity.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Increment interest count
// @route   POST /api/v1/work-opportunities/:id/interested
// @access  Public
exports.incrementInterest = async (req, res) => {
  try {
    const workOpportunity = await WorkOpportunity.findById(req.params.id);

    if (!workOpportunity) {
      return res.status(404).json({
        success: false,
        message: 'Work opportunity not found'
      });
    }

    workOpportunity.interestCount += 1;
    await workOpportunity.save();

    res.status(200).json({
      success: true,
      data: workOpportunity
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
