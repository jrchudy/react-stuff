import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

import TableHeader from './TableHeader';
import RecordsetTable from './RecordsetTable';

const Recordset = (props) => {
    const [isLoaded, setIsLoaded]   = useState(false);
    const [reference, setReference] = useState(null);
    const [page, setPage]           = useState(null);
    const [tuples, setTuples]       = useState([]);
    const [pageSize, setPageSize]   = useState(25);

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted, fetch the initial reference and read the data
    useEffect(() => {
        console.log("Recordset mounted");
    }, []);

    // reference updated from store
    useEffect(() => {
        if (referenceStore && (referenceStore.pageSize != pageSize || referenceStore.reference != reference)) {
            setIsLoaded(false);
            setPageSize(referenceStore.pageSize);

            let refToRead = reference;
            if (referenceStore.reference != reference) {
                setReference(referenceStore.reference);
                refToRead = referenceStore.reference;
            }

            refToRead.read(referenceStore.pageSize).then(function (newPage) {

                setPage(newPage);
                store.dispatch({ type: "reference/setPage", refPage: newPage });

                setTuples(newPage.tuples);
                setIsLoaded(true);
            });
        }
    }, [referenceStore, dispatch]);

    const renderDisplayName = () => {
        if (isLoaded) {
            var displaynameObj = reference.displayname;
            return (<h2>
                {displaynameObj.isHTML
                    ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: displaynameObj.value }}></span>
                    : <span>{displaynameObj.value}</span>
                }
              </h2>)
        }
    }

    return(<div>
        {renderDisplayName()}
        <TableHeader />
        <RecordsetTable className="recordset-table-container" />
    </div>);
}

export default Recordset;
