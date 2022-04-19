import {BakingAwareType, NumberIntervalType} from "../../../types/index";
import {Translation} from "../../../Translations";
import {Container, Divider} from "@mui/material";
import {ItemText} from "./ItemText";
import {VerticalStack} from "../../common/CommonStack";

export type RenderBakingTimeAwareProps = {
  value: BakingAwareType;
}

const getIntervalString = (interval: NumberIntervalType) => interval.from === interval.until ? `${interval.from}` : `${Math.min(interval.from, interval.until)} - ${Math.max(interval.from, interval.until)}`;

export const RenderBakingTimeAware = ({value}: RenderBakingTimeAwareProps) => {
  return (
    <>
      <Container component="section" className="baking-instructions">
        <VerticalStack divider={<Divider orientation="horizontal" flexItem/>}>
          <VerticalStack>
            {
              value.bakingTime.map((bakingTime, index) => (
                <ItemText className="baking-instructions" key={index}><Translation
                  label={bakingTime.steam ? "baking_instructions.steam" : "baking_instructions.bake"}
                  args={{
                    minutes: getIntervalString(bakingTime.time),
                    temperature: getIntervalString(bakingTime.temperature)
                  }}/></ItemText>
              ))
            }
            {
              value.innerTemperature ?
                <ItemText className="inner-temperature"><Translation label="baking_instructions.inner_temperature"
                                                                     args={{temperature: getIntervalString(value.innerTemperature)}}/></ItemText>
                : undefined
            }
          </VerticalStack>
          {
            value.description ? <ItemText>{value.description}</ItemText> : undefined
          }
        </VerticalStack>
      </Container>
    </>
  )
}
