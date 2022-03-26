import {useEffect, useState} from "react";

export type SuffixType = "g" | "%" | "m" | "c" | undefined;

export const UseSuffix = (suffix: SuffixType): string | undefined => {
    const [_suffix, setSuffix] = useState<string | undefined>();
    useEffect(() => {
        if (suffix === "g") {
            setSuffix(" g");
        } else if (suffix === "%") {
            setSuffix(" %");
        } else if (suffix === "m") {
            setSuffix(" minutit");
        } else if (suffix === "c") {
            setSuffix(" ℃"); // celsius
        } else {
            setSuffix(undefined);
        }
    }, [suffix]);
    return _suffix;
};
