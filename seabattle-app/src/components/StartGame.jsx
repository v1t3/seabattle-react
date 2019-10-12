import React, {Component} from 'react'

export default class StartGame extends Component {
  
	hendlerClick = () => {
		console.log('clicked StartGame')
	}
  
  render() {
    return (
      <div id="control_btns" className="control-btns" data-hidden="false">
        <span id="play" 
              className="btn-play" 
              data-hidden="false" 
              onClick={this.hendlerClick}
        >
          Играть
        </span>
      </div>
    )
  }
}