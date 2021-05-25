import { NextFunction, Request, Response } from "express";
import { DefaultPayloadModel } from "../types/default-payload";
import { GeneralError } from "../utils/errors";

export const handleErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
    //console.log("error", err);
    let errorObj: DefaultPayloadModel<string> = {
        isSuccess: false,
        msg: err.message,
        data: ""
    }
    if (err instanceof GeneralError) {
        return res
            .status(err.getCode())
            .json(errorObj);
    }

    return res
        .status(500)
        .json(errorObj);
}


