import {NumberIntervalType} from "../../../types";
import {InputValue} from "../../common/InputValue";
import "./EditNumberInterval.css";
import {HorizontalActionStack} from "../../common/CommonStack";

type EditNumberIntervalProps = {
  interval: NumberIntervalType;
  onChange: (from: number, until: number) => void;
  suffix?: string;
  className?: string;
}

const triggerFrom = async (from: number, interval: NumberIntervalType, onChange: (from: number, until: number) => void) => {
  const until = from > interval.until ? from : interval.until;
  onChange(from, until);
}

const triggerUntil = async (until: number, interval: NumberIntervalType, onChange: (from: number, until: number) => void) => {
  const from = until < interval.from ? until : interval.from;
  onChange(from, until);
}

export const EditNumberInterval = ({interval, suffix, onChange, className}: EditNumberIntervalProps) => {
  return (
    <>
      <HorizontalActionStack
        spacing={0.5}
        divider={<span>-</span>}
        className={className}
      >
        <InputValue value={interval.from} onChange={(value) => triggerFrom(value, interval, onChange)}
                    className="number-interval-input number-interval-from"/>
        <InputValue value={interval.until} onChange={(value) => triggerUntil(value, interval, onChange)}
                    className="number-interval-input number-interval-until"/>
        {suffix ? <label>{suffix}</label> : undefined}
      </HorizontalActionStack>
    </>
  );
}
