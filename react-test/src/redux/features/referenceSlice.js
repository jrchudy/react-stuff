'use strict';

var reduxTK = require('@reduxjs/toolkit');

const ReferenceSlice = reduxTK.createSlice({
    name: 'reference',
    initialState: {
        reference: null,
        page: null,
        pageSize: 25
    },
    reducers: {
        setReference: (state) => {
            console.log(state.action);
        },
        reread: (state, action) => {
            state.reference.read(state.pageSize).then(function (page) {
                state.page = page;
            });
        },
        newPageSize: (state, action) => {
            state.pageSize = action.payload;
            // todo call reread reducer instead of reading here
            state.reference.read(action.payload).then(function (page) {
                state.page = page;
            })
        },
        selectReference: (state) => {
            state.reference
        }
    }
});

console.log("slice file, ref slice: ", ReferenceSlice);

module.exports = ReferenceSlice;
