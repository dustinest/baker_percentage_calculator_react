import {Buffer} from "buffer";

export const base64Encode = (idContainer: {id?: string} | undefined, name: string): string => {
    if (idContainer && idContainer.id) return idContainer.id;
    const buf = Buffer.from(name, 'utf8');
    return buf.toString('base64');
}
