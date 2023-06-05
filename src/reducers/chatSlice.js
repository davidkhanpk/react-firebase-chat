import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        chatId: null,
    },
    reducers: {
        setMessages: (state, action) => {
            console.log(action.payload)

            if (action.payload.concat) {
                state.messages = state.messages.concat(action.payload.messages);
            } else {
                state.messages = action.payload.messages
            }
        },
        setChatId: (state, action) => {
            state.chatId = action.payload;
        },
    },
});

export const { setMessages, setChatId } = chatSlice.actions;
export default chatSlice.reducer;