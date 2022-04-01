import {BakingTime} from "../../models/interfaces/BakingTime";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {Typography} from "@mui/material";
import {NumberInterval} from "../../models/interfaces/NumberInterval";

export type BakingTimeItemsProps = {
    bakingTimes: BakingTime[];
}

const NumberIntervalLabel = ({interval}: {interval: NumberInterval}) => {
    return (
        <>
            { interval.getFrom() === interval.getUntil()
                ? (<>{interval.getFrom()}</>)
                : (<>{interval.getFrom()} - {interval.getUntil()}</>)
            }
        </>
    )
}

export const BakingTimeItems = ({bakingTimes}: BakingTimeItemsProps) => {
    return (
        <>{
            bakingTimes.map((bakingTime, index) => (
                <Typography variant="body1" key={index}>
                    <TranslatedLabel label={bakingTime.isSteam() ? "Auruta" : "Küpseta"}/>
                    {" "}
                    <NumberIntervalLabel interval={bakingTime.getInterval()}/> minutit <NumberIntervalLabel interval={bakingTime.getTemperature()}/>℃
                </Typography>
            ))}</>
    )
}
