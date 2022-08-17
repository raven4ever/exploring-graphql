const graphql = require('graphql');

const Course = require('../models/Course');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Sport = require('../models/Sport');

const { CourseType, TeacherType, SportType, StudentType } = require('./types');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;

// Root query
const RootQuery = new GraphQLObjectType({
    name: 'SchoolQuery',
    description: 'School Query',
    fields: {
        // CourseType
        course: {
            type: CourseType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },

            resolve(parent, args) {
                return Course.findById(args.id);
            }
        },
        courses: {
            type: new GraphQLList(CourseType),
            resolve(parent, args) {
                return Course.find({});
            }
        },
        // SportType
        sport: {
            type: SportType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },

            resolve(parent, args) {
                return Sport.findById(args.id);
            }
        },
        sports: {
            type: new GraphQLList(SportType),
            resolve(parent, args) {
                return Sport.find({});
            }
        },
        // StudentType
        student: {
            type: StudentType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },

            resolve(parent, args) {
                return Student.findById(args.id);
            }
        },
        students: {
            type: new GraphQLList(StudentType),
            resolve(parent, args) {
                return Student.find({});
            }
        },
        // TeacherType
        teacher: {
            type: TeacherType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },

            resolve(parent, args) {
                return Teacher.findById(args.id);
            }
        },
        teachers: {
            type: new GraphQLList(TeacherType),
            resolve(parent, args) {
                return Teacher.find({});
            }
        },
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'SchoolMutations',
    fields: {
        // CourseType
        CreateCourse: {
            type: CourseType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                teacher: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let course = new Course({
                    name: args.name,
                    description: args.description,
                    teacher: args.teacher,
                });
                return course.save();
            }
        },
        UpdateCourse: {
            type: CourseType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                teacher: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Course.findByIdAndUpdate(args.id,
                    {
                        name: args.name,
                        description: args.description,
                        teacher: args.teacher,
                    },
                    {
                        new: true
                    }
                );
            }
        },
        DeleteCourse: {
            type: CourseType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Course.findByIdAndRemove(args.id);
            }
        },
        // SportType
        CreateSport: {
            type: SportType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let sport = new Sport({
                    name: args.name,
                    description: args.description
                });
                return sport.save();
            }
        },
        UpdateSport: {
            type: SportType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return Sport.findByIdAndUpdate(args.id,
                    {
                        name: args.name,
                        description: args.description,
                    },
                    {
                        new: true
                    }
                );
            }
        },
        DeleteSport: {
            type: SportType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Sport.findByIdAndRemove(args.id);
            }
        },
        // StudentType
        CreateStudent: {
            type: StudentType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                sports: { type: new GraphQLList(GraphQLID) },
                courses: { type: new GraphQLList(GraphQLID) },
            },
            resolve(parent, args) {
                let student = new Student({
                    name: args.name,
                    age: args.age,
                    sports: args.sports,
                    courses: args.courses,
                });

                let studentSavePromise = student.save();
                let sportUpdatePromise = args.sports.forEach(sport => {
                    Sport.findById(sport, (err, sport) => {
                        if (err) {
                            console.log(err);
                        }
                        sport.students.push(student);
                        sport.save();
                    });
                });
                let courseUpdatePromise = args.courses.forEach(course => {
                    Course.findById(course, (err, course) => {
                        if (err) {
                            console.log(err);
                        }
                        course.students.push(student);
                        course.save();
                    });
                });

                return Promise.all([studentSavePromise, sportUpdatePromise, courseUpdatePromise]).then(data => {
                    return data[0];
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        UpdateStudent: {
            type: StudentType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                sports: { type: new GraphQLList(GraphQLID) },
                courses: { type: new GraphQLList(GraphQLID) },
            },
            resolve(parent, args) {
                let sportsPromise = Student.findById(args.id)
                    .then(student => { // find the user
                        return student.sports;
                    }).then(currentSports => { // return old sports which are not in new sports
                        return currentSports.filter(sport => {
                            return !args.sports.includes(sport);
                        });
                    }).then(sportsToRemove => { // remove sports from student
                        return sportsToRemove.forEach(sport => {
                            Sport.findById(sport, (err, sport) => {
                                if (err) {
                                    console.log(err);
                                }
                                sport.students.pull(args.id);
                                sport.save();
                            });
                        });
                    }).then(() => { // add sports to student
                        return args.sports.forEach(sport => {
                            Sport.findById(sport, (err, sport) => {
                                if (err) {
                                    console.log(err);
                                }
                                sport.students.push(args.id);
                                sport.save();
                            }).clone().catch(err => {
                                console.log(err);
                            });
                        });
                    }).catch(err => {
                        console.log(err);
                    });

                let coursesPromise = Student.findById(args.id)
                    .then(student => { // find the user
                        return student.courses;
                    }).then(currentCourses => { // return old courses which are not in new courses
                        return currentCourses.filter(course => {
                            return !args.courses.includes(course);
                        });
                    }).then(coursesToRemove => { // remove courses from student
                        return coursesToRemove.forEach(course => {
                            Course.findById(course, (err, course) => {
                                if (err) {
                                    console.log(err);
                                }
                                course.students.pull(args.id);
                                course.save();
                            });
                        });
                    }).then(() => { // add courses to student
                        return args.courses.forEach(course => {
                            Course.findById(course, (err, course) => {
                                if (err) {
                                    console.log(err);
                                }
                                course.students.push(args.id);
                                course.save();
                            }).clone().catch(err => {
                                console.log(err);
                            });
                        });
                    }).catch(err => {
                        console.log(err);
                    });

                // Update Student
                let updateStudentPromise = Student.findByIdAndUpdate(args.id,
                    {
                        name: args.name,
                        age: args.age,
                        sports: args.sports,
                        courses: args.courses,
                    },
                    {
                        new: true
                    }
                );

                return Promise.all([updateStudentPromise, sportsPromise, coursesPromise]).then(data => {
                    return data[0];
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        DeleteStudent: {
            type: StudentType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Student.findByIdAndRemove(args.id);
            }
        },
        // TeacherType
        CreateTeacher: {
            type: TeacherType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                let teacher = new Teacher({
                    name: args.name,
                    age: args.age
                });
                return teacher.save();
            }
        },
        UpdateTeacher: {
            type: TeacherType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                return Teacher.findByIdAndUpdate(args.id,
                    {
                        name: args.name,
                        age: args.age,
                    },
                    {
                        new: true
                    }
                );
            }
        },
        DeleteTeacher: {
            type: TeacherType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Teacher.findByIdAndRemove(args.id);
            }
        },
    } //fields
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});