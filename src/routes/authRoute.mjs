import { Router } from "express";
import passport from "passport";
import '../strategies/passport-local.mjs';
import * as userMid from '../middlewares/user-validator.mjs';
import * as helpersMid from '../middlewares/helpers-mid.mjs';
import * as authMid from '../middlewares/auth-mid.mjs';

const router = Router();

router.post('/login', 
    userMid.validateNewUser, 
    helpersMid.catchValidationError, 
    (req, res, next) => 
        passport.authenticate('local', (err, user, info) => {
            if(err) return res.sendStatus(500);
            if(!user) return res.status(400).json(info || { message: "Unauthorized" });
            req.logIn(user, (err) => {
                if(err) return res.status(500).json({ message: "Login failed" });
                req.session.save(() => res.status(200).json(user));
            });
        })(req, res, next)
);

router.get('/me',
    authMid.isUserAuthenticated,
    (req, res) => {
        return res.status(200).json(req.user);
    }
);

router.delete('/logout',
    authMid.isUserAuthenticated, 
    (req, res) => {
        req.logout((err) => {
            if(err) return res.sendStatus(500);
            return res.sendStatus(204);
        });
    }
);

export default router;
