import {NumberIntervalType} from "../../../types";

export type JsonNumberInterval = NumberIntervalType | number;

export interface JsonBakingTime {
    time: JsonNumberInterval;
    temperature: JsonNumberInterval;
    steam?: boolean;
}
