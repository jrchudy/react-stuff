import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

const RecordsetTable = (props) => {
    const [referenceLoaded, setReferenceLoaded]     = useState(false);
    const [reference, setReference]                 = useState(null);
    const [pageLoaded, setPageLoaded]               = useState(false);
    const [page, setPage]                           = useState(null);

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted
    useEffect(() => {
        // do nothing currently since has to wait for reference to resolve
        console.log("Recordset Table mounted");
    }, []);

    // when reference store variable is set or changes, set loaded true
    useEffect(() => {
        if (referenceStore) {
            if (referenceStore.reference && referenceStore.reference != reference) {
                setReference(referenceStore.reference);
                setReferenceLoaded(true);
            }

            if (referenceStore.page && referenceStore.page != page) {
                setPage(referenceStore.page);
                setPageLoaded(true);
            }
        }
    }, [referenceStore, dispatch]);

    const renderActionHeader = () => {
        if (referenceLoaded) {
            return (<th className="actions-header">Actions</th>)
        }
    }

    const renderColumnHeaders = () => {
        if (referenceLoaded) {
            return reference.columns.map((column, index) => {
                // how to add conditional class/tooltip
                // ng-class="{'chaise-icon-for-tooltip': col.column.comment}"
                var columnName = column.displayname.value;
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
                    {renderActionHeader()}
                    {renderColumnHeaders()}
                </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
        </table>
    </div>);
}

export default RecordsetTable;
