import { createSlice } from '@reduxjs/toolkit'

export const referenceSlice = createSlice({
    name: 'reference',
    initialState: {
        appState: "Recordset",
        reference: null,
        page: null,
        pageSize: 25
    },
    // NOTE: no clue what 'state' variable is
    reducers: {
        setReference: (state, action) => {
            state.reference = action.resolvedReference;
        },
        setPage: (state, action) => {
            state.page = action.refPage;
        },
        reread: (state, action) => {
            // given action.reference, read the next/previous page
            action.reference.read(state.pageSize).then(function (page) {
                state.page = page;
            }).catch(function (err) {
                console.log(err)
            });
        },
        newPageSize: (state, action) => {
            state.pageSize = parseInt(action.pageSize);
        },
        setAppState: (state, action) => {
            state.appState = action.appState;
            state.referencePath = action.referencePath;
        }
    }
});

// NOTE: in theory, you can export the actions so they can be referenced in other files instead of calling "slice.name/actionName"
export const { setReference, setPage, reread, newPageSize, setAppState } = referenceSlice.actions

export default referenceSlice.reducer;
