import { body } from "express-validator";

export const validateNewTask = [
    body('title')
        .notEmpty()
        .withMessage("Title must be provided"), 
    body('description')
        .optional(), 
    body('category')
        .optional()
        .isIn(['w-maxxing', 'sahur', 'brainrot'])
        .withMessage("Category must be 'w-maxxing', 'sahur', or 'brainrot'")
]
