import {useEffect, useState} from "react";

export type SuffixType = "g" | "%" | "m" | "c" | undefined;

export type SuffixData = {
    type: SuffixType,
    label: string;
    suffix: string;
};

export const UseSuffix = (suffix: SuffixType): SuffixData | undefined => {
    const [_suffix, setSuffix] = useState<SuffixData | undefined>();
    useEffect(() => {
        if (suffix === "g") {
            setSuffix({
                type: suffix,
                label: "weight",
                suffix: "g"
            })
        } else if (suffix === "%") {
            setSuffix({
                type: suffix,
                label: "percent",
                suffix: "%"
            })
        } else if (suffix === "m") {
            setSuffix({
                type: suffix,
                label: "minutes",
                suffix: "m"
            })
        } else if (suffix === "c") {
            setSuffix({
                type: suffix,
                label: "temperature",
                suffix: "℃"
            })
        } else {
            setSuffix(undefined);
        }
    }, [suffix]);
    return _suffix;
};
