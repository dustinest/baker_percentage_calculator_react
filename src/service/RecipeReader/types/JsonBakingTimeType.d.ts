import {NumberIntervalType} from "../../../models";

export type JsonNumberIntervalType = NumberIntervalType | number;

export type JsonBakingTimeType = {
    time: JsonNumberIntervalType;
    temperature: JsonNumberIntervalType;
    steam?: boolean;
};
