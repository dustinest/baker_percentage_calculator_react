import { NumberIntervalType } from "./types.ts";

type JsonNumberInterval = NumberIntervalType | number;

interface JsonBakingTime {
  time: JsonNumberInterval;
  temperature: JsonNumberInterval;
  steam?: boolean;
  label?: string | Record<string, string>;
}

interface JsonIngredientsIngredient {
  type: string;
  grams?: number;
  percent?: number;
  name?: string;
  id?: string;
  nutrients?: Array<{ type: string; percent: number }>;
}

export interface JsonIngredients {
  name?: string | Record<string, string>;
  ingredients: JsonIngredientsIngredient[];
  starter?: boolean;
}

export interface JsonRecipe {
  id?: string;
  name: string | Record<string, string>;
  amount?: number;
  bakingTime?: JsonBakingTime[];
  innerTemperature?: JsonNumberInterval;
  ingredients: JsonIngredients[];
}

export const PREDEFINED_RECIPES: JsonRecipe[] = [
  {
    name: { et: "Täisteraleib", en: "Whole grain rye bread" },
    bakingTime: [
      { time: 20, temperature: 240, steam: true },
      { time: 40, temperature: 240 },
    ],
    innerTemperature: { from: 88, until: 99 },
    ingredients: [{
      ingredients: [
        { type: "WHOLE_RYE_FLOUR", grams: 405 },
        { type: "WHOLE_RYE_MALT_FLOUR", grams: 20 },
        { type: "WATER", percent: 100 },
        { type: "SALT", percent: 1.76 },
      ],
    }],
  },
  {
    name: { et: "Sai", en: "Wheat bread" },
    bakingTime: [
      { time: 20, temperature: 240, steam: true },
      { time: 20, temperature: 240 },
      {
        time: 25,
        temperature: 180,
        label: { et: "Kukkel 90g", en: "Bun 90g" },
      },
    ],
    innerTemperature: { from: 88, until: 99 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 462 },
        { type: "WATER", percent: 82 },
        { type: "SALT", percent: 1.62 },
      ],
    }],
  },
  {
    name: {
      et: "Sai seemnete ja kaerahelvestega",
      en: "Bread with seeds and oats",
    },
    bakingTime: [
      { time: 20, temperature: 240, steam: true },
      { time: 20, temperature: 240 },
    ],
    innerTemperature: { from: 88, until: 99 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 462 },
        { type: "BARLEY", grams: 10 },
        { type: "SEEDS", grams: 12 },
        { type: "WATER", percent: 73.76 },
        { type: "SALT", percent: 1.55 },
      ],
    }],
  },
  {
    name: { et: "Croissant", en: "Croissant" },
    bakingTime: [{ time: { from: 20, until: 30 }, temperature: 210 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [
      {
        ingredients: [
          { type: "WHEAT_550_FLOUR", grams: 500 },
          { type: "WATER", grams: 140 },
          { type: "MILK_25", grams: 140 },
          { type: "SUGAR", percent: 11 },
          { type: "BUTTER_82", grams: 40 },
          { type: "SALT", percent: 2.4 },
        ],
      },
      {
        name: { et: "Kihistamiseks", en: "Lamination" },
        ingredients: [{ type: "BUTTER_82", grams: 280 }],
      },
    ],
  },
  {
    name: { et: "Pannkook", en: "Pancake" },
    ingredients: [
      {
        starter: true,
        ingredients: [
          { type: "WHEAT_550_FLOUR", grams: 362 },
          { type: "WATER", grams: 129.5 },
          { type: "MILK_25", grams: 454 },
        ],
      },
      {
        ingredients: [
          { type: "BUTTER_82", grams: 50 },
          { type: "SALT", grams: 7.5 },
          { type: "SUGAR", grams: 14 },
          { type: "EGG", grams: 256 },
        ],
      },
    ],
  },
  {
    name: { et: "Pizza", en: "Pizza" },
    amount: 3,
    bakingTime: [{ time: { from: 18, until: 30 }, temperature: 210 }],
    ingredients: [{
      ingredients: [
        { type: "DURUM_WHEAT", grams: 515 },
        { type: "WATER", grams: 340 },
        { type: "OLIVE_OIL", grams: 27.44 },
        { type: "SALT", grams: 7.5 },
      ],
    }],
  },
  {
    name: { et: "Vastlakuklid", en: "Semla" },
    amount: 18,
    bakingTime: [{ time: { from: 20, until: 25 }, temperature: 180 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_405_FLOUR", grams: 483 },
        { type: "WATER", grams: 83 },
        { type: "MILK_25", grams: 210 },
        { type: "BUTTER_82", grams: 75 },
        { type: "SALT", grams: 5 },
        { type: "SUGAR_BROWN", grams: 50 },
        { type: "CARDAMOM", percent: 0.2 },
      ],
    }],
  },
  {
    name: { et: "Kaneelirullid", en: "Cinnamon rolls" },
    bakingTime: [{ time: { from: 20, until: 25 }, temperature: 210 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [
      {
        ingredients: [
          { type: "WHEAT_405_FLOUR", grams: 483 },
          { type: "WATER", grams: 83 },
          { type: "MILK_25", grams: 210 },
          { type: "BUTTER_82", grams: 75 },
          { type: "SALT", grams: 5 },
          { type: "SUGAR_BROWN", grams: 50 },
          { type: "CARDAMOM", percent: 0.2 },
        ],
      },
      {
        name: { et: "Kaanelikiht", en: "Cinnamon layer" },
        ingredients: [
          { type: "CINNAMON", percent: 3.28 },
          { type: "BUTTER_82", grams: 112 },
          { type: "SALT", grams: 1 },
          { type: "SUGAR", grams: 95 },
        ],
      },
    ],
  },
  {
    name: { et: "Plaadikook", en: "Tray bake" },
    bakingTime: [
      { time: { from: 20, until: 30 }, temperature: 210 },
      {
        time: 35,
        temperature: 180,
        label: { et: "Pirukad (umbes)", en: "Pies (approx.)" },
      },
    ],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 808 },
        { type: "WATER", grams: 123 },
        { type: "MILK_25", grams: 385 },
        { type: "BUTTER_82", grams: 200 },
        { type: "SALT", grams: 7.5 },
      ],
    }],
  },
  {
    name: { et: "Pikk sai", en: "Baguette" },
    amount: 2,
    bakingTime: [
      { time: 10, temperature: 180, steam: true },
      { time: { from: 15, until: 20 }, temperature: 180 },
    ],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 340 },
        { type: "WATER", grams: 142 },
        { type: "MILK_25", grams: 85 },
        { type: "SALT", grams: 6 },
      ],
    }],
  },
  {
    name: { et: "Moskva saiakesed", en: "Moscow pastries" },
    bakingTime: [{ time: { from: 20, until: 25 }, temperature: 180 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [
      {
        ingredients: [
          { type: "WHEAT_405_FLOUR", grams: 408 },
          { type: "WATER", grams: 130 },
          { type: "MILK_25", grams: 140 },
          { type: "SUGAR_BROWN", grams: 16 },
          { type: "BUTTER_82", grams: 50 },
          { type: "SALT", grams: 2 },
        ],
      },
      {
        name: { et: "Kihistamiseks", en: "Lamination" },
        ingredients: [{ type: "BUTTER_82", grams: 100 }],
      },
    ],
  },
];
