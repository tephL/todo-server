import passport from "passport";
import { Strategy } from "passport-local";
import { prisma } from "../services/db.mjs";
import * as securityServ from '../services/security-serv.mjs';

export default passport.use(new Strategy(async (username, password, cb) => {
    const u = await prisma.users.findUnique({ where: { username: username } });
    if(!u || u.archived_at) return cb(null, false, { message: "User does not exist" });
    if(!securityServ.compareHashedPassword(password, u.hashed_password)) 
        return cb(null, false, { message: 'Incorrect credentials' });
    return cb(null, filterUserInfo(u));
}));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

function filterUserInfo(user){
    return {
        username: user.username, 
        user_id: user.user_id, 
        created_at: user.created_at
    }
}

passport.deserializeUser(async (user_id, done) => {
    try{
        const u = await prisma.users.findUnique({ where: { user_id: user_id } });
        if(!u || u.archived_at){
            return done(null, false, { message: "User does not exist" });
        }
        return done(null, filterUserInfo(u));
    } catch(e){
        console.log(e);
    }
});
