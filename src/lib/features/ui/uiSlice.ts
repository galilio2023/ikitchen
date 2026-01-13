import { createSlice } from '@reduxjs/toolkit';

interface UIState {
    isModalOpen: boolean;
}

const initialState: UIState = {
    isModalOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openModal: (state) => {
            state.isModalOpen = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
        },
        toggleModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        }
    },
});

export const { openModal, closeModal, toggleModal } = uiSlice.actions;
export default uiSlice.reducer;
