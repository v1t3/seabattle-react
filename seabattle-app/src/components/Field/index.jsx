import React, {Component} from 'react'
import './style.css'
import PlaceShips from '../PlaceShips'

export default class Field extends Component {
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
			fieldX: window.pageYOffset,
			fieldY: window.pageXOffset,
			fieldRight: this.fieldY + this.fieldSide,
			fieldBtm: this.fieldX + this.fieldSide,
      randomId: 'random' + playerNum,
			flot: []
		}
	}

	setUserfield = function() {
    try {
      let userfield = document.getElementById(this.state.randomId)
                      .parentElement
                      .parentElement
                      .querySelector('.ships');

      this.setState({field: userfield});
    } catch(err) {
      console.error(err);
    }
	}.bind(this);

  componentDidMount() {
    try {      
      this.setUserfield();
    } catch(err) {
      console.error(err);
    }      
  }
  
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
          
        <PlaceShips user={this.state.user}
                    playerNum={this.state.playerNum}
                    shipSide={this.state.shipSide}
                    shipsData={this.state.shipsData}
                    field={this.state.field}
                    randomId={this.state.randomId}
                    flot={this.state.flot}
                    setUserfield={this.setUserfield}
        />
      </div>
			
    )
  }
}
