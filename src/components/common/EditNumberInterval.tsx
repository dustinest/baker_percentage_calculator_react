import {NumberIntervalType} from "../../types";
import {InputValue} from "./InputValue";

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
    <><InputValue value={interval.from} onChange={(value) => triggerFrom(value, interval, onChange)}/> - <InputValue value={interval.until} onChange={(value) => triggerUntil(value, interval, onChange)}/>{suffix ? suffix : undefined}</>
  );
}
