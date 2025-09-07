import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    likes: {}, // novo estado para armazenar likes por houseId
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Usuário
        signInStart: (state) => { state.loading = true; },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => { state.error = action.payload; state.loading = false; },

        updateUserStart: (state) => { state.loading = true; },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => { state.error = action.payload; state.loading = false; },

        deleteUserStart: (state) => { state.loading = true; },
        deleteUserSuccess: (state) => { state.currentUser = null; state.likes = {}; state.loading = false; state.error = null; },
        deleteUserFailure: (state, action) => { state.error = action.payload; state.loading = false; },

        signOutUserStart: (state) => { state.loading = true; },
        signOutUserSuccess: (state) => { state.currentUser = null; state.likes = {}; state.loading = false; state.error = null; },
        signOutUserFailure: (state, action) => { state.error = action.payload; state.loading = false; },

        forgotStart: (state) => { state.loading = true; },
        forgotSuccess: (state) => { state.currentUser = null; state.loading = false; state.error = null; },
        forgotFailure: (state, action) => { state.error = action.payload; state.loading = false; },

        // Likes
        setLike: (state, action) => {
            const { houseId, liked } = action.payload;
            state.likes[houseId] = liked;
        },
        removeLike: (state, action) => {
            const { houseId } = action.payload;
            delete state.likes[houseId];
        },
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
    forgotStart,
    forgotSuccess,
    forgotFailure,
    setLike,
    removeLike,
} = userSlice.actions;

export default userSlice.reducer;
