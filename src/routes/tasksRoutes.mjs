import { Router } from 'express';
import * as taskCtl from '../controllers/tasks-ctl.mjs';
import * as taskMid from '../middlewares/task-validator.mjs';
import * as helperMid from '../middlewares/helpers-mid.mjs';
import * as authMid from '../middlewares/auth-mid.mjs';

const router = Router();
router.use(authMid.isUserAuthenticated);

router.post('/',
    taskMid.validateNewTask,
    helperMid.catchValidationError,
    taskCtl.createTask
);

router.get('/',
    helperMid.paginationHelper, 
    helperMid.catchValidationError,
    taskCtl.getTasks
);

export default router;
