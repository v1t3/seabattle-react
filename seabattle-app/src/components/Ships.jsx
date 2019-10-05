import React, {Component} from 'react'

export default class Rules extends Component {
  render() {
    return (
      <div id="ships_collection" className="ships-collection">
        <div id="fourdeck1" className="ship fourdeck"></div>
        <div id="tripledeck1" className="ship tripledeck tripledeck1"></div>
        <div id="tripledeck2" className="ship tripledeck tripledeck2"></div>
        <div id="doubledeck1" className="ship doubledeck"></div>
        <div id="doubledeck2" className="ship doubledeck doubledeck2"></div>
        <div id="doubledeck3" className="ship doubledeck doubledeck3"></div>
        <div id="singledeck1" className="ship singledeck"></div>
        <div id="singledeck2" className="ship singledeck singledeck2"></div>
        <div id="singledeck3" className="ship singledeck singledeck3"></div>
        <div id="singledeck4" className="ship singledeck singledeck4"></div>
      </div>
    )
  }
}