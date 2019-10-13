// import React, {Component} from 'react'
// import App from './App'

// export default 
// class Rules extends Component {
// 	constructor(props) {
// 		super(props);
		
// 		const {player, fieldCoord} = this.props;

// 		// на каком поле создаётся данный корабль
// 		this.player = player;
// 		// уникальное имя корабля
// 		this.shipname = fieldCoord.shipname;
// 		//количество палуб
// 		this.decks = fieldCoord.decks;
// 		// координата X первой палубы
// 		this.x0 = fieldCoord.x;
// 		// координата Y первой палубы
// 		this.y0 = fieldCoord.y;
// 		// направлении расположения палуб
// 		this.dir = fieldCoord.dir;
// 		// счётчик попаданий
// 		this.hits = 0;
// 		// массив с координатами палуб корабля
// 		this.matrix = [];
// 	}
		
// 	createShip = function() {
// 		let k = 0,
// 				x = this.x0,
// 				y = this.y0,
// 				dir = this.dir,
// 				decks	= this.decks,
// 				player = this.player

// 		// количество циклов будет равно количеству палуб создаваемого корабля
// 		while (k < decks) {
// 			// записываем координаты корабля в матрицу игрового поля
// 			player.matrix[x + k * dir][y + k * !dir] = 1;
// 			// записываем координаты корабля в матрицу экземпляра корабля
// 			this.matrix.push([x + k * dir, y + k * !dir]);
// 			k++;
// 		}

// 		// заносим информацию о созданном корабле в массив флот
// 		player.flot.push(this);
// 		// если корабль создан для игрока, выводим его на экран
// 		if (player == user1) this.showShip();
// 		// когда созданы все корабли (10 шт), показываем кнопку запуска игры
// 		if (user1.flot.length == 10) {
// 			document.getElementById('play').setAttribute('data-hidden', 'false');
// 		}
// 	}

// 	showShip = function() {
// 		let div = document.createElement('div'),
// 				dir_v = (this.dir == 1) ? ' vertical' : '',
// 				classname	= this.shipname.slice(0, -1),
// 				player = this.player;

// 		div.setAttribute('id', this.shipname);
// 		div.className = 'ship ' + classname + dir_v;
// 		// задаём позиционирование кораблю
// 		div.style.cssText = `left: ${this.y0 * player.shipSide}px; 
// 													top: ${this.x0 * player.shipSide}px;`;
// 		player.field.appendChild(div);
// 	}

//   render() {
//     return (
//       <div id="ships_collection" className="ships-collection">
//         <div id="fourdeck1" className="ship fourdeck"></div>
//         <div id="tripledeck1" className="ship tripledeck tripledeck1"></div>
//         <div id="tripledeck2" className="ship tripledeck tripledeck2"></div>
//         <div id="doubledeck1" className="ship doubledeck"></div>
//         <div id="doubledeck2" className="ship doubledeck doubledeck2"></div>
//         <div id="doubledeck3" className="ship doubledeck doubledeck3"></div>
//         <div id="singledeck1" className="ship singledeck"></div>
//         <div id="singledeck2" className="ship singledeck singledeck2"></div>
//         <div id="singledeck3" className="ship singledeck singledeck3"></div>
//         <div id="singledeck4" className="ship singledeck singledeck4"></div>
//       </div>
//     )
//   }
// }