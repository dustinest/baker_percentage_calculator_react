import {Buffer} from "buffer";

export const base64Encode = (...values: (string | number)[]) => {
    if (values.length == 1) {
        return Buffer.from(values[0].toString(), 'utf8').toString('base64');
    }
    return Buffer.from(JSON.stringify(values), 'utf8').toString('base64');
}

