import {NumberIntervalType} from "../../../models/types";

export type JsonBakingTimeType = {
    time: NumberIntervalType | number;
    temperature: NumberIntervalType | number;
    steam?: boolean;
};
