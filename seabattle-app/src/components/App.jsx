import React, {Component} from 'react'
import Field from './Field/'
import './style.css'
import PlaceShips from './PlaceShips'
import StartGame from './StartGame'
import Rules from './Rules'
// import PopupName from './PopupName'
import Ships from './Ships'
import Controller from './Controller'

export default 
class App extends Component {
  state = {
    reverted: false
  }
  
  render() {
    return (
      <div className="wrap">
        <h3 id="text_top" className="text-top">Игра "Морской бой"</h3>
        <div className="field-wrap">
          <Field playerState='user' />
          <Field playerState='pc' />
        </div>        
        
        <div id="control_btns" className="control-btns" data-hidden="false">
          <PlaceShips />
          <StartGame />
        </div>

        <div id="text_btm" className="text-btm"></div>

        <Rules/>
        {/* <PopupName/> */}
        <Ships/>
      </div>
    )
  }
}


let userfield = getId('field_user');
let	compfield = getId('field_comp');
let	comp;

// построим поле игрока
let user = new Field(userfield);


  /////////////////////////////////////////
  

	let player, enemy, self, coords, text,
  srvText = getId('text_btm'),
  tm = 0;

/////////////////////////////////////////


// рандомно расставляем корабли
getId('random').addEventListener('click', function(e) {
	user.cleanField();
	user.randomLocationShips();
});

// создаём объект поля компьютера и расставляем корабли
getId('play').addEventListener('click', function(e) {
	comp = new Field(compfield);
	comp.randomLocationShips();

	// скрываем кнопки расстановки кораблей и запуска игры
	getId('control_btns').setAttribute('data-hidden', true);

	// Запуск игры
	let battle = new Controller();
	battle.init();
});

// спрашиваем имя
getId('popup_submit').addEventListener('click', function(e) {
	let username1 = getId('popup_txt').value;
	if (username1 != 0) getId('username1').innerText = username1;

	getId('popup').setAttribute('data-hidden',true);
});


/////////////////////////////////////////


function getId(id) {
	return document.getElementById(id);
}

function getRandom(n) {
	return Math.floor(Math.random() * (n + 1));
}

function createMatrix() {
	let x = 10, y = 10, arr = [10];
	for (let i = 0; i < x; i++) {
		arr[i] = [10];
		for(let j = 0; j < y; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
}

