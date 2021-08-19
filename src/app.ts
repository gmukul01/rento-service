import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { dbConfig } from './config/db.config';
import { db } from './models';
import routes from './routes';

const app = express();

/** Middleware */
app.use(
    cors({
        origin: 'http://localhost:8081'
    })
);
app.use(bodyParser.json());
app.use(morgan('combined'));

/** Connect to mongodb */
const Role = db.role;
db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connect to MongoDB.');
        initial();
    })
    .catch(err => {
        console.error('Connection error', err);
        process.exit();
    });

/** Create admin and user role */
function initial() {
    Role.estimatedDocumentCount({}, (err, count) => {
        if (!err && count === 0) {
            new Role({
                name: 'user'
            }).save(err => (err ? console.log('error', err) : console.log("added 'user' to roles collection")));

            new Role({
                name: 'admin'
            }).save(err => (err ? console.log('error', err) : console.log("added 'admin' to roles collection")));
        }
    });
}

/** Routes */
app.use('/api/', routes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
