'use strict';

var React = require('react');
var createReactClass = require('create-react-class');
var axios = require('axios');

module.exports = createReactClass({
  getInitialState: function() {
      return {};
  },

  // fires when the component is attached to the DOM
  componentDidMount: function() {
    // var self = this;
    // var config = {skipRetryBrowserError: true, skipHTTP401Handling: true};
    // ERMrest.configure(axios, Q);
    // ERMrest.onload().then(function () {
    //     ERMrest.appLinkFn(function appTagToURL(tag, location, context) {
    //         var appPath;
    //         if (tag && (tag in appTagMapping)) {
    //             appPath = appTagMapping[tag];
    //         } else {
    //             function getValueFromContext(object, context) {
    //                 var partial = context,
    //                 parts = context.split("/");
    //                 while (partial !== "") {
    //                     if (partial in object) { // found the context
    //                         return object[partial];
    //                     }
    //                     parts.splice(-1,1); // remove the last part
    //                     partial = parts.join("/");
    //                 }
    //                 return object["*"];
    //             }
    //
    //             const appContextMapping = {
    //                 detailed: "/record",
    //                 compact: "/recordset",
    //                 edit: "/recordedit",
    //                 entry: "/recordedit"
    //             }
    //             appContextMapping['*'] = "/record";
    //
    //             appPath = getValueFromContext(appContextMapping, context);
    //         }
    //
    //         var url = "https://dev.isrd.isi.edu/~jchudy/chaise" + appPath + "/#" + location.catalog + "/" + location.path;
    //         var pcontext = [];
    //
    //         // var settingsObj = ConfigUtils.getSettings()
    //         var settingsObj = {};
    //         // var contextHeaderParams = ConfigUtils.getContextHeaderParams();
    //         var contextHeaderParams = {};
    //         pcontext.push("pcid=" + contextHeaderParams.cid);
    //         pcontext.push("ppid=" + contextHeaderParams.pid);
    //         // only add the value to the applink function if it's true
    //         if (settingsObj.hideNavbar) pcontext.push("hideNavbar=" + settingsObj.hideNavbar)
    //
    //         // TODO we might want to allow only certian query parameters
    //         if (location.queryParamsString) {
    //             url = url + "?" + location.queryParamsString;
    //         }
    //         if (pcontext.length > 0) {
    //             url = url + (location.queryParamsString ? "&" : "?") + pcontext.join("&");
    //         }
    //         return url;
    //     });
    //
    //     return ERMrest.resolve("https://dev.isrd.isi.edu/ermrest/catalog/1/entity/isa:dataset", config);
    // }).then(function (reference) {
    //     console.log("resolved reference");
    //
    //     self.setState({
    //         reference: reference.contextualize.compact
    //     });
    //
    //     return self.state.reference.read(25);
    // }).then(function (page) {
    //     console.log("page fetched");
    //
    //     self.setState({
    //         page: page,
    //         tuples: page.tuples,
    //         isLoaded: true
    //     });
    //
    //     console.log("Table state: ", self.state);
    // }).catch(function (err) {
    //     console.log(err)
    // });
  },

  componentDidUpdate: function (prevProps, prevState, snapshot) {
      // console.log("RecordsetTable did update")
      // console.log("prev props: ", prevProps);
      // console.log("prev state: ", prevState);
  },

  renderColumnHeaders: function() {
      if (this.state.isLoaded) {
          return this.state.reference.columns.map((column, index) => {
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
  },

  renderTableData: function() {
      if (this.state.isLoaded) {
          return this.state.tuples.map((tuple, index) => {
             return (<tr key={index}>
                 <td className="action-btns">
                    <div className="chaise-btn-group">
                        <button className="apply-saved-query-button chaise-btn chaise-btn-tertiary chaise-btn-link icon-btn"><span className="chaise-btn-icon glyphicon glyphicon-check"></span></button>
                        <button className="view-action-btn chaise-btn chaise-btn-tertiary chaise-btn-link icon-btn"><span className="chaise-btn-icon chaise-icon chaise-view-details"></span></button>
                        <button className="edit-action-btn chaise-btn chaise-btn-tertiary chaise-btn-link icon-btn"><span className="chaise-btn-icon glyphicon glyphicon-pencil"></span></button>
                        <button className="delete-action-btn chaise-btn chaise-btn-tertiary chaise-btn-link icon-btn"><span className="chaise-btn-icon far fa-trash-alt"></span></button>
                    </div>
                 </td>
                 {this.renderTableCell(tuple)}
               </tr>)
          });
      }
  },

   renderTableCell: function(tuple) {
       if (this.state.isLoaded) {
           return tuple.values.map((value, index) => {
               const isHTML = tuple.isHTML[index];
               return (<td key={index}>
                   {isHTML
                       ? <span className="markdown-container" dangerouslySetInnerHTML={{ __html: value }}></span>
                       : <span>{value}</span>
                   }
                 </td>)
           })
       }
   },

  render: function() {
      return(<div className="outer-table recordset-table">
          <table className="table chaise-table table-striped table-hover">
            <thead className="table-heading">
                <tr>
                    <th className="actions-header">Actions</th>
                    {this.renderColumnHeaders()}
                </tr>
            </thead>
            <tbody>{this.renderTableData()}</tbody>
          </table>
      </div>);
  }
});
