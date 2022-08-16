const mongoose = require('mongoose');

const MSchema = mongoose.Schema;

const courseSchema = new MSchema({
    name: String,
    description: String,
    teacher: {
        type: MSchema.Types.ObjectId,
        ref: "Teacher"
    },
    students: [{
        type: MSchema.Types.ObjectId,
        ref: "Student"
    }]
});

module.exports = mongoose.model("Course", courseSchema);