import React, {Component} from 'react'
import './style.css'
import Field from './Field/'
import StartGame from './StartGame'
// import Rules from './Rules'
// import PopupName from './PopupName'

export default class App extends Component {
  state = {
    start: false,
    user1: {
      name: "user1",
      id: "1",
      playerName: "Юзер",
      matrix: null,
      fieldX: null,
      fieldY: null,
      fieldRight: null,
      fieldBtm: null
    },
    user2: {
      name: "user2",
      id: "2",
      playerName: "Комп",
      matrix: null,
      fieldX: null,
      fieldY: null,
      fieldRight: null,
      fieldBtm: null
    },
    fieldSide: 330,
    shipSide: 33
  }
  
  setStart = function() {
    try {
      console.log('setStart');

      if (this.state.start === false) this.setState({start: true});
    } catch(err) {
      console.error(err);
    }
  }.bind(this);
  
	setUserMatrix = function(username, data) {
    try {
      console.log('setUserMatrix');

      if (username === 'user1') {
        this.setState({
          user1: {
            name: this.state.user1.name,
            id: this.state.user1.id,
            playerName: this.state.user1.playerName,
            matrix: data,
            fieldX: this.state.user1.fieldX,
            fieldY: this.state.user1.fieldY,
            fieldRight: this.state.user1.fieldRight,
            fieldBtm: this.state.user1.fieldBtm
          }
        });
      } else {
        this.setState({
          user2: {
            name: this.state.user2.name,
            id: this.state.user2.id,
            playerName: this.state.user2.playerName,
            matrix: data,
            fieldX: this.state.user2.fieldX,
            fieldY: this.state.user2.fieldY,
            fieldRight: this.state.user2.fieldRight,
            fieldBtm: this.state.user2.fieldBtm
          }
        });
      }
    } catch(err) {
      console.error(err);
    }
  }.bind(this);

	setUserPos = function(username, fieldX, fieldY, fieldRight, fieldBtm) {
    try {
      console.log('setUserPos');

      if (username === 'user2') {
        this.setState({
          user2: {
            name: this.state.user2.name,
            id: this.state.user2.id,
            playerName: this.state.user2.playerName,
            matrix: this.state.user2.matrix,
            fieldX: fieldX,
            fieldY: fieldY,
            fieldRight: fieldRight,
            fieldBtm: fieldBtm
          }
        });
      }
    } catch(err) {
      console.error(err);
    }
  }.bind(this);

  render() {
    console.log('App state=', this.state);
    const {user1, user2, fieldSide, shipSide} = this.state;

    return (
      <div className="wrap">
        <h3 id="text_top" className="text-top">Игра "Морской бой"</h3>
        <div className="field-wrap">
          <Field  user={user1.name} 
                  playerNum={user1.id} 
                  playerName={user1.playerName} 
                  fieldSide={fieldSide}
                  shipSide={shipSide}
                  setUserMatrix={this.setUserMatrix}
                  setUserPos={this.setUserPos} />

          <Field  user={user2.name} 
                  playerNum={user2.id} 
                  playerName={user2.playerName} 
                  fieldSide={fieldSide}
                  shipSide={shipSide}
                  setUserMatrix={this.setUserMatrix}
                  setUserPos={this.setUserPos}
                  start={this.state.start} />
        </div>
        
        <StartGame  matrixUser1={user1.matrix} 
                    matrixUser2={user2.matrix}
                    fieldSide={fieldSide}
                    shipSide={shipSide}
                    fieldXUser2={user2.fieldX}
                    fieldYUser2={user2.fieldY}
                    start={this.state.start}
                    setStart={this.setStart} />

        <div id="text_btm" className="text-btm"></div>

        {/* <Rules/> */}
        {/* <PopupName/> */}
      </div>
    )
  }
  
}
