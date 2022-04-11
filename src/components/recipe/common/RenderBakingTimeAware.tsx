import {BakingAwareType, NumberIntervalType} from "../../../types/index";
import {TranslatedLabel, Translation} from "../../../Translations";
import {Typography} from "@mui/material";

export type RenderBakingTimeAwareProps = {
    value: BakingAwareType;
}

const NumberIntervalLabel = ({interval, suffix}: {interval: NumberIntervalType, suffix?: string}) => {
    const from = Math.min(interval.from, interval.until);
    const until = Math.max(interval.from, interval.until);
    return (
        <>
            { from === until
                ? (<>{from}{suffix ? suffix : undefined}</>)
                : (<>{from}{suffix ? suffix : undefined} - {until}{suffix ? suffix : undefined}</>)
            }
        </>
    )
}

export const RenderBakingTimeAware = ({value}: RenderBakingTimeAwareProps) => {
    const innerTemperature:NumberIntervalType | null = value.innerTemperature;
    const description: null | string = value.description;
    return (
        <>
            {
                value.bakingTime.map((bakingTime, index) => (
                    <Typography variant="body1" key={index}>
                        <TranslatedLabel label={bakingTime.steam ? "Steam" : "Bake"}/>
                        {" "}
                        <NumberIntervalLabel interval={bakingTime.time}/> <Translation label="minutes"/> <NumberIntervalLabel interval={bakingTime.temperature}/>℃
                    </Typography>
                ))
            }
            {
                innerTemperature ? <Typography variant="body1"><Translation label={"Inner temperature"}/> <NumberIntervalLabel interval={innerTemperature} suffix="℃"/></Typography> : undefined
            }
            {
                description ? <Typography variant="body1">{description}</Typography> : undefined
            }
        </>
    )
}
