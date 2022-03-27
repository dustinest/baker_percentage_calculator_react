# App to convert any baker's recipe to Sourdough

The goal of this appp is to calculate any baking recipe to sourdough based on baker's percentgages.
There are some hacks in code which might need some attention (IE starter for pancakes).

Check [src/data/PredefinedRecipes.ts](src/data/PredefinedRecipes.ts) for predefined recipes.

The predefined flour even can be defined as percentage. But the total of the percentages must be less than 100. For instance:
```
[{
    name: "flour1"
    amount: 123,
},
{
    name: "flour2"
    percent: 100,
}]
```
Will fail. As there can not be total 200% of flour.

```
[{
    name: "flour1"
    amount: 123,
},
{
    name: "flour2"
    percent: 2,
},
{
    name: "flour3"
    percent: 50,
}]
```
Does not fail, as flour1 percentage will be `123 * (100 - 2 - 50) / 100`

## Next steps:
// TODO: at the moment the inputs do not matter but they should!

# Setup
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
