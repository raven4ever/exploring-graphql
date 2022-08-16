const mongoose = require('mongoose');

const MSchema = mongoose.Schema;

const sportSchema = new MSchema({
    name: String,
    description: String,
    students: [{
        type: MSchema.Types.ObjectId,
        ref: "Student"
    }]
});

module.exports = mongoose.model("Sport", sportSchema);