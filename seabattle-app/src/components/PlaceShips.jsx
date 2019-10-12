import React, {Component} from 'react'

export default class PlaceShips extends Component {
  
	hendlerClick = () => {
		console.log('clicked PlaceShips')
	}
  
  render() {
    return (
      <div id="control_btns" className="control-btns" data-hidden="false">
        <span className="link-random" 
              id="random" 
              data-target="random" 
              data-hidden="false"
              onClick={this.hendlerClick}  //должно обращаться к Field
        >
          Расставить корабли
        </span>
      </div>
    )
  }
}