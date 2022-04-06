import {BakingAwareType, NumberIntervalType} from "../../types";
import {TranslatedLabel, Translation} from "../../Translations";
import {Typography} from "@mui/material";

export type RenderBakingTimeAwareProps = {
    value: BakingAwareType;
}

const NumberIntervalLabel = ({interval, suffix}: {interval: NumberIntervalType, suffix?: string}) => {
    return (
        <>
            { interval.from === interval.until
                ? (<>{interval.from}{suffix ? suffix : undefined}</>)
                : (<>{interval.from}{suffix ? suffix : undefined} - {interval.until}{suffix ? suffix : undefined}</>)
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
                        <NumberIntervalLabel interval={bakingTime.time}/> <Translation label={"minutes"}/> <NumberIntervalLabel interval={bakingTime.temperature}/>℃
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
