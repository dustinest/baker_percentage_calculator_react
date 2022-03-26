import {Buffer} from "buffer";

export const base64Encode = (idContainer: {id?: string} | undefined, ...names: string[]): string => {
    if (idContainer && idContainer.id) return idContainer.id;
    return Buffer.from(names.join("::"), 'utf8').toString('base64');
}
