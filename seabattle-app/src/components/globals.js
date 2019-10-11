import App from './App'

let	user2;
let userfield2 = App.getId('field_user2');

// построим поле игрока
let userfield1 = App.getId('field_user1');
let user1 = new Field(userfield1);


let player, enemy, self, coords, text,
    srvText = App.getId('text_btm'),
    tm = 0;


// рандомно расставляем корабли
App.getId('random').addEventListener('click', function(e) {
	user1.cleanField();
	user1.randomLocationShips();
});

// создаём объект поля компьютера и расставляем корабли
App.getId('play').addEventListener('click', function(e) {
	user2 = new Field(userfield2);
	user2.randomLocationShips();

	// скрываем кнопки расстановки кораблей и запуска игры
	App.getId('control_btns').setAttribute('data-hidden', true);

	// Запуск игры
	let battle = new Controller();
	battle.init();
});

// спрашиваем имя
App.getId('popup_submit').addEventListener('click', function(e) {
	let username1 = App.getId('popup_txt').value;
	if (username1 != 0) App.getId('username1').innerText = username1;

	App.getId('popup').setAttribute('data-hidden',true);
});
