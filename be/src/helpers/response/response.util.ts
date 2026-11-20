import { HttpStatus } from "@nestjs/common"

export const successRsp = (msg: string, result: any) => {
    return {
        status: HttpStatus.OK,
        message: msg,
        data: result
    };
};

export const createRsp = (msg: string, result: any) => {
    return {
        status: HttpStatus.CREATED,
        message: msg,
        data: result,
    };
};

export const notFound = (msg: string, result: any) => {
    return {
        status: HttpStatus.NOT_FOUND,
        message: msg,
        data: result,
    };
};

export const badRequest = (msg: string, result: any) => {
    return {
        status: HttpStatus.BAD_REQUEST,
        message: msg,
        data: result,
    };
};

export const internalServerError = (msg: any, result: any) => {
    return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: msg,
        data: null
    };
};