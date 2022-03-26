import {BakingTime} from "../../models/interfaces/BakingTime";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {NumberIntervalLabel} from "../common/NumberIntervalLabel";

export type BakingTimeItemsProps = {
    bakingTimes: BakingTime[];
}

export const BakingTimeItems = ({bakingTimes}: BakingTimeItemsProps) => {
    return (
        <>
            {bakingTimes.length > 0 ? (
                <section className="bakingTimes">
                    <ul className="bakingTimes">
                        {bakingTimes.map((bakingTime, index) => (
                            <li key={index}>
                                <TranslatedLabel label={bakingTime.isSteam() ? "Auruta" : "Küpseta"}/>
                                {" "}
                                <NumberIntervalLabel interval={bakingTime.getInterval()}/> minutit <NumberIntervalLabel interval={bakingTime.getTemperature()}/>℃
                            </li>
                        ))}
                </ul>
                </section>
            ) : undefined}
        </>
    )
}
