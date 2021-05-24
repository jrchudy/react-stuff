import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

import RecordsetTable from './RecordsetTable';

const Record = (props) => {
    const [isLoaded, setIsLoaded]   = useState(false);
    const [reference, setReference] = useState(null);
    const [page, setPage]           = useState(null);
    const [tuple, setTuple]         = useState(null);

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted, fetch the initial reference and read the data
    useEffect(() => {
        console.log("Record mounted");
    }, []);

    // reference updated from store
    useEffect(() => {
        if (referenceStore && (referenceStore.reference != reference)) {
            setIsLoaded(false);

            let refToRead = referenceStore.reference;
            setReference(refToRead);

            refToRead.read(1).then(function (newPage) {

                setPage(newPage);
                store.dispatch({ type: "reference/setPage", refPage: newPage });

                setTuple(newPage.tuples[0]);
                console.log(newPage.tuples[0])

                refToRead.related.map((relatedRef, index) => {
                    store.dispatch({ type: "reference/initializeRefIndex", refIndex: index, reference: relatedRef.contextualize.compactBrief, noFaceting: true });
                });

                setIsLoaded(true);
            }).catch(function (err) {
                console.log(err)
            });
        }
    }, [referenceStore, dispatch]);

    const renderDisplayName = () => {
        if (isLoaded) {
            var displaynameObj = tuple.displayname;
            return (<h2>
                {displaynameObj.isHTML
                    ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: displaynameObj.value }}></span>
                    : <span>{displaynameObj.value}</span>
                }
            </h2>)
        }
    }

    const renderRelatedDisplayName = (reference) => {
        var displaynameObj = reference.displayname;
        return (<h3>
            {displaynameObj.isHTML
                ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: displaynameObj.value }}></span>
                : <span>{displaynameObj.value}</span>
            }
        </h3>)
    }

    const renderMainRecord = () => {
        if (isLoaded) {
            return reference.columns.map((column, index) => {
                let columnName = column.displayname.value;
                let tupleVal = tuple.values[index];
                return (<tr key={index}>
                    <td className="entity-key">
                        {column.displayname.isHTML
                            ? <span dangerouslySetInnerHTML={{ __html: columnName }}></span>
                            : <span>{columnName}</span>
                        }
                    </td>
                    <td className="entity-value">
                        {tuple.isHTML[index]
                            ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: tupleVal }}></span>
                            : <span>{tupleVal}</span>
                        }
                    </td>
                </tr>)
            });
        }
    }

    const renderRelatedTables = () => {
        if (isLoaded) {
            return reference.related.map((relatedRef, index) => {
                let contextualizedReference = relatedRef.contextualize.compactBrief;
                return (<div key={index}>
                    {renderRelatedDisplayName(contextualizedReference)}
                    <RecordsetTable tableModel={{reference: contextualizedReference, refIndex: index, noFaceting: true}} />
                </div>)
            });
        }
    }

    return(<div>
        {renderDisplayName()}
        <div classnName="main-body">
            <table className="table table-fixed-layout">
                <tbody>
                    {renderMainRecord()}
                </tbody>
            </table>
            <div id="rt-container">
                {renderRelatedTables()}
            </div>
        </div>
    </div>);
}

export default Record;
