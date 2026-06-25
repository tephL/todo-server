import { body } from "express-validator";

export const validateNewUser = [
    body('username')
        .notEmpty()
        .withMessage('Username must be provided')
        .isLength({ min: 5 })
        .withMessage('Username must be atleast 5 characters'), 
    body('password')
        .notEmpty()
        .withMessage('Password must be provided')
        .isLength({ min: 8 })
        .withMessage('Password must be atleast 8 characters'), 
]

export const validateUserUpdate = [
    body('username')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Username must be atleast 5 characters'), 
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be atleast 8 characters'), 
]
