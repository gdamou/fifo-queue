import { Action } from './actionTypes';

export type Credit = {
    [key in Action]: number;
};
