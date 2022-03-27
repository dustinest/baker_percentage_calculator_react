import {ChangeEvent} from "react";

export const onNumberInputChange = async (e: ChangeEvent<HTMLInputElement>): Promise<number | null> => {
    if (e.target.value !== undefined && e.target.value !== null && e.target.value !== "") {
        return Number.parseFloat(e.target.value);
    }
    return null;
};
