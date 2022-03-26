const TRANSLATIONS = {
    est: {
        water: "vesi",
        flour: "jahu",
        dry: "kuiv",
        salt: "sool",
        sugar: "suhkur",
        fat: "rasv",
        spice: "vürtsid",
        egg: "muna",
        other: "teised",
        Starter: "Juuretis",
        Dough: "Taigen"
    }
} as {[key: string]: {[key: string]: string}}

export const getTranslation = (key: string): string => {
    return TRANSLATIONS.est[key] || key;
}
