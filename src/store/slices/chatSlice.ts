import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatState {
    messages: ChatMessage[];
    isOpen: boolean;
    isLoading: boolean;
}

const initialState: ChatState = {
    messages: [
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Salut ! Je suis votre assistant CineBooking. Comment puis-je vous aider aujourd\'hui ? Vous pouvez me poser des questions sur les films, les horaires ou demander une recommandation.',
            timestamp: Date.now(),
        },
    ],
    isOpen: false,
    isLoading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
        },
        addMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) => {
            state.messages.push({
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now(),
            });
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        clearChat: (state) => {
            state.messages = initialState.messages;
        },
    },
});

export const { toggleChat, addMessage, setLoading, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
