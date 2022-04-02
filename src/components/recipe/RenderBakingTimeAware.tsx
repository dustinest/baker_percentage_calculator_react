import {NumberInterval} from "../../models";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {BakingTimeAware} from "../../models/interfaces/BakingTimeAware";

export type RenderBakingTimeAwareProps = {
    value: BakingTimeAware;
}

const NumberIntervalLabel = ({interval, suffix}: {interval: NumberInterval, suffix?: string}) => {
    return (
        <>
            { interval.getFrom() === interval.getUntil()
                ? (<>{interval.getFrom()}{suffix ? suffix : undefined}</>)
                : (<>{interval.getFrom()}{suffix ? suffix : undefined} - {interval.getUntil()}{suffix ? suffix : undefined}</>)
            }
        </>
    )
}

export const RenderBakingTimeAware = ({value}: RenderBakingTimeAwareProps) => {
    const translate = useTranslation();
    const innerTemperature:NumberInterval | null = value.getInnerTemperature();
    const description: null | string = value.getDescription();
    return (
        <>
            {
                value.getBakingTime().map((bakingTime, index) => (
                    <Typography variant="body1" key={index}>
                        <TranslatedLabel label={bakingTime.isSteam() ? translate.t("Steam") : translate.t("Bake")}/>
                        {" "}
                        <NumberIntervalLabel interval={bakingTime.getInterval()}/> {translate.t("minutes")} <NumberIntervalLabel interval={bakingTime.getTemperature()}/>℃
                    </Typography>
                ))
            }
            {
                innerTemperature ? <Typography variant="body1">{translate.t("Inner temperature")} <NumberIntervalLabel interval={innerTemperature} suffix="℃"/></Typography> : undefined
            }
            {
                description ? <Typography variant="body1">{description}</Typography> : undefined
            }
        </>
    )
}
