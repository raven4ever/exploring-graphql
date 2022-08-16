const mongoose = require('mongoose');

const MSchema = mongoose.Schema;

const studentSchema = new MSchema({
    name: String,
    age: Number,
    sports: [{
        type: MSchema.Types.ObjectId,
        ref: "Sport"
    }],
    courses: [{
        type: MSchema.Types.ObjectId,
        ref: "Course"
    }]
});

module.exports = mongoose.model("Student", studentSchema);