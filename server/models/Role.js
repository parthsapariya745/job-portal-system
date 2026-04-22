const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a role name'],
        unique: true,
        trim: true
    },
    permissions: [{
        type: String, // e.g., 'create_job', 'delete_user'
        trim: true
    }],
    description: {
        type: String,
        trim: true
    },
    isSystemRole: {
        type: Boolean,
        default: false // Cannot be deleted if true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
