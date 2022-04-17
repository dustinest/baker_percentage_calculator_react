import {NumberIntervalType} from "../../../types";
import {InputValue} from "../../common/InputValue";
import "./EditNumberInterval.css";
import {Stack} from "@mui/material";

type EditNumberIntervalProps = {
  interval: NumberIntervalType;
  onChange: (from: number, until: number) => Promise<void>;
  suffix?: string;
}

export const triggerFrom = (from: number, interval: NumberIntervalType, onChange: (from: number, until: number) => Promise<void> ): Promise<void> => {
  const until = from > interval.until ? from : interval.until;
  return onChange(from, until);
}

export const triggerUntil = (until: number, interval: NumberIntervalType, onChange: (from: number, until: number) => Promise<void> ): Promise<void> => {
  const from = until < interval.from ? until : interval.from;
  return onChange(from, until);
}

export const EditNumberInterval = ({interval, suffix, onChange}: EditNumberIntervalProps) => {
  return (
    <>
      <Stack direction="row"
             justifyContent="flex-start"
             alignItems="center"
             spacing={0.5}
             divider={<span>-</span>}
      >
        <InputValue value={interval.from} onChange={(value) => triggerFrom(value, interval, onChange)} className="number-interval-input number-interval-from"/>
        <InputValue value={interval.until} onChange={(value) => triggerUntil(value, interval, onChange)}  className="number-interval-input number-interval-until"/>
        {suffix ? <label>{suffix}</label> : undefined}
      </Stack>
    </>
  );
}
