import { createSlice } from '@reduxjs/toolkit'

export const referenceSlice = createSlice({
    name: 'reference',
    initialState: {
        appState: "Recordset",
        reference: null,
        page: null,
        // reread - should reference be read again
        // reference - current reference object for index
        // pageSize - current pageSize
        refIndexMap: {}
    },
    // NOTE: no clue what 'state' variable is
    reducers: {
        setReference: (state, action) => {
            state.reference = action.resolvedReference;
        },
        setPage: (state, action) => {
            state.page = action.refPage;
        },
        initializeRefIndex: (state, action) => {
            state.refIndexMap[action.refIndex] = { reread: false, reference: action.reference, pageSize: 25, facetChecked: false }
        },
        newReference: (state, action) => {
            let refModel = state.refIndexMap[action.refIndex];
            refModel.reference = action.reference;
            refModel.reread = true;
            refModel.facetChecked = action.facetChecked;
            refModel.noFaceting = action.noFaceting || false;
        },
        newPageSize: (state, action) => {
            let refModel = state.refIndexMap[action.refIndex];
            refModel.pageSize = parseInt(action.pageSize);
            refModel.reread = true;
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
