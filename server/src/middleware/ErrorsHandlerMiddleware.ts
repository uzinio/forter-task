import {NextFunction, Request, Response} from "express";
import {RouteException} from "../types";

export const errorHandlingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const {message, statusCode} = extractStatusAndErrorMessage(err);
    res.status(statusCode).send({errors: [{message}]});
};

const extractStatusAndErrorMessage = (err: Error) => {
    try {
        return {message: (err as RouteException).message, statusCode: (err as RouteException).statusCode};
    } catch (_err) {
        return {message: 'internal error', statusCode: 500};
    }
}

