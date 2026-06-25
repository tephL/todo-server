import passport from "passport";
import LocalStrategy from 'passport-local'
import { prisma } from "../services/db.mjs";
import * as securityServ from '../services/security-serv.mjs';

export default passport.use(new LocalStrategy(async (username, password, cb) => {
    const u = await prisma.users.findUnique({ where: { username: username } });
    if(u === null) return cb(null, false, { message: "User does not exist" });
    if(securityServ.compareHashedPassword(password, u.hashed_password)) 
        return cb(null, false, { message: 'Incorrect credentials' });

    return cb(null, u);
}));

passport.serializeUser((user, done) => {
    done(user.user_id);
});

passport.deserializeUser((user_id, done) => {
    console.log(user_id);
});

