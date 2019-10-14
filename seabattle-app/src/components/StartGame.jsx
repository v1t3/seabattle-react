import React, {Component} from 'react'

export default class StartGame extends Component {
  
	playClick = () => {
    console.log('clicked StartGame')
    
    // // создаём объект поля компьютера и расставляем корабли
    // document.getElementById('play').addEventListener('click', function(e) {
    //   user2 = new Field(userfield2);
    //   user2.randomLocationShips();
    
    //   // скрываем кнопки расстановки кораблей и запуска игры
    //   document.getElementById('control_btns').setAttribute('data-hidden', true);
    
    //   // Запуск игры
    //   let battle = new Controller();
    //   battle.init();
    // });
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