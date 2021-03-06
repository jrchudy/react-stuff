import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

const Facet = (props) => {
    const tableModel = props.tableModel;

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // defined after referenceStore since it relies on a stored variable
    const [checked, setChecked] = useState(referenceStore.refIndexMap[tableModel.refIndex].facetChecked);

    // component mounted
    useEffect(() => {
        // do nothing currently since has to wait for reference to resolve
        console.log("Facet checkbox mounted");
    }, []);

    let config = {skipRetryBrowserError: true, skipHTTP401Handling: true};
    const handleCheckboxChange = () => {
        if (checked) {
            // get base reference
            setChecked(false);
            let newRefUri = tableModel.reference.unfilteredReference.uri;
            ERMrest.resolve(newRefUri, config).then(function (mainRef) {
                store.dispatch({ type: "reference/newReference", reference: mainRef.contextualize.compact, refIndex: tableModel.refIndex, facetChecked: false });
            }).catch(function (err) {
                console.log(err)
            });
        } else {
            setChecked(true);
            // apply facet blob
            let facetBlob = "*::facets::N4IghgdgJiBcDaoDOB7ArgJwMYFM6JAEsIAjdafIpMEAGhCjABcwkcmB9FDAc0kKQBbDoxZtOhKBwBmAaxwBPEAF0AvrVDomZNBQRUa9Ua3Zde-IWb4QBwuYpXqiMZfSwALFIVxJKAOQBhACEASQAVAEEADQB5P1gATgA2AAYkxzUgA@sort(accession::desc::)";
            let newRefUri = tableModel.reference.unfilteredReference.uri + "/" + facetBlob;
            ERMrest.resolve(newRefUri, config).then(function (mainRef) {
                store.dispatch({ type: "reference/newReference", reference: mainRef.contextualize.compact, refIndex: tableModel.refIndex, facetChecked: true });
            }).catch(function (err) {
                console.log(err)
            });
        }
    }

    const renderCheckbox = () => {
        let toggleText = " Toggle Facet Blob"
        return (<label>
            <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
            {toggleText}
        </label>)
    }

    // TODO: replace select
    // <span className="caret"></span>
    return(<div style={{margin: "10px 0"}}>
        {renderCheckbox()}
    </div>);
}

export default Facet;
