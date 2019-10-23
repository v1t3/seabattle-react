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
      //   fieldSide: this.props.fieldSide,
      //   shipSide: this.props.shipSide,
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
    return (
      <div className="control-btns" data-hidden="false">
        <span id="play" className="btn-play" data-hidden="true" onClick={this.playClick}>Играть</span>

        <Controller matrixUser1={this.props.matrixUser1}
                    matrixUser2={this.props.matrixUser2}
                    fieldSide={this.props.fieldSide}
                    shipSide={this.props.shipSide}
                    fieldXUser2={this.props.fieldXUser2}
                    fieldYUser2={this.props.fieldYUser2}
                    start={this.props.start} />
      </div>
    )
  }
}
