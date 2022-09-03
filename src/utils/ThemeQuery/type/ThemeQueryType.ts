import { Breakpoint } from '@mui/material';

export interface UserResponsiveBetween {
  start: Breakpoint | number;
  end: Breakpoint | number;
}
export interface UserResponsiveUp {
  up: Breakpoint | number;
}
export interface UserResponsiveDown {
  down: Breakpoint | number;
}
export interface UserResponsiveOnly {
  only: Breakpoint;
}
