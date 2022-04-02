type TranslationValues = {[key: string]: string};
enum TranslationLanguage {
    en= "en",
    et = "et"
}

// noinspection JSNonASCIINames,NonAsciiCharacters
export const TRANSLATIONS = {
    en: {
        "Esimene päev": "First day",
        "Teine päev": "Second day",
        Milk_other: "Milk ({{count}}% fats)",
        "Wheat flour_other": "Wheat flour ({{count}} ash)",
        Butter_other: "Butter ({{count}}% fats)",
        "Egg_one": "{{count}} egg",
        "Egg_other": "{{count}} eggs"
    },
    et: {
        water: "vesi",
        Water: "Vesi",
        flour: "jahu",
        dry: "kuiv",
        salt: "sool",
        Salt: "Sool",
        sugar: "suhkur",
        Sugar: "Suhkur",
        "Brown sugar": "Pruunsuhkur",
        "Cardamom": "Kardemon",
        Cinnamon: "Kaneel",
        fat: "rasv",
        Milk_other: "Piim ({{count}}%)",
        "Wheat flour_other": "Nisujahu {{count}}",
        Butter_other: "Või ({{count}}%)",
        spice: "vürtsid",
        "Egg_other": "{{count}} muna",
        "egg": "muna",
        other: "teised",
        Starter: "Juuretis",
        Dough: "Taigen",
        "Durum flour": "Durumjahu",
        "Olive oil": "Oliivõli",
        "Whole grain rye flour": "Täistera rukkijahu",
        "Rye malt flour": "Rukkilinnase jahu",
        "Recipe components": "Retsepti komponendid",
        "Baker's percentage": "Pagari protsent",
        "minutes": "minutit",
        "Bake": "Küpseta",
        "Steam": "Auruta",
        "Inner temperature": "Sisetemperatuur"
    }
} as {[key in TranslationLanguage]: TranslationValues}
