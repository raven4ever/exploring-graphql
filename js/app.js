const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graphql/schema');

// get environment variables
const APP_PORT = process.env.APP_PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://adrian:password@localhost:27017/demo-database';

const app = express();

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo is now connected, starting the app server...');
        app.listen(APP_PORT, () => {
            console.log(`Listening for requests on port ${APP_PORT}...`);
        });
    }).catch((e) => {
        console.log('Error: ' + e);
    });
