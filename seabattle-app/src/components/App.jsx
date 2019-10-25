import React, {Component} from 'react'
import './fonts/SegoePrint/fonts.css'
import './style.css'
import Field from './Field/'
import StartGame from './StartGame'
import Rules from './Rules'
import PopupName from './PopupName'

export default class App extends Component {
  state = {
    start: false,
    gameStarted: false,
    fieldSize: 330,
    shipSize: 33,
    user1name: "user1",
    user1id: "1",
    user1playerName: "Юзер",
    user1matrix: null,
    user1fieldX: null,
    user1fieldY: null,
    user1fieldRight: null,
    user1fieldBtm: null,
    user1flot: [],
    user2name: "user2",
    user2id: "2",
    user2playerName: "Комп",
    user2matrix: null,
    user2fieldX: null,
    user2fieldY: null,
    user2fieldRight: null,
    user2fieldBtm: null,
    user2flot: []
  }
  
  // флаги запуска игры
  setStart = function() {
    try {
      if (this.state.start === false) this.setState({start: true});
    } catch(err) {
      console.error(err);
    }
  }.bind(this);

  setGameStarted = function() {
    try {
      if (this.state.gameStarted === false) this.setState({gameStarted: true});
    } catch(err) {
      console.error(err);
    }
  }.bind(this);
  
	setAppState = function(username, param, data) {
    try {
      let userState = username + param;

      this.setState({
        [userState]: data
      });
    } catch(err) {
      console.error(err);
    }
  }.bind(this);

	setUserPos = function(username, fieldX, fieldY, fieldRight, fieldBtm) {
    try {
      if (username === 'user2') {
        this.setState({
          user2fieldX: fieldX,
          user2fieldY: fieldY,
          user2fieldRight: fieldRight,
          user2fieldBtm: fieldBtm
        });
      }
    } catch(err) {
      console.error(err);
    }
  }.bind(this);

  render() {
    // console.log('this.state', this.state);
    const {start, gameStarted,
            user1name, user1id, user1playerName, user1matrix, user1flot,
            user2name, user2id, user2playerName, user2matrix, user2fieldX, user2fieldY, user2flot,
            fieldSize, shipSize} = this.state;

    return (
      <div className="wrap">
        <h3 id="text_top" className="text-top">Игра "Морской бой"</h3>
        <div className="field-wrap">
          <Field  user={user1name} 
                  playerNum={user1id} 
                  playerName={user1playerName} 
                  flot={user1flot}
                  fieldSize={fieldSize}
                  shipSize={shipSize}
                  setAppState={this.setAppState}
                  setUserPos={this.setUserPos} />

          <Field  user={user2name} 
                  playerNum={user2id} 
                  playerName={user2playerName} 
                  flot={user2flot}
                  fieldSize={fieldSize}
                  shipSize={shipSize}
                  setAppState={this.setAppState}
                  setUserPos={this.setUserPos}
                  start={start}
                  gameStarted={gameStarted} />
        </div>
        
        <StartGame  matrixUser1={user1matrix} 
                    matrixUser2={user2matrix}
                    fieldXUser2={user2fieldX}
                    fieldYUser2={user2fieldY}
                    flotUser1={user1flot}
                    flotUser2={user2flot}
                    fieldSize={fieldSize}
                    shipSize={shipSize}
                    start={start}
                    gameStarted={gameStarted}
                    setStart={this.setStart}
                    setGameStarted={this.setGameStarted}
                    setAppState={this.setAppState} />

        <div id="text_btm" className="text-btm"></div>

        <Rules/>
        <PopupName setAppState={this.setAppState} />
      </div>
    )
  }
  
}
