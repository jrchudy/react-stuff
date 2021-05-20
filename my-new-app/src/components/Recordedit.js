import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

const Recordedit = (props) => {
    const [isLoaded, setIsLoaded]   = useState(false);
    const [reference, setReference] = useState(null);

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted, fetch the initial reference and read the data
    useEffect(() => {
        console.log("Recordedit mounted");
        setReference(referenceStore.reference);
        setIsLoaded(true);
    }, []);

    // reference updated from store
    // useEffect(() => {
    //
    // }, [referenceStore, dispatch]);

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
    </div>);
}

export default Recordedit;
