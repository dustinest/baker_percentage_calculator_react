import {BakingAwareType, NumberIntervalType} from "../../../types/index";
import {Translation} from "../../../Translations";
import {Container, Divider, Stack} from "@mui/material";
import {ItemText} from "./ItemText";

export type RenderBakingTimeAwareProps = {
    value: BakingAwareType;
}

const getIntervalString = (interval: NumberIntervalType) => interval.from === interval.until ? `${interval.from}` : `${Math.min(interval.from, interval.until)} - ${Math.max(interval.from, interval.until)}`;

export const RenderBakingTimeAware = ({value}: RenderBakingTimeAwareProps) => {
    return (
        <>
            <Container component="section" className="baking-instructions">
              <Stack direction="column"
                     justifyContent="stretch"
                     alignItems="center"
                     divider={<Divider orientation="horizontal" flexItem />}
                     spacing={2}>

                <Stack direction="column"
                       justifyContent="stretch"
                       alignItems="center"
                       spacing={0}>
                {
                    value.bakingTime.map((bakingTime, index) => (
                            <ItemText className="baking-instructions"><Translation key={index}
                                label={bakingTime.steam ? "baking_instructions.steam" : "baking_instructions.bake"}
                                args={{
                                    minutes: getIntervalString(bakingTime.time),
                                    temperature: getIntervalString(bakingTime.temperature)
                                }}/></ItemText>
                    ))
                }
                </Stack>
                {
                    value.innerTemperature ?
                      <ItemText className="inner-temperature"><Translation label="baking_instructions.inner_temperature" args={{temperature: getIntervalString(value.innerTemperature)}}/></ItemText>
                        : undefined
                }
                {
                    value.description ? <ItemText>{value.description}</ItemText> : undefined
                }
              </Stack>
            </Container>
        </>
    )
}
