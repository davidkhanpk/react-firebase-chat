import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    activeUser: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
    },
  },
});

export const { setUsers, setActiveUser } = userSlice.actions;
export default userSlice.reducer;