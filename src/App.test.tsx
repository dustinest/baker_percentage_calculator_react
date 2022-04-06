import React from 'react';
import { render } from '@testing-library/react';
//import { screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  //const linkElement = screen.getByText(/Loading.../i);
  //expect(linkElement).toBeInTheDocument();
  //const svgLoader = document.getElementsByClassName("MuiCircularProgress-root")
  //expect(svgLoader).toBeVisible();

});
