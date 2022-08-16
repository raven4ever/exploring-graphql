const mongoose = require('mongoose');

const MSchema = mongoose.Schema;

const teacherSchema = new MSchema({
    name: String,
    age: Number
});

module.exports = mongoose.model("Teacher", teacherSchema);