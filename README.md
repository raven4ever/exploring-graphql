# Exploring GraphQL

I created this project to explore the GraphQL technology using various programming languages.

## Functional Requirements

The application needs to be able to:

- allow GraphQL queries to be executed for all defined entities
- allow GraphQL mutations to be executed for all defined entities

The entities are:

- Student: id, name, age, enrolledCourses, practicedSports
- Teacher: id, name, age, taughtCourses
- Course: id, name, description
- Sport: id, name, description

## Implementation

The implementation will be done using the following programming languages:

- go
- java
- js
- python

## Running

To run the application, run the `docker-compose.yml` file. Thsi will start a local instance of MongoDB and all the applications written in the different programming languages.

To verify all the queries and mutations, import the Postman collection and run the tests.
