import Router from 'express';
import { matchedData } from 'express-validator';

import * as userServ from '../services/users-serv.mjs';
import * as userMid from '../middlewares/user-validator.mjs';
import * as helperMid from '../middlewares/helpers-mid.mjs';

const router = Router();

router.post('/',
    userMid.validateNewUser,
    helperMid.catchValidationError,
    async (req, res) => {
        try{
            const { username, password } = matchedData(req);
            const user = await userServ.createUser({ username: username, password: password });
            return res.sendStatus(201);
        } catch(e){
            if(e.code == 23505) return res.status(400).send({ message: "Username already exists" });
            return res.sendStatus(500);
        }
    }
);

export default router;
