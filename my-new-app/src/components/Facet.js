import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

const Facet = (props) => {
    const [checked, setChecked]     = useState(false);
    const [reference, setReference] = useState(null);

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);


    // component mounted
    useEffect(() => {
        // do nothing currently since has to wait for reference to resolve
        console.log("Facet checkbox mounted");
    }, []);

    // when reference store variable is set or changes
    useEffect(() => {
        if (referenceStore && referenceStore.reference != reference) {
            setReference(referenceStore.reference);
        }
    }, [referenceStore, dispatch]);

    const renderCheckbox = () => {
        if (reference) {
            return (<label>
                <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
                Toggle Facet Blob
            </label>)
        }
    }

    let config = {skipRetryBrowserError: true, skipHTTP401Handling: true};
    const handleCheckboxChange = () => {
        if (checked) {
            // get base reference
            setChecked(false);
            let newRefUri = reference.unfilteredReference.uri;
            ERMrest.resolve(newRefUri, config).then(function (mainRef) {
                let ref = mainRef.contextualize.compact;
                setReference(ref);
                store.dispatch({ type: "reference/setReference", resolvedReference: ref });
            });
        } else {
            setChecked(true);
            // apply facet blob
            let facetBlob = "*::facets::N4IghgdgJiBcDaoDOB7ArgJwMYFM6JAEsIAjdafIpMEAGhCjABcwkcmB9FDAc0kKQBbDoxZtOhKBwBmAaxwBPEAF0AvrVDomZNBQRUa9Ua3Zde-IWb4QBwuYpXqiMZfSwALFIVxJKAOQBhACEASQAVAEEADQB5P1gATgA2AAYkxzUgA@sort(accession::desc::)";
            let newRefUri = reference.unfilteredReference.uri + "/" + facetBlob;
            ERMrest.resolve(newRefUri, config).then(function (mainRef) {
                let ref = mainRef.contextualize.compact;
                setReference(ref);
                store.dispatch({ type: "reference/setReference", resolvedReference: ref });
            });
        }
    }

    // TODO: replace select
    // <span className="caret"></span>
    return(<div style={{margin: "10px 0"}}>
        {renderCheckbox()}
    </div>);
}

export default Facet;
