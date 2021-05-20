'use strict';

var React = require('react');
var Axios = require('axios');
var ReactRedux = require('react-redux');
var createReactClass = require('create-react-class');

var refSlice = require('../redux/features/referenceSlice');
// var TableHeader = require('./TableHeader');
// var RecordsetTable = require('./RecordsetTable');

console.log("react obj: ", React);
console.log("reactRedux obj: ", ReactRedux);

console.log("refSlice: ", refSlice);
console.log("refReducer: ", refSlice.reducer);
console.log("actions: ", refSlice.actions);


module.exports = createReactClass({
  getInitialState: function() {
    return {};
  },

  // getReference: ReactRedux.useSelector(refSlice.actions.selectReference),
  // setReference: ReactRedux.useDispatch(refSlice.actions.setReference),

  // fires when the component is attached to the DOM
  componentDidMount: function() {
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
    }).then(function (reference) {
        console.log(self)
        // self.setReference();

        self.setState({
            reference: reference.contextualize.compact
        });

        return self.state.reference.read(25);
    }).then(function (page) {

        self.setState({
            page: page,
            tuples: page.tuples,
            isLoaded: true
        });

        console.log("Table state: ", self.state);
    }).catch(function (err) {
        console.log(err)
    });
  },

  componentDidUpdate: function (prevProps, prevState, snapshot) {
      // console.log("Recordset did update")
      // console.log("prev props: ", prevProps);
      // console.log("prev state: ", prevState);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
      console.log("recordset next props: ", nextProps)
      console.log("recordset next state: ", nextState)
      var referenceChanged = this.state.reference != nextState.reference
      var pageChanged = this.state.page != nextState.page
      console.log("reference change: ", referenceChanged);
      console.log("page change: ", pageChanged);
      return referenceChanged || pageChanged
  },

  renderDisplayName: function() {
      if (this.state.isLoaded) {
          var displaynameObj = this.state.reference.displayname;
          return (<h2>
              {displaynameObj.isHTML
                  ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: displaynameObj.value }}></span>
                  : <span>{displaynameObj.value}</span>
              }
            </h2>)
      }
  },

  render: function() {
      // <TableHeader style={{margin: "10px 0"}} reference={this.state.reference} />
      // <RecordsetTable className="recordset-table-container" />
      return(<div>
          {this.renderDisplayName()}
      </div>);
  }
});
