import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import store from './redux/store';

import Recordset from './components/Recordset';
import Record from './components/Record';
import Recordedit from './components/Recordedit';

const App = (props) => {
    var [isLoaded, setIsLoaded]         = useState(false);
    var [appState, setAppState]         = useState("Recordset");

    const dispatch = useDispatch();
    // gets the named reducer from the store, see redux/store
    const referenceStore = useSelector(state => state.reference);

    // component mounted, fetch the initial reference and read the data
    useEffect(() => {
        var self = this;
        var config = {skipRetryBrowserError: true, skipHTTP401Handling: true};
        ERMrest.configure(Axios, Q);
        ERMrest.onload().then(function () {
            ERMrest.appLinkFn(function appTagToURL(tag, location, context) {
                var appPath;
                if (tag && (tag in appTagMapping)) {
                    appPath = appTagMapping[tag];
                } else {
                    function getValueFromContext(object, context) {
                        var partial = context,
                        parts = context.split("/");
                        while (partial !== "") {
                            if (partial in object) { // found the context
                                return object[partial];
                            }
                            parts.splice(-1,1); // remove the last part
                            partial = parts.join("/");
                        }
                        return object["*"];
                    }

                    const appContextMapping = {
                        detailed: "/record",
                        compact: "/recordset",
                        edit: "/recordedit",
                        entry: "/recordedit"
                    }
                    appContextMapping['*'] = "/record";

                    appPath = getValueFromContext(appContextMapping, context);
                }

                var url = "https://dev.isrd.isi.edu/~jchudy/chaise" + appPath + "/#" + location.catalog + "/" + location.path;
                var pcontext = [];

                // var settingsObj = ConfigUtils.getSettings()
                var settingsObj = {};
                // var contextHeaderParams = ConfigUtils.getContextHeaderParams();
                var contextHeaderParams = {};
                pcontext.push("pcid=" + contextHeaderParams.cid);
                pcontext.push("ppid=" + contextHeaderParams.pid);
                // only add the value to the applink function if it's true
                if (settingsObj.hideNavbar) pcontext.push("hideNavbar=" + settingsObj.hideNavbar)

                // TODO we might want to allow only certian query parameters
                if (location.queryParamsString) {
                    url = url + "?" + location.queryParamsString;
                }
                if (pcontext.length > 0) {
                    url = url + (location.queryParamsString ? "&" : "?") + pcontext.join("&");
                }
                return url;
            });

            return ERMrest.resolve("https://dev.isrd.isi.edu/ermrest/catalog/1/entity/isa:dataset", config);
        }).then(function (resolvedReference) {
            let ref = resolvedReference.contextualize.compact;
            // dispatch to reducer.name + / + reducer.action (reference/setReference)
            store.dispatch({ type: "reference/setReference", resolvedReference: ref });

            setIsLoaded(true);
        }).catch(function (err) {
            console.log(err)
        });
    }, []);

    // appState has changed
    useEffect(() => {
        if (referenceStore && referenceStore.appState != appState) {
            setIsLoaded(false);
            let appName = referenceStore.appState;
            ERMrest.resolve("https://dev.isrd.isi.edu/ermrest/catalog/1/entity/" + referenceStore.referencePath).then(function (resolvedReference) {
                setAppState(appName);

                let ref;
                if (appName == "Record") {
                    ref = resolvedReference.contextualize.detailed;
                } else if (appName == "Recordedit") {
                    ref = resolvedReference.contextualize.entryCreate;
                } else {
                    ref = resolvedReference.contextualize.compact;
                }

                store.dispatch({ type: "reference/setReference", resolvedReference: ref });

                setIsLoaded(true);
            }).catch(function (err) {
                console.log(err)
            });
        }
    }, [referenceStore, dispatch])

    const renderApp = () => {
        if (isLoaded) {
            if (appState == "Record") {
                return (<Record />)
            } else if (appState == "Recordedit") {
                return (<div id="recordedit"><Recordedit /></div>)
            } else {
                return (<Recordset />)
            }
        }
    }

    return(<div>
        {renderApp()}
    </div>);
}

export default App;
