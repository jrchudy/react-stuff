import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

import TableHeader from './TableHeader';
import Table from './Table';

const RecordsetTable = (props) => {
    const [isLoaded, setIsLoaded]   = useState(false);
    const [page, setPage]           = useState(null);
    const [tuples, setTuples]       = useState([]);
    const [pageSize, setPageSize]   = useState(25);

    // contains:
    //   reference - object
    //   refIndex - string index value
    const tableModel = props.tableModel;

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted
    useEffect(() => {
        console.log("Recordset Table mounted");
    }, []);

    return(<div>
        <TableHeader tableModel={tableModel} />
        <Table className="recordset-table-container" tableModel={tableModel} />
    </div>);
}

RecordsetTable.whyDidYouRender = true;
export default RecordsetTable;
