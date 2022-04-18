enum TranslationLanguage {
    en= "en",
    et = "et"
}

// noinspection JSNonASCIINames,NonAsciiCharacters
export const TRANSLATIONS = {
    en: {
        title_other: "{{count}} recipes",
        title_one: "One recipe",
        edit: {
            edit: "Change",
            delete: "Delete",
            copyOf: "Copy",
            save: "Save",
            cancel: "Cancel",
            enforce_starter: {
                button: "Use all in pre-dough",
                legend: "All flour and liquid is used in pre-dough calculation"
            },
            description: {
                generic: "Description"
            },
            ingredients: {
                title: "Ingredients title",
                add: "Add new group"
            },
            baking_instructions: {
                steam: "Steam",
                time: "Time",
                temperature: "Temperature",
                inner_temperature: "Inner temperature",
            }
        },
        baking_instructions: {
            steam: "Steam {{minutes}} minutes {{temperature}}℃",
            bake: "Bake {{minutes}} minutes {{temperature}}℃",
            inner_temperature: "Inner temperature {{temperature}}℃"
        },
        ingredients: {
            title: {
                baker_percentage: "Baker's percentage",
                day_one: "First day",
                day_two: "Second day",
                dough: "Dough",
                sourdough_starter_dough: "Pre-dough",
                total_weight: "Total weight: {{count}} g",
                total_weight_item: "1 / {{divider}} = {{amount}} g"
            }
        },
        ingredient: {
            sourdough_starter: {
                name: "Sourdough starter",
            },
            predefined: {
                water: {
                    generic: "Water"
                },
                salt: {
                    generic: "Salt",
                },
                sugar: {
                    generic: "Sugar",
                    brown: "Brown sugar"
                },
                oil: {
                    generic: "Oil",
                    olive: "Olive oil"
                },
                milk: {
                    generic: "Milk",
                    generic_other: "Milk ({{count}}% fat)",
                },
                spice: {
                    generic: "Spice",
                    cardamom: "Cardamom",
                    cinnamon: "Cinnamon",
                },
                flour: {
                    generic: "Flour",
                    rye: {
                        generic: "Rye flour",
                        whole_grain: "Whole grain rye flour",
                        malt: "Rye malt flour"
                    },
                    wheat: {
                        generic: "Wheat flour",
                        generic_other: "Wheat flour ({{count}} ash)",
                        whole_grain: "Whole grain wheat flour",
                        durum: "Durum flour"
                    }
                },
                butter: {
                    generic: "Butter",
                    generic_other: "Butter ({{count}}% fat)",
                },
                egg: {
                    generic: "Egg",
                    generic_one: "{{count}} egg",
                    generic_other: "{{count}} eggs",
                },
                fat: {
                    generic: "Fat"
                },
                dry: {
                    generic: "Dry"
                }
            }
        },
        messages: {
            no_recipes: "No recipes!"
        },
        snackbar: {
            recipes_one: "one recipe",
            recipes_other: "{{count}} recipes",
            print_pages_one: "Print one double side page",
            print_pages_other: "Print {{count}} double side pages"
        },
    },
    et: {
        title_one: "üks retsept",
        title_other: "{{count}} retsepti",
        edit: {
            enforce_starter: {
                button: "Kõik on eeltaigen",
                legend: "Kogu jahu ja vedelikku kasutatakse juuretise arvutamisel. Seda on vaja juhul, kui soovid vedelamat eeltainast"
            },
            edit: "Muuda",
            delete: "Kustuta",
            copyOf: "Kopeeri",
            save: "Salvesta",
            cancel: "Tühista",
            description: {
                generic: "Kirjeldus"
            },
            ingredients: {
                title: "Nimetus",
                add: "Lisa uus grupp"
            },
            baking_instructions: {
                steam: "Aur",
                time: "Aeg",
                temperature: "Temperatuur",
                inner_temperature: "Sisetemperatuur",
            }
        },
        baking_instructions: {
            steam: "Auruta {{minutes}} minutit {{temperature}}℃",
            bake: "Küpseta {{minutes}} minutit {{temperature}}℃",
            inner_temperature: "Sisetemperatuur {{temperature}}℃"
        },
        ingredients: {
            title: {
                baker_percentage: "Pagari protsent",
                day_one: "Esimene päev",
                day_two: "Teine päev",
                dough: "Taigen",
                sourdough_starter_dough: "Eeltaigen",
                total_weight: "Kokku: {{count}} g",
                total_weight_item: "1 / {{divider}} = {{amount}} g"
            }
        },
        ingredient: {
            sourdough_starter: {
                name: "Juuretis",
            },
            predefined: {
                water: {
                    generic: "Vesi"
                },
                salt: {
                    generic: "Sool",
                },
                sugar: {
                    generic: "Suhkur",
                    brown: "Pruunsuhkur"
                },
                oil: {
                    generic: "õli",
                    olive: "Oliivõli"
                },
                milk: {
                    generic: "Piim",
                    generic_other: "Piim ({{count}}%)",
                },
                spice: {
                    generic: "Vürts",
                    cardamom: "Kardemon",
                    cinnamon: "Kaneel",
                },
                flour: {
                    generic: "Jahu",
                    rye: {
                        generic: "Rukkijahu",
                        whole_grain: "Täistera rukkijahu",
                        malt: "Rukkilinnase jahu"
                    },
                    wheat: {
                        generic: "Nisujahu",
                        generic_other: "Nisujahu {{count}}",
                        whole_grain: "Täistera nisujahu",
                        durum: "Durum jahu"
                    }
                },
                butter: {
                    generic: "Või",
                    generic_other: "Või ({{count}}%)",
                },
                egg: {
                    generic: "Muna",
                    generic_other: "{{count}} muna",
                },
                fat: {
                    generic: "Rasv"
                },
                dry: {
                    generic: "Kuiv"
                }
            }
        },
        messages: {
            no_recipes: "Retsepte ei ole valitud!"
        },
        snackbar: {
            recipes_one: "üks retsept",
            recipes_other: "{{count}} retsepti",
            print_pages_one: "Prindid ühe kahepoolse lehe",
            print_pages_other: "Prindid {{count}} kahepoolse lehte"
        }
    }
} as {[key in TranslationLanguage]: any}
