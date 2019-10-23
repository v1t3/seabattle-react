import React from 'react'
// import PlaceShips from './PlaceShips'

export default class Controller extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curPlayer: null,
			curEnemy: null,
			coords: null,
			compShootMatrix: [],
			compShootMatrixAI: [],
			compShootMatrixAround: [],
			compStartPoints: [
				[ [6,0], [2,0], [0,2], [0,6] ], 
				[ [3,0], [7,0], [9,2], [9,6] ]
			],
			compTempShip: {
				totalHits: 0,
				firstHit: {},
				nextHit: {},
				dirx: 0,
				diry: 0
			}
		}
		
		console.log('Controller')
	}
	
	init = function() {
		try {
			console.log('init');
			// console.log('Controller state 1=', this.state);
			// console.log('Controller props', this.props);

			let self = this;

			// рандомно определяем кто будет стрелять первым
			let rnd = this.getRandom(1);
			// console.log('rnd=', rnd);
			
			let userNum = (rnd === 0) ? 'user1' : 'user2';
			// this.setState({curPlayer: userNum}); //Can't call setState on a component that is not yet mounted		
			this.state.curPlayer = userNum;

			// чей выстрел следующий
			let enemyNum = (this.state.curPlayer === 'user1') ? 'user2' : 'user1';
			this.state.curEnemy = enemyNum;
			
			// console.log('this.state 2=', this.state);

			// меняем на this.state.comp*

			// // массив с координатами выстрелов при рандомном выборе
			// shootMatrix = [];
			// // массив с координатами выстрелов для AI (компьютер стреляет случайно не по всему полю, 
			// // а только по диагоналям)
			// shootMatrixAI = [];
			// // массив с координатами вокруг клетки с попаданием
			// shootMatrixAround = [];
			// // массив координат начала циклов
			// startPoints = [
			// 	[ [6,0], [2,0], [0,2], [0,6] ],
			// 	[ [3,0], [7,0], [9,2], [9,6] ]
			// ];

			self.resetTempShip();
			self.setShootMatrix();

      let userfield2 = document.querySelector('#field_user2');
											
			// если первым стреляет человек
			if (this.state.curPlayer === 'user1') {
				userfield2.addEventListener('click', function(e) {
					// console.log('userfield2 clicked');
					self.shoot(e);
				});
				self.showServiseText('Вы стреляете первым.');
			} else {
				self.showServiseText('Первым стреляет компьютер.');
				// вызываем функцию выстрела компа
				setTimeout( () => self.shoot(), 1000);
			}
    } catch(err) {
      console.error(err);
    }
	}

	// обработка выстрела
	shoot = function(e) {
    console.log('shoot');
    // console.log('shoot e', e);
    
		let self = this;
		let matrixEnemy, coords, text;

		// e !== undefined - значит выстрел производит игрок
		if (e !== undefined) {
			// преобразуем координаты выстрела (положения курсора) в координаты матрицы
			coords = self.transformCoordinates(e, this.state.curEnemy);

			matrixEnemy = this.props.matrixUser2;
		} else {
			// получаем координаты для выстрела компьютера
			coords = self.getCoordinatesShot();

			matrixEnemy = this.props.matrixUser1;
		}

		// console.log('shoot  this.props',  this.props);
		// console.log('shoot  coords',  coords);
		// console.log('shoot  matrixEnemy',  matrixEnemy);
		
		// // значение матрицы по полученным координатам
		let val = matrixEnemy[coords.x][coords.y];

		switch(val) {
			// промах
			case 0:
				console.log('промах');
				// ставим точку и записываем промах в матрицу
				self.showIcons(this.state.curEnemy, coords, 'dot');
				// enemy.matrix[coords.x][coords.y] = 3;

				text = (this.state.curPlayer === 'user1') ? 'Вы промахнулись. Стреляет компьютер.' : 'Компьютер промахнулся. Ваш выстрел.';
				self.showServiseText(text);

				// // меняем местами стреляющего и врага
				// player = (player === user1) ? user2 : user1;
				// enemy = (player === user1) ? user2 : user1;

				// if (player == user2) {
				// 	userfield2.removeEventListener('click', self.shoot);

				// 	if (user2.shootMatrixAround.length == 0) {
				// 		self.resetTempShip();
				// 	}

				// 	setTimeout(function() {
				// 		return self.shoot();
				// 	}, 1000);
				// } else {
				// 	userfield2.addEventListener('click', self.shoot);
				// }
				break;

			// попадание
			case 1:
				console.log('попадание');
		// 		enemy.matrix[coords.x][coords.y] = 4;
				self.showIcons(this.state.curEnemy, coords, 'red-cross');
				text = (this.state.curPlayer === 'user1') ? 'Поздравляем! Вы попали. Ваш выстрел.' : 'Компьютер попал в ваш корабль. Выстрел компьютера';
				self.showServiseText(text);

		// 		for (let i = enemy.flot.length - 1; i >= 0; i--) {
		// 			let warship = enemy.flot[i], 
		// 					arrayDescks = warship.matrix;

		// 			for (let j = 0, length = arrayDescks.length; j < length; j++) {
		// 				if (arrayDescks[j][0] == coords.x && arrayDescks[j][1] == coords.y) {
		// 					warship.hits++;

		// 					if (warship.hits == warship.decks) {
		// 						if (player === user2) {
		// 							user2.tempShip.x0 = warship.x0;
		// 							user2.tempShip.y0 = warship.y0;
		// 						}
		// 						enemy.flot.splice(i, 1);
		// 					}
		// 					break;
		// 				}
		// 			}
		// 		}

		// 		if (enemy.flot.length == 0) {
		// 			text = (player === user1) ? 'Поздравляем! Вы выиграли.' : 'К сожалению, вы проиграли.';
		// 			srvText.innerHTML = text + ' <a id="one_more_time" href="#" onClick="window.location.reload()">Ещё раз!</a>';

		// 			if (player == user1) {
		// 				userfield2.removeEventListener('click', self.shoot);
		// 			} else {
		// 				for (let i = 0, length = user2.flot.length; i < length; i++) {
		// 					let div = document.createElement('div'),
		// 							dir_v = (user2.flot[i].dir == 1) ? ' vertical' : '',
		// 							classname	= user2.flot[i].shipname.slice(0, -1);

		// 					div.className = 'ship ' + classname + dir_v;
		// 					div.style.cssText = `left: ${user2.flot[i].y0 * user2.shipSide}px; 
		// 																top: ${user2.flot[i].x0 * user2.shipSide}px;`;
		// 					user2.field.appendChild(div);
		// 				}
		// 			}
		// 		// бой продолжается
		// 		} else {
		// 			if (player === user2) {
		// 				user2.tempShip.totalHits++;
		// 				let points	= [
		// 					[coords.x - 1, coords.y - 1],
		// 					[coords.x - 1, coords.y + 1],
		// 					[coords.x + 1, coords.y - 1],
		// 					[coords.x + 1, coords.y + 1]
		// 				];
		// 				self.markEmptyCell(points);

		// 				let max = self.checkMaxDecks();

		// 				if (user2.tempShip.totalHits >= max) {
		// 					if (user2.tempShip.totalHits == 1) {
		// 						points = [
		// 							[user2.tempShip.x0 - 1, user2.tempShip.y0],
		// 							[user2.tempShip.x0 + 1, user2.tempShip.y0],
		// 							[user2.tempShip.x0, user2.tempShip.y0 - 1],
		// 							[user2.tempShip.x0, user2.tempShip.y0 + 1],
		// 						];
		// 					} else {
		// 						let x1 = user2.tempShip.x0 - user2.tempShip.dirx,
		// 								y1 = user2.tempShip.y0 - user2.tempShip.diry,
		// 								x2 = user2.tempShip.x0 + user2.tempShip.dirx * user2.tempShip.totalHits,
		// 								y2 = user2.tempShip.y0 + user2.tempShip.diry * user2.tempShip.totalHits;
										
		// 						points = [
		// 							[x1, y1],
		// 							[x2, y2]
		// 						];
		// 					}
		// 					self.resetTempShip();
		// 				} else {
		// 					self.setShootMatrixAround();
		// 				}

		// 				setTimeout(function() {
		// 					return self.shoot();
		// 				}, 1000);
		// 			}
		// 		}
				break;

			default:
				// do nothing
		}
	}

	showIcons = function(enemy, coords, iconClass) {
		console.log('showIcons');
		let field = (enemy === 'user1') ? document.querySelector('#field_user1') : document.querySelector('#field_user2');
    
		let div = document.createElement('div');
		div.className = 'icon-field ' + iconClass;
		div.style.cssText = `left: ${coords.y * this.props.shipSide}px; top: ${coords.x * this.props.shipSide}px;`;
		field.appendChild(div);
	}

	setShootMatrix = function() {
    console.log('setShootMatrix');
    
		for (let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				this.state.compShootMatrix.push([i, j]);
			}
		}

		for (let i = 0, length = this.state.compStartPoints.length; i < length; i++) {
			let arr = this.state.compStartPoints[i];
			for (let j = 0, lh = arr.length; j < lh; j++) {
				let x = arr[j][0],
						y = arr[j][1];

				switch(i) {
					case 0:
						while(x <= 9 && y <= 9) {
							this.state.compShootMatrixAI.push([x,y]);
							x = (x <= 9) ? x : 9;
							y = (y <= 9) ? y : 9;
							x++; y++;
						};
						break;

					case 1:
						while(x >= 0 && x <= 9 && y <= 9) {
							this.state.compShootMatrixAI.push([x,y]);
							x = (x >= 0 && x <= 9) ? x : (x < 0) ? 0 : 9;
							y = (y <= 9) ? y : 9;
							x--; y++;
						};
						break;

					default:
						// do nothing
				}
			}
		}

		function compareRandom(a, b) {
			return Math.random() - 0.5;
		}
		this.state.compShootMatrix.sort(compareRandom);
		this.state.compShootMatrixAI.sort(compareRandom);
		return;
	}

	getCoordinatesShot = function() {
    console.log('getCoordinatesShot');
    
			let self = this;

		if (this.state.compShootMatrixAround.length > 0) {
			this.state.coords = this.state.compShootMatrixAround.pop();
		} else if (this.state.compShootMatrixAI.length > 0) {
			this.state.coords = this.state.compShootMatrixAI.pop();
		} else {
			this.state.coords = this.state.compShootMatrix.pop();
		}

		let obj = {
			x: this.state.coords[0],
			y: this.state.coords[1]
		};

		if (this.state.compShootMatrixAI.length !== 0) {
			self.deleteElementMatrix(this.state.compShootMatrixAI, obj);
		}
		self.deleteElementMatrix(this.state.compShootMatrix, obj);

		return obj;
	}

	setShootMatrixAround = function() {
    console.log('setShootMatrixAround');
    
		// if (user2.tempShip.dirx == 0 && user2.tempShip.diry == 0) {
		// 	if (Object.keys(user2.tempShip.firstHit).length === 0) {
		// 		user2.tempShip.firstHit = coords;
		// 	} else {
		// 		user2.tempShip.nextHit = coords;
		// 		user2.tempShip.dirx = (Math.abs(user2.tempShip.firstHit.x - user2.tempShip.nextHit.x) == 1) ? 1 : 0;
		// 		user2.tempShip.diry = (Math.abs(user2.tempShip.firstHit.y - user2.tempShip.nextHit.y) == 1) ? 1 : 0;
		// 	}
		// }

		// // корабль расположен вертикально
		// if (coords.x > 0 && user2.tempShip.diry == 0) user2.shootMatrixAround.push([coords.x - 1, coords.y]);
		// if (coords.x < 9 && user2.tempShip.diry == 0) user2.shootMatrixAround.push([coords.x + 1, coords.y]);
		// // корабль расположен горизонтально
		// if (coords.y > 0 && user2.tempShip.dirx == 0) user2.shootMatrixAround.push([coords.x, coords.y - 1]);
		// if (coords.y < 9 && user2.tempShip.dirx == 0) user2.shootMatrixAround.push([coords.x, coords.y + 1]);

		// // необходимо проверить их валидность
		// // координата валидна, если значение массива не равно или 2 (гарантированно пустая клетка), 
		// // или 3 (промах), или 4 (попадание)
		// for (let i = user2.shootMatrixAround.length - 1; i >= 0; i--) {
		// 	// координаты возможного выстрела
		// 	let x = user2.shootMatrixAround[i][0],
		// 			y = user2.shootMatrixAround[i][1];
			
		// 	if (user1.matrix[x][y] !== 0 && user1.matrix[x][y] !== 1) {
		// 		user2.shootMatrixAround.splice(i,1);
		// 		self.deleteElementMatrix(user2.shootMatrix, coords);
		// 	}
		// }
		// if (user2.shootMatrixAround.length == 0) {
		// 	// корабль потоплен, сбрасываем свойства объекта tempShip
		// 	self.resetTempShip();
		// }

		// return;
	}

	deleteElementMatrix = function(array, obj) {
    console.log('deleteElementMatrix');
    
		for (let i = 0, lh = array.length; i < lh; i++) {
			// удаляем ячейку с координатой выстрела
			if (array[i][0] === obj.x && array[i][1] === obj.y) {
				array.splice(i, 1);
				break;
			}
		}
	}

	resetTempShip = function() {
    console.log('resetTempShip');
    
		// обнуляем массив с координатами обстрела клеток вокруг попадания
		this.state.compShootMatrixAround = [];
		this.state.compTempShip = {
			// количество попаданий в корабль
			totalHits: 0,
			// объекты для хранения координат первого и второго попадания
			firstHit: {},
			nextHit: {},
			// значения для вычисления координат обстрела "раненого" корабля
			dirx: 0,
			diry: 0
		};
		// console.log('this.state resetTempShip=', this.state);
	}

	checkMaxDecks = function() {
    console.log('checkMaxDecks');
    
		// let arr = [];
		// for (let i = 0, length = user1.flot.length; i < length; i++) {
		// 	// записываем в массив кол-во палуб у оставшихся кораблей
		// 	arr.push(user1.flot[i].decks);
		// }
		// // возвращаем max значение
		// return Math.max.apply(null, arr);
	}

	markEmptyCell = function(points) {
    console.log('markEmptyCell');
    
		// let obj;

		// // перебираем массив с координатами
		// for (let i = 0, lh = points.length ; i < lh ; i++) {
		// 	obj = {
		// 		x: points[i][0],
		// 		y: points[i][1]
		// 	};
		// 	// если true хотя бы одно из условий, значит координата находится
		// 	// за пределами игрового поля
		// 	if (obj.x < 0 || obj.x > 9 || obj.y < 0 || obj.y > 9) continue;

		// 	// в этом месте уже стоит отметка
		// 	if (user1.matrix[obj.x][obj.y] != 0) continue;

		// 	// записываем в двумерный массив игрового поля игрока по данным координатам
		// 	// значение '2', соотвествующее пустой клетке
		// 	user1.matrix[obj.x][obj.y] = 2;

		// 	// удаляем из массивов выстрелов данные координаты, чтобы исключить в дальнейшем их обстрел
		// 	self.deleteElementMatrix(user2.shootMatrix, obj);
		// 	if (user2.shootMatrixAround.length != 0) {
		// 		self.deleteElementMatrix(user2.shootMatrixAround, obj);
		// 	}
		// 	if (user2.shootMatrixAI.length != 0) {
		// 		self.deleteElementMatrix(user2.shootMatrixAI, obj);
		// 	}
		// 	self.deleteElementMatrix(user2.shootMatrix, obj);
		// }
	}

	transformCoordinates = function(e, instance) {
		try {
			console.log('transformCoordinates');
			// console.log('transformCoordinates e', e);
			
			// создадим объект, в который запишем полученные координаты матрицы
			let obj = {};
			// let userfield2 = document.querySelector('#field_user2');

			// вычисляем ячейку двумерного массива, которая соответствует координатам выстрела
			obj.x = Math.trunc((e.pageY - this.props.fieldXUser2) / this.props.shipSide);
			obj.y = Math.trunc((e.pageX - this.props.fieldYUser2) / this.props.shipSide);
			return obj;
		} catch(err) {
			console.error(err);
		}
	}

	// вывод сообщений в ходе игры
	showServiseText = function(text) {
    // console.log(`showServiseText '${text}'`);
		let srvText = document.getElementById('text_btm');
		
		srvText.innerHTML = text;
		// setTimeout("srvText.innerHTML = ''", 1000);
	}
	
	getRandom(n) {
		return Math.floor(Math.random() * (n + 1));
	}
	
	componentDidUpdate() {
		// console.log('Controller DidUpdate')
		if (this.props.start === true) {
			this.init();
		}
	}
	
	render() {
		// заглушка
   return <></>;
	}
}
