import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

import RecordsetTable from './RecordsetTable';

const Recordset = (props) => {
    const [isLoaded, setIsLoaded]   = useState(false);
    const [appReference, setAppReference] = useState(null);

    const refIndex = 0;

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted, fetch the initial reference and read the data
    useEffect(() => {
        console.log("Recordset mounted");
        store.dispatch({ type: "reference/initializeRefIndex", refIndex: refIndex, reference: referenceStore.reference });
    }, []);

    // reference updated from store
    // update reference and push down to children
    useEffect(() => {
        if (referenceStore.refIndexMap[refIndex]) {
            let storeReference = referenceStore.refIndexMap[refIndex].reference;
            if (storeReference && storeReference != appReference) {
                setIsLoaded(false);
                console.log("Recordset reference from store: ", storeReference.uri);
                setAppReference(storeReference);
                setTimeout(function () {
                    setIsLoaded(true)
                }, 0);
            }
        }

    }, [referenceStore, dispatch]);

    const renderRecordset = () => {
        if (isLoaded) {
            var displaynameObj = appReference.displayname;
            return (<div>
                <h2>
                    {displaynameObj.isHTML
                        ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: displaynameObj.value }}></span>
                        : <span>{displaynameObj.value}</span>
                    }
                </h2>
                <RecordsetTable tableModel={{reference: appReference, refIndex: refIndex}} />
            </div>)
        }
    }

    return(<div>
        {renderRecordset()}
    </div>);
}

export default Recordset;
