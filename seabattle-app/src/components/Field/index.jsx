import React, {Component} from 'react'
import './style.css'
import PlaceShips from '../PlaceShips'

export default class Field extends Component {
	constructor(props) {
    super(props);
		const {user, playerNum, playerName, fieldSize, shipSize} = this.props;
		
		this.state = {
			user: user,
			playerNum: playerNum,
			playerName: playerName,
			fieldSize: fieldSize,
			shipSize: shipSize,
			shipsData: ['',
												[4, 'fourdeck'],
												[3, 'tripledeck'],
												[2, 'doubledeck'],
												[1, 'singledeck']
											],
			field: null,
			fieldX: null,
			fieldY: null,
			fieldRight: null,
			fieldBtm: null,
			// flot: []
		}
	}

	setUserfield = function() {
    try {
      let userfield = document.querySelector('#field_user' + this.state.playerNum);
      
      this.setState({field: userfield});
    } catch(err) {
      console.error(err);
    }
  }.bind(this);
  
  async componentDidMount() {
    try {
      // await console.log('componentDidMount');

      await this.setUserfield();

      await this.setState({
        fieldX: this.state.field.getBoundingClientRect().top + window.pageYOffset,
        fieldY: this.state.field.getBoundingClientRect().left + window.pageXOffset
      });

      await this.setState({
        fieldRight: this.state.fieldY + this.state.fieldSize,
        fieldBtm: this.state.fieldX + this.state.fieldSize
      });
      
      // await console.log('await', this.state);

      await this.props.setUserPos(
        'user2',
        this.state.fieldX,
        this.state.fieldY,
        this.state.fieldRight,
        this.state.fieldBtm
      );

    } catch(err) {
      console.error(err);
    }      
  }
  
  render() {
    // console.log('field state', this.state);
    const {user, playerNum, playerName, shipSize, shipsData, field} = this.state;

    return (
      <div className={'bfield bfield' + playerNum}>
          <p className={'btext btext' + playerNum}>
            Игрок {playerNum}: 
						<span id={'username' + playerNum}> {playerName}</span>
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
          <div id={'field_user' + playerNum} className="ships"></div>
        </div>
          
        <PlaceShips user={user}
                    playerNum={playerNum}
                    shipSize={shipSize}
                    shipsData={shipsData}
                    field={field}
                    flot={this.props.flot}
                    setUserfield={this.setUserfield}
                    setAppState={this.props.setAppState}
                    start={this.props.start}
                    gameStarted={this.props.gameStarted} />
      </div>
			
    )
  }
}
