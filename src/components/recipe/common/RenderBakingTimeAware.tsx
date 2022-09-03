import {BakingAwareType, NumberIntervalType} from "../../../types/index";
import {Translation} from "../../../Translations";
import {Container, Divider} from "@mui/material";
import { ItemTextNoWrap} from "./ItemText";
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
                <ItemTextNoWrap className="baking-instructions" key={index}><Translation
                    label={bakingTime.steam ? "baking_instructions.steam" : "baking_instructions.bake"}
                    minutes={getIntervalString(bakingTime.time)}
                    temperature={getIntervalString(bakingTime.temperature)}
                /></ItemTextNoWrap>
              ))
            }
            {
              value.innerTemperature ?
                <ItemTextNoWrap className="inner-temperature">
                  <Translation label="baking_instructions.inner_temperature"
                               temperature={getIntervalString(value.innerTemperature)}/>
                </ItemTextNoWrap>
                : undefined
            }
          </VerticalStack>
          {
            value.description ? <ItemTextNoWrap>{value.description}</ItemTextNoWrap> : undefined
          }
        </VerticalStack>
      </Container>
    </>
  )
}
