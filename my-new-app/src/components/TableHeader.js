import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

import Facet from './Facet';

const TableHeader = (props) => {
    const [selectedPageLimit, setSelectedPageLimit] = useState(25);
    const [isLoaded, setIsLoaded]                   = useState(false);
    const [aggCount, setAggCount]                   = useState('XXX');
    const [reference, setReference]                 = useState(null);

    // never going to change
    const pageLimits = [10, 25, 50, 75, 100, 200];

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);


    // component mounted
    useEffect(() => {
        // do nothing currently since has to wait for reference to resolve
        console.log("Table header mounted");
    }, []);

    // when reference store variable is set or changes, make request to fetch agg count
    useEffect(() => {
        if (referenceStore && referenceStore.reference != reference) {
            setReference(referenceStore.reference);
            referenceStore.reference.getAggregates([referenceStore.reference.aggregate.countAgg]).then(function (data) {
                setAggCount(data[0]);
            }).catch(function (err) {
                console.log(err)
            });
        }
    }, [referenceStore, dispatch]);

    const renderPageLimits = () => {
        // <span className={"glyphicon pull-right " + this.state.selectedPageLimit === limit ? 'glyphicon-ok' : 'glyphicon-invisible'}></span>
        return pageLimits.map((limit, index) => {
            return (<option key={index} className={"page-size-limit-${limit}"}>{limit}</option>)
        })
    }

    const handlePageLimitChange = (value) => {
        // dispatch to store that reference should be reread
        store.dispatch({ type: "reference/newPageSize", pageSize: value });
        setSelectedPageLimit(value);
    }

    const handleCreateClick = () => {
        let refPath = "isa:dataset";

        store.dispatch({ type: "reference/setAppState", appState: "Recordedit", referencePath: refPath });
    }

    // TODO: replace select
    // <span className="caret"></span>
    return(<div style={{margin: "10px 0"}}>
        <Facet />
        <span>Displaying first <select className="page-size-dropdown chaise-btn chaise-btn-secondary" value={selectedPageLimit} onChange={event => handlePageLimitChange(event.target.value)}>
        {renderPageLimits()}
        </select> of {aggCount} records</span>
        <button className="pull-right chaise-btn chaise-btn-primary" onClick={handleCreateClick}>Create</button>
    </div>);
}

export default TableHeader;
