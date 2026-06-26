import { Router } from "express";
import * as usersMid from "../middlewares/user-validator.mjs";
import * as helpersMid from '../middlewares/helpers-mid.mjs';
import * as usersCtl from '../controllers/users-ctl.mjs';
import * as authMid from '../middlewares/auth-mid.mjs';

const router = Router();
router.use(authMid.isUserAuthenticated);
router.use(authMid.isUserAdmin);

router.post('/', usersMid.validateNewUser, helpersMid.catchValidationError, usersCtl.createUser);
router.get('/', helpersMid.paginationHelper, helpersMid.catchValidationError, usersCtl.getUsers);
router.patch('/:user_id', 
    helpersMid.isParamInt('user_id'), 
    helpersMid.catchValidationError, 
    usersMid.validateUserUpdate, 
    helpersMid.catchValidationError, 
    usersCtl.updateUser
);
router.delete('/:user_id',
    helpersMid.isParamInt('user_id'), 
    helpersMid.catchValidationError, 
    usersCtl.deleteUser
);

export default router
