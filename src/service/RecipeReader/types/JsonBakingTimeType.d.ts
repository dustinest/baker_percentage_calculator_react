import {NumberIntervalType} from "../../../types";

export type JsonNumberIntervalType = NumberIntervalType | number;

export type JsonBakingTimeType = {
    time: JsonNumberIntervalType;
    temperature: JsonNumberIntervalType;
    steam?: boolean;
};
