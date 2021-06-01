import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';

const Recordedit = (props) => {
    const [isLoaded, setIsLoaded]   = useState(false);
    const [reference, setReference] = useState(null);
    const [formModel, setFormModel] = useState({});

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted, fetch the initial reference and read the data
    useEffect(() => {
        console.log("Recordedit mounted");
        setReference(referenceStore.reference);
        setIsLoaded(true);
    }, []);

    const handleSubmitClick = () => {
        // required is checked by disabling/enabling submit button
        console.log("submit clicked");
        console.log(formModel);
        // validate

        let data = {}
        reference.columns.forEach((column, index) => {
            data[column.name] = formModel[column.displayname.value] || null
        });

        // NOTE: data should be an array, being lazy since create is only 1 row right now
        reference.create([data]).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err)
        });
    }

    const submitDisabled = () => {
        let canSubmit = true;
        reference.columns.forEach((column) => {
            // check if any required values are unset
            if (isRequired(column) && (formModel[column.displayname.value] == null || formModel[column.displayname.value] == undefined)) {
                canSubmit = false;
            }
        });

        return !canSubmit;
    }

    const renderDisplayName = () => {
        if (isLoaded) {
            var displaynameObj = reference.displayname;
            let createStr = "Create new ";
            return (<div className="title-container">
                <div class="title-buttons">
                    <button id="submit-record-button" class="chaise-btn chaise-btn-primary" type="submit" onClick={handleSubmitClick} disabled={submitDisabled()}>
                            <span class="chaise-btn-icon glyphicon glyphicon-saved"></span>
                            <span>Save</span>
                    </button>
                </div>
                <h1>{createStr}
                    <a href="https://dev.isrd.isi.edu/~jchudy/build/">
                        {displaynameObj.isHTML
                            ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: displaynameObj.value }}></span>
                            : <span>{displaynameObj.value}</span>
                        }
                    </a>
                </h1>
            </div>)
        }
    }

    const isRequired = (column) => {
        let isDisabled = column.isDisabled ? true : false;
        return !column.nullok && !isDisabled
    }

    const renderIsRequired = (column) => {
        if (isRequired(column)) {
            return (<span className="text-danger"><b>*</b> </span>)
        }
    }

    const renderOptionalChoice = (column) => {
        if (!isRequired(column)) {
            return (<option selected></option>)
        }
    }

    const renderTrueChoice = (column) => {
        if (isRequired(column)) {
            // if required set default to true (and set value on model)
            formModel[column.displayname.value] = true;
            return (<option selected>true</option>)
        } else {
            return (<option>true</option>)
        }
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setFormModel(formModel => ({
            ...formModel,
            [name]: value
        }));
    }

    const renderInputType = (column, type) => {
        let inputName = column.displayname.value,
            input;

        switch (type.name) {
            // number type inputs
            case 'int2':
            case 'int4':
            case 'int8':
            case 'float4':
            case 'float8':
            case 'numeric':
                input = <input type="number" name={inputName} className="chaise-input-control" onChange={handleInputChange} />
                break;
            // boolean dropdown
            case 'boolean':
                isRequired(column)
                // let boolVal = ((formModel[inputName] == true || formModel[inputName] == false) ? formModel[inputName] : defaultVal)
                input = <select className="page-size-dropdown chaise-btn chaise-btn-secondary" name={inputName} value={formModel[inputName]} onChange={handleInputChange}>
                    {renderOptionalChoice(column)}
                    {renderTrueChoice(column)}
                    <option>false</option>
                </select>
                break;
            // treat date, timestamp, timestamptz the same as text
            case 'date':
            case 'timestamp':
            case 'timestamptz':
            case 'text':
                input = <input type="text" name={inputName} className="chaise-input-control" onChange={handleInputChange} />
                break;
            default:
                input = (type.baseType) ? renderInputType(column, type.baseType) : <input type="text" name={inputName} className="chaise-input-control" onChange={handleInputChange} />;
                break;
        }

        return (input);
    }

    const renderForm = () => {
        if (isLoaded) {
            return reference.columns.map((column, index) => {
                let columnDisplaynameObj = column.displayname;
                return (<tbody key={index}>
                    <tr className="shift-form">
                        <td className="entity-key" width="200" height="47">
                            {renderIsRequired(column)}
                            <span className="column-displayname">
                                {columnDisplaynameObj.isHTML
                                    ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: columnDisplaynameObj.value }}></span>
                                    : <span>{columnDisplaynameObj.value}</span>
                                }
                            </span>
                        </td>
                        <td className="entity-value">
                            {renderInputType(column, column.type)}
                        </td>
                    </tr>
                </tbody>)
            });
        }
    }

    return(<div className="app-container">
        {renderDisplayName()}
        <span><span class="text-danger"><b>*</b></span> indicates required field</span>
        <div className="main-body">
            <div id="form-section">
                <div id="form-edit" className="createMode">
                    <table className="table">
                        <tbody>
                            <tr className="shift-form">
                                <td className="entity-key" width="200" height="47">Record Number</td>
                                <td class="form-header entity-value">
                                    <div class="pull-left">1</div>
                                </td>
                            </tr>
                        </tbody>
                        {renderForm()}
                    </table>
                </div>
            </div>
        </div>
    </div>);
}

export default Recordedit;
