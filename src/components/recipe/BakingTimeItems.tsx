import {BakingTime} from "../../models/interfaces/BakingTime";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {NumberIntervalLabel} from "../common/NumberIntervalLabel";
import {Typography} from "@mui/material";

export type BakingTimeItemsProps = {
    bakingTimes: BakingTime[];
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
