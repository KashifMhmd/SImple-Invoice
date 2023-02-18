import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  userData: '',
};
export const userProfileData = createSlice({
  name: 'user Data',
  initialState,
  reducers: {
    userDataCollector: (state, action) => {
      console.log(state, action);
      state.userData = action.payload;
    },
  },
});
export const {userDataCollector} = userProfileData.actions;
export default userProfileData.reducer;
