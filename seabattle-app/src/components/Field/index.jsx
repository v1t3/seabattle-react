import React, {Component} from 'react'
import './style.css'
import PlaceShips from '../PlaceShips'
import Ships from '../Ships'

export default
class Field extends Component {
	constructor(props) {
    super(props);
		const {user, playerNum, playerName} = this.props;
		
		this.state = {
			user: user,
			playerNum: playerNum,
			playerName: playerName,
			fieldSide: 330,
			shipSide: 33,
			shipsData: ['',
												[4, 'fourdeck'],
												[3, 'tripledeck'],
												[2, 'doubledeck'],
												[1, 'singledeck']
											],
			field: null,
			// fieldX: field.getBoundingClientRect().top + window.pageYOffset,
			// fieldY: field.getBoundingClientRect().left + window.pageXOffset,
			fieldX: window.pageYOffset,
			fieldY: window.pageXOffset,
			fieldRight: this.fieldY + this.fieldSide,
			fieldBtm: this.fieldX + this.fieldSide,
			flot: []
		}
	}

	setUserfield = function(data) {
		// console.log('parent setUserfield=', data);
		
		this.setState({field: data});
		// console.log('new field=', this.state.field);
	}.bind(this);

  
  render() {
    return (
      <div className={'bfield bfield' + this.state.playerNum}>
          <p className={'btext btext' + this.state.playerNum}>
            Игрок {this.state.playerNum}: 
						<span id={'username' + this.state.playerNum}> {this.state.playerName}</span>
          </p>
        <div className="field field-user">
          <div className="top-nums">
            <div className="top-num top-num1">1</div>
            <div className="top-num top-num2">2</div>
            <div className="top-num top-num3">3</div>
            <div className="top-num top-num4">4</div>
            <div className="top-num top-num5">5</div>
            <div className="top-num top-num6">6</div>
            <div className="top-num top-num7">7</div>
            <div className="top-num top-num8">8</div>
            <div className="top-num top-num9">9</div>
            <div className="top-num top-num10">10</div>
          </div>
          <div className="left-nums">
            <div className="left-num left-num1">А</div>
            <div className="left-num left-num2">Б</div>
            <div className="left-num left-num3">В</div>
            <div className="left-num left-num4">Г</div>
            <div className="left-num left-num5">Д</div>
            <div className="left-num left-num6">Е</div>
            <div className="left-num left-num7">Ж</div>
            <div className="left-num left-num8">З</div>
            <div className="left-num left-num9">И</div>
            <div className="left-num left-num10">К</div>
          </div>
          <div id={'field_user' + this.state.playerNum} className="ships"></div>
        </div>
				
			<PlaceShips state={this.state} setUserfield={this.setUserfield} />

      <Ships />
      </div>
			
    )
  }
}
