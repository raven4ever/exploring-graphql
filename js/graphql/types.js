const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } = graphql;

const Course = require('../models/Course');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Sport = require('../models/Sport');

const CourseType = new GraphQLObjectType({
    name: 'Course',
    description: 'Course GQL Type',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },

        teacher: {
            type: TeacherType,
            resolve(parent, args) {
                return Teacher.findById(parent.teacher);
            }
        },

        students: {
            type: new GraphQLList(StudentType),
            resolve(parent, args) {
                return Student.find({ courses: parent.id });
            }
        }
    })
});

const SportType = new GraphQLObjectType({
    name: 'Sport',
    description: 'Sport GQL Type',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },

        students: {
            type: new GraphQLList(StudentType),
            resolve(parent, args) {
                return Student.find({ sports: parent.id });
            }
        }
    })
});

const StudentType = new GraphQLObjectType({
    name: 'Student',
    description: 'Student GQL Type',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },

        sports: {
            type: new GraphQLList(SportType),
            resolve(parent, args) {
                return Sport.find({ students: parent.id });
            }
        },

        courses: {
            type: new GraphQLList(CourseType),
            resolve(parent, args) {
                return Course.find({ students: parent.id });
            }
        }
    })
});

const TeacherType = new GraphQLObjectType({
    name: 'Teacher',
    description: 'Teacher GQL Type',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },

        courses: {
            type: new GraphQLList(CourseType),
            resolve(parent, args) {
                return Course.find({ teacher: parent.id });
            }
        }
    })
});

// export the custom types
module.exports = {
    CourseType,
    StudentType,
    TeacherType,
    SportType
}