import express from 'express';
import { configDotenv } from 'dotenv';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
configDotenv();

// routes
import usersRoute from './routes/usersRoute.mjs';
import tasksRoute from './routes/tasksRoutes.mjs';
import authRoute from './routes/authRoute.mjs';
import registerRoute from './routes/registerRoute.mjs';

import { pool } from './services/db.mjs';
import passport from 'passport';
import cors from 'cors';

const PORT = process.env.PORT;
const app = express();
app.use(cors({ 
    origin: [ process.env.ORIGIN_URL, 'http://localhost:5173'], 
    credentials: true 
}));
app.use(express.json());
const pgSession = connectPgSimple(session);
app.use(session({
    saveUninitialized: false, 
    resave: false, 
    secret: process.env.SESSION_SECRET, 
    cookie: {
        maxAge: ( 1000 * 60 ) * 60
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

// routes
app.use('/api/register', registerRoute);
app.use('/api/auth', authRoute);
app.use('/api/tasks', tasksRoute);
app.use('/api/users', usersRoute);

app.listen(PORT, () => {
    console.log(`listening to ${PORT}`);
});
