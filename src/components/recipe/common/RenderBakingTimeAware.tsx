import {BakingAwareType, NumberIntervalType} from "../../../types/index";
import {TranslatedTypographyBody} from "../../../Translations";
import {Container, Typography} from "@mui/material";

export type RenderBakingTimeAwareProps = {
    value: BakingAwareType;
}

const getIntervalString = (interval: NumberIntervalType) => interval.from === interval.until ? `${interval.from}` : `${Math.min(interval.from, interval.until)} - ${Math.max(interval.from, interval.until)}`;

export const RenderBakingTimeAware = ({value}: RenderBakingTimeAwareProps) => {
    return (
        <>
            <Container component="section" className="baking-instructions">
                {
                    value.bakingTime.map((bakingTime, index) => (
                            <TranslatedTypographyBody key={index}
                                label={bakingTime.steam ? "baking_instructions.steam" : "baking_instructions.bake"}
                                args={{
                                    minutes: getIntervalString(bakingTime.time),
                                    temperature: getIntervalString(bakingTime.temperature)
                                }}/>
                    ))
                }
                {
                    value.innerTemperature ?
                        <TranslatedTypographyBody label="baking_instructions.inner_temperature" args={{temperature: getIntervalString(value.innerTemperature)}}/>
                        : undefined
                }
                {
                    value.description ? <Typography variant="body1">{value.description}</Typography> : undefined
                }
            </Container>
        </>
    )
}
