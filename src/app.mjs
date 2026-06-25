import express from 'express';
import { configDotenv } from 'dotenv';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
configDotenv();
import usersRoute from './routes/usersRoute.mjs';
import authRoute from './routes/authRoute.mjs';
import { pool } from './services/db.mjs';
import passport from 'passport';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
const pgSession = connectPgSimple(session);
app.use(session({
    saveUninitialized: false, 
    resave: false, 
    secret: process.env.SESSION_SECRET, 
    cookie: {
        maxAge: ( 1000 * 60 ) * 10 
    }, 
    store: new pgSession({
        pool: pool, 
        tableName: 'session',
        pruneSessionInterval: (1000 * 60) * 10,
        disableTouch: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.listen(PORT, () => {
    console.log(`listening to ${PORT}`);
});
