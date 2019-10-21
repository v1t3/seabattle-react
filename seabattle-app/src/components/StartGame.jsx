import React, {Component} from 'react'
import Controller from './Controller'

export default class StartGame extends Component {
  state = {
		curPlayer: null,
    curEnemy: null,
    compShootMatrix: [],
    compShootMatrixAI: [],
    compShootMatrixAround: [],
    compStartPoints: [
			[ [6,0], [2,0], [0,2], [0,6] ], 
			[ [3,0], [7,0], [9,2], [9,6] ]
		]
  }
    
	setCurPlayer = (data) => {		
    console.log('data setCurPlayer=', data);
    
		this.setState({curPlayer: data});
	}

	playClick = () => {
    console.log('StartGame');

    console.log('this.state.curPlayer=', this.state.curPlayer);
    
    // создаём объект поля компьютера и расставляем корабли
    document.getElementById('play').addEventListener('click', function(e) {
      // user2 = new Field(userfield2);
      // user2.randomLocationShips();
    
      // скрываем кнопки расстановки кораблей и запуска игры
      document.getElementById('control_btns').setAttribute('data-hidden', true);
    
      // Запуск игры
      let battle = new Controller({
        setCurPlayer: this.setCurPlayer
      });
      battle.init();

    });
  }
  

  render() {
    return (
      <div id="control_btns" className="control-btns" data-hidden="false">
        <span id="play" 
              className="btn-play" 
              data-hidden="true" 
              onClick={this.playClick}
        >
          Играть
        </span>
        
      </div>
    )
  }
}
