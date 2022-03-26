import {NumberInterval} from "../../models/interfaces/NumberInterval";

export const NumberIntervalLabel = ({interval}: {interval: NumberInterval}) => {
    return (
        <>
            { interval.getFrom() === interval.getUntil()
                ? (<>{interval.getFrom()}</>)
                : (<>{interval.getFrom()} - {interval.getUntil()}</>)
            }
        </>
    )
}
