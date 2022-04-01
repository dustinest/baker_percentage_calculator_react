import {BakingTime} from "../../models/interfaces/BakingTime";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {Typography} from "@mui/material";
import {NumberInterval} from "../../models/interfaces/NumberInterval";
import {useTranslation} from "react-i18next";

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
    const translate = useTranslation();
    return (
        <>{
            bakingTimes.map((bakingTime, index) => (
                <Typography variant="body1" key={index}>
                    <TranslatedLabel label={bakingTime.isSteam() ? translate.t("Steam") : translate.t("Bake")}/>
                    {" "}
                    <NumberIntervalLabel interval={bakingTime.getInterval()}/> {translate.t("minutes")} <NumberIntervalLabel interval={bakingTime.getTemperature()}/>℃
                </Typography>
            ))}</>
    )
}
