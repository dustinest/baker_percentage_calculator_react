import {ChangeEvent} from "react";

export const onNumberInputChange = (e: ChangeEvent<HTMLInputElement>): Promise<number> => {
    try {
        const value = Number.parseFloat(e.target.value);
        return Promise.resolve(value);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const onNumberInputChangeCall = (e: ChangeEvent<HTMLInputElement>, callback: (value: number) => void) => {
    onNumberInputChange(e).then(callback).catch(console.error);
}
