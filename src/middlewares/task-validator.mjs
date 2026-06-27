import { body } from "express-validator";

export const validateNewTask = [
    body('title')
        .notEmpty()
        .withMessage("Title must be provided"), 
    body('description')
        .optional()
        .isIn(['w-maxxing', 'sahur', 'brainrot'])
        .withMessage("Category must be 'w-maxxing', 'sahur', or 'brainrot'")
]

export const validateUpdateTask = [
    body('title')
        .optional()
        .notEmpty()
        .withMessage("Title must be provided"), 
    body('description')
        .optional(), 
    body('category')
        .optional()
        .isIn(['w-maxxing', 'sahur', 'brainrot'])
        .withMessage("Category must be 'w-maxxing', 'sahur', or 'brainrot'"), 
    body('status')
        .optional()
        .isIn(['done', 'ongoing', 'not_done'])
        .withMessage("Status must be 'done', 'ongoing', or 'not_done'"), 
]
