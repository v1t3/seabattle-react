import React, {Component} from 'react'
import Controller from './Controller'

export default class StartGame extends Component {
  state = {
  }

	playClick = () => {
    try {
      console.log('StartGame');
      
      // создаём объект поля компьютера и расставляем корабли
      
      //// user2 = new Field(userfield2);
      // user2.randomLocationShips();
    
      // // скрываем кнопки расстановки кораблей и запуска игры

      // let controlBtns = document.querySelectorAll('.control-btns');
      // for (let btn of controlBtns) {
      //   btn.setAttribute('data-hidden', true);
      // }
    
      // Запуск игры
      // let battle = new Controller({
      //   matrixUser1: this.props.matrixUser1,
      //   matrixUser2: this.props.matrixUser2,
      //   fieldSize: this.props.fieldSize,
      //   shipSize: this.props.shipSize,
      //   fieldXUser2: this.props.fieldXUser2,
      //   fieldYUser2: this.props.fieldYUser2
      // });
      // battle.init();
      this.props.setStart();
    } catch(err) {
      console.error(err);
    }
  }
  

  render() {
		// console.log('StartGame this.props',  this.props);
    const {start, gameStarted, 
            matrixUser1, flotUser1, 
            matrixUser2, fieldXUser2, fieldYUser2, flotUser2, 
            fieldSize, shipSize, 
            setAppState, setGameStarted} = this.props;
    
    return (
      <div className="control-btns" data-hidden="false">
        <span id="play" className="btn-play" data-hidden="true" onClick={this.playClick}>Играть</span>

        <Controller matrixUser1={matrixUser1}
                    matrixUser2={matrixUser2}
                    fieldXUser2={fieldXUser2}
                    fieldYUser2={fieldYUser2}
                    flotUser1={flotUser1}
                    flotUser2={flotUser2}
                    fieldSize={fieldSize}
                    shipSize={shipSize}
                    start={start}
                    gameStarted={gameStarted}
                    setAppState={setAppState}
                    setGameStarted={setGameStarted} />
      </div>
    )
  }
}
