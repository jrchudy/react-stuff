import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

import Facet from './Facet';

const TableHeader = (props) => {
    const [selectedPageLimit, setSelectedPageLimit] = useState(25);
    const [aggCount, setAggCount]                   = useState('XXX');

    // never going to change (unless rerendered);
    const pageLimits = [10, 25, 50, 75, 100, 200];
    const tableModel = props.tableModel

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted
    useEffect(() => {
        // do nothing currently since has to wait for reference to resolve
        console.log("Table header mounted");
        tableModel.reference.getAggregates([tableModel.reference.aggregate.countAgg]).then(function (data) {
            setAggCount(data[0]);
        }).catch(function (err) {
            console.log(err)
        });
    }, []);

    const renderPageLimits = () => {
        // <span className={"glyphicon pull-right " + this.state.selectedPageLimit === limit ? 'glyphicon-ok' : 'glyphicon-invisible'}></span>
        return pageLimits.map((limit, index) => {
            return (<option key={index} className={"page-size-limit-${limit}"}>{limit}</option>)
        })
    }

    const renderFaceting = () => {
        if (!tableModel.isRelated) {
            return (<Facet tableModel={tableModel} />)
        }
    }

    const renderCreate = () => {
        if (!tableModel.isRelated) {
            return (<button className="pull-right chaise-btn chaise-btn-primary" onClick={handleCreateClick}>Create</button>);
        }
    }

    const handlePageLimitChange = (value) => {
        // dispatch to store that reference should be reread
        store.dispatch({ type: "reference/newPageSize", pageSize: value, refIndex: tableModel.refIndex });
        setSelectedPageLimit(value);
    }

    const handleCreateClick = () => {
        let refPath = "isa:dataset";

        store.dispatch({ type: "reference/setAppState", appState: "Recordedit", referencePath: refPath });
    }

    // TODO: replace select
    // <span className="caret"></span>
    return(<div style={{margin: "10px 0"}}>
        {renderFaceting()}
        <span>Displaying first <select className="page-size-dropdown chaise-btn chaise-btn-secondary" value={selectedPageLimit} onChange={event => handlePageLimitChange(event.target.value)}>
            {renderPageLimits()}
        </select> of {aggCount} records</span>
        {renderCreate()}
    </div>);
}

export default TableHeader;
