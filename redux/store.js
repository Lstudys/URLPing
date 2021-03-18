import {createStore} from 'redux';
import {myReducer} from './reducer';

export const store =createStore(myReducer);