import { param, query, validationResult } from "express-validator";

export function catchValidationError(req, res, next){
    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).json(result.array());
    next();
}

export const paginationHelper = [
    query('page')
        .notEmpty()
        .withMessage('Page must be provided'), 
    query('limit')
        .notEmpty()
        .withMessage('Limit must be provided')
]

export const isParamInt = (parameter) =>
    param(parameter)
        .notEmpty().withMessage(`${parameter} must be provided`)
        .isInt().withMessage(`${parameter} must be an integer`)
