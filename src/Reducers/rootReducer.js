import {combineReducers} from '@reduxjs/toolkit';
import userProfileData from './userProfileData';
const rootReducers = combineReducers({
  userProfile: userProfileData,
});
export default rootReducers;
