import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

const Table = (props) => {
    const [pageLoaded, setPageLoaded]   = useState(false);
    const [page, setPage]               = useState(null);
    const [pageSize, setPageSize]       = useState(25);
    const [tuples, setTuples]           = useState([]);

    const tableModel = props.tableModel;

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    const readData = (newPageSize) => {
        setPageSize(newPageSize);
        tableModel.reference.read(newPageSize).then(function (newPage) {
            setPage(newPage);
            setTuples(newPage.tuples);
            setPageLoaded(true);
        }).catch(function (err) {
            console.log(err)
        });
    }

    // component mounted
    useEffect(() => {
        console.log("Table mounted");

        readData(referenceStore.refIndexMap[tableModel.refIndex].pageSize);
    }, []);

    // when reference store variable is set or changes, set loaded true
    useEffect(() => {
        if (referenceStore) {
            // pageSize change
            let newPageSize = referenceStore.refIndexMap[tableModel.refIndex].pageSize;
            if (newPageSize && newPageSize != pageSize) {
                setPageLoaded(false);
                readData(referenceStore.refIndexMap[tableModel.refIndex].pageSize);
            }
        }
    }, [referenceStore, dispatch]);

    const renderColumnHeaders = () => {
        return tableModel.reference.columns.map((column, index) => {
            // how to add conditional class/tooltip
            // ng-class="{'chaise-icon-for-tooltip': col.column.comment}"
            let columnName = column.displayname.value;
            return (<th key={index}>
                <span className="table-column-displayname" tooltip-placement="auto top">
                    {column.displayname.isHTML
                        ? <span dangerouslySetInnerHTML={{ __html: columnName }}></span>
                        : <span>{columnName}</span>
                    }
                </span>
            </th>)
        });
    }

    const handleViewClick = (target) => {
        if (!target.value) {
            target = target.parentElement;
        }

        let refPath = "isa:dataset/RID=" + target.value;

        store.dispatch({ type: "reference/setAppState", appState: "Record", referencePath: refPath });
    }

    const renderTableData = () => {
        if (pageLoaded) {
            // <button className="edit-action-btn chaise-btn chaise-btn-tertiary chaise-btn-link icon-btn"><span className="chaise-btn-icon glyphicon glyphicon-pencil"></span></button>
            return page.tuples.map((tuple, index) => {
               return (<tr key={index}>
                   <td className="action-btns">
                      <div className="chaise-btn-group">
                          <button className="view-action-btn chaise-btn chaise-btn-tertiary chaise-btn-link icon-btn" value={tuple.data.RID} onClick={event => handleViewClick(event.target)}><span className="chaise-btn-icon chaise-icon chaise-view-details"></span></button>
                          <button className="delete-action-btn chaise-btn chaise-btn-tertiary chaise-btn-link icon-btn"><span className="chaise-btn-icon far fa-trash-alt"></span></button>
                      </div>
                   </td>
                   {renderTableCell(tuple)}
                 </tr>)
            });
        }
    }

    const renderTableCell = (tuple) => {
        return tuple.values.map((value, index) => {
            const isHTML = tuple.isHTML[index];
            return (<td key={index}>
                {isHTML
                    ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: value }}></span>
                    : <span>{value}</span>
                }
            </td>)
        });
    }

    return(<div className="outer-table recordset-table">
        <table className="table chaise-table table-striped table-hover">
            <thead className="table-heading">
                <tr>
                    <th className="actions-header">Actions</th>
                    {renderColumnHeaders()}
                </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
        </table>
    </div>);
}

export default Table;
