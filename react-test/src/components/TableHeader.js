'use strict';

var React = require('react');
var createReactClass = require('create-react-class');
var axios = require('axios');

module.exports = createReactClass({
  getInitialState: function() {
    return {
        pageLimits: [10, 25, 50, 75, 100, 200],
        selectedPageLimit: 25
    };
  },

  // fires when the component is attached to the DOM
  componentDidMount: function() {
      // console.log("header mounted props: ", this.props)
  },

  shouldComponentUpdate: function (nextProps, nextState) {
      // console.log("TableHeader should update")
      // console.log("next props: ", nextProps);
      // console.log("next state: ", nextState);

      var referenceChanged = this.state.reference != nextProps.reference;
      return referenceChanged;
  },

  componentWillReceiveProps: function(nextProps) {
      console.log("header will receive props nextProps: ", nextProps)

      var self = this;
      if (this.props.reference != nextProps.reference) {
          nextProps.reference.getAggregates([nextProps.reference.aggregate.countAgg]).then(function (aggCount) {
              console.log("aggreggate count: ", aggCount);

              self.setState({
                  isLoaded: true,
                  aggCount: aggCount[0]
              });
          });
      }
  },

  renderCountHeader: function() {
      if (this.state.isLoaded) {
          // console.log("render count header: ", this.state)
          return (this.state.aggCount)
      }
  },

  renderPageLimits: function() {
      // <span className={"glyphicon pull-right " + this.state.selectedPageLimit === limit ? 'glyphicon-ok' : 'glyphicon-invisible'}></span>
      return this.state.pageLimits.map((limit, index) => {
          return (<option key={index} className={"page-size-limit-${limit}"}>{limit}</option>)
      })
  },

  handlePageLimitChange: function(value) {
      console.log(value)
  },

  render: function() {
      // TODO: replace select
      // <span className="caret"></span>
      return(<div>
          <span>Displaying first <select className="page-size-dropdown chaise-btn chaise-btn-secondary" value={this.state.selectedPageLimit} onChange={event => this.handlePageLimitChange(event.target.value)}>
            {this.renderPageLimits()}
          </select> of {this.renderCountHeader()} records</span>
      </div>);
  }
});
