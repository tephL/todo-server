import { Router } from "express";
import passport from "passport";
import '../strategies/passport-local.mjs';

const router = Router();

router.post('/login', 
    (req, res, next) => 
        passport.authenticate('local', (err, user, info) => {
            if(!err) return res.status(400).send(info);
            return res.status(200).json(user);
        })(req, res, next)
);

export default router;
