import passport from "passport";
import { Strategy } from "passport-local";
import { query } from "../services/db.mjs";
import * as securityServ from '../services/security-serv.mjs';

export default passport.use(new Strategy(async (username, password, cb) => {
    const u = await query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    const user = u.rows[0];
    if(!user || user.archived_at) return cb(null, false, { message: "User does not exist" });

    if(!securityServ.compareHashedPassword(password, user.hashed_password)) 
        return cb(null, false, { message: 'Incorrect credentials' });
    return cb(null, filterUserInfo(user));
}));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

function filterUserInfo(user){
    return {
        username: user.username, 
        user_id: user.user_id, 
        created_at: user.created_at, 
        role_id: user.role_id
    }
}

passport.deserializeUser(async (user_id, done) => {
    try{
        const u = await query(
            "SELECT * FROM users WHERE user_id = $1",
            [user_id]
        );
        const user = u.rows[0];
        if(!user || user.archived_at) return done(null, false, { message: "User does not exist" });
        return done(null, filterUserInfo(user));
    } catch(e){
        console.log(e);
    }
});
