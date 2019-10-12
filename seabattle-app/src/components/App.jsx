import React, {Component} from 'react'
import './style.css'
import Field from './Field/'
// import PlaceShips from './PlaceShips'
// import StartGame from './StartGame'
// import Rules from './Rules'
// import Ships from './Ships'

export default 
class App extends Component {
  state = {
    user1: null,
    user2: null
  }

  getId(id) {
    return document.getElementById(id);
  }

  getRandom(n) {
    return Math.floor(Math.random() * (n + 1));
  }

  createMatrix() {
    let x = 10, y = 10, arr = [10];
    for (let i = 0; i < x; i++) {
      arr[i] = [10];
      for(let j = 0; j < y; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }

  // randomClick() {
  //   // // рандомно расставляем корабли
  //   // getId('random').addEventListener('click', function(e) {
  //   //   user1.cleanField();
  //   //   user1.randomLocationShips();
  //   // });
  // }

  // playClick() {
  //   // // создаём объект поля компьютера и расставляем корабли
  //   // App.getId('play').addEventListener('click', function(e) {
  //   //   user2 = new Field(userfield2);
  //   //   user2.randomLocationShips();
    
  //   //   // скрываем кнопки расстановки кораблей и запуска игры
  //   //   App.getId('control_btns').setAttribute('data-hidden', true);
    
  //   //   // Запуск игры
  //   //   let battle = new Controller();
  //   //   battle.init();
  //   // });
  // }

  // popupClick() {
  //   // // спрашиваем имя
  //   // App.getId('popup_submit').addEventListener('click', function(e) {
  //   //   let username1 = App.getId('popup_txt').value;
  //   //   if (username1 != 0) App.getId('username1').innerText = username1;
    
  //   //   App.getId('popup').setAttribute('data-hidden',true);
  //   // });    
  // }
  
  render() {
    return (
      <div className="wrap">
        <h3 id="text_top" className="text-top">Игра "Морской бой"</h3>
        <div className="field-wrap">
          <Field playerState='user' />
          <Field playerState='pc' />
        </div>        
        
        <div id="control_btns" className="control-btns" data-hidden="false">
          {/* <PlaceShips /> */}
          <span className="link-random" id="random" data-target="random" data-hidden="false">Расставить корабли</span>
          {/* <StartGame /> */}
          <span id="play" className="btn-play" data-hidden="true">Играть</span>
        </div>

        <div id="text_btm" className="text-btm"></div>

        {/* <Rules/> */}
        {/* <PopupName/> */}
        {/* <Ships/> */}
      </div>
    )
  }
}

