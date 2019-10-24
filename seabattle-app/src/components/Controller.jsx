import React from 'react'
// import PlaceShips from './PlaceShips'

let self = this;

export default class Controller extends React.Component {
	constructor(props) {
		super(props);
		const {matrixUser1, matrixUser2, flotUser1, flotUser2} = this.props;

		this.state = {
			matrixUser1: matrixUser1,
			matrixUser2: matrixUser2,
			flotUser1: flotUser1,
			flotUser2: flotUser2,
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

		// this.init = this.init.bind(this);
		// this.shoot = this.shoot.bind(this);
		
		console.log('Controller')
	}
	
	async init() {
		try {
			console.log('init');
			// console.log('init state 1=', this.state);
			// console.log('init props', this.props);
			this.props.setGameStarted();

			self = this;

			// рандомно определяем кто будет стрелять первым
			let rnd = this.getRandom(1);
			console.log('rnd=', rnd);
			
			let userNum = (rnd === 0) ? 'user1' : 'user2';
			await this.setState({curPlayer: userNum});	
			// this.state.curPlayer = userNum;
			// console.log('curPlayer=', this.state.curPlayer);

			// чей выстрел следующий
			let enemyNum = (this.state.curPlayer === 'user1') ? 'user2' : 'user1';
			await this.setState({curEnemy: enemyNum});
			// this.state.curEnemy = enemyNum;
			// console.log('curEnemy=', this.state.curEnemy);
			
			self.resetTempShip();
			self.setShootMatrix();

      let userfield2 = document.querySelector('#field_user2');

			// если первым стреляет человек
			if (this.state.curPlayer === 'user1') {
				userfield2.addEventListener('click', function(e) {self.shoot(e) });
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
		
		// console.log('this 1=', this);
		console.log('this.state 1=', this.state);
		// console.log('this.props 1=', this.props);
		// let {matrixUser1, matrixUser2, flotUser1, flotUser2, shipSize} = this.props;
		
		// console.log('curPlayer 1=', this.state.curPlayer);
		// console.log('curEnemy 1=', this.state.curEnemy);
    
		// let self = this;
		let matrixEnemy, coords, text, flotEnemy;
		let userfield2 = document.querySelector('#field_user2');

		// e !== undefined - значит выстрел производит игрок
		if (e !== undefined) {
			// преобразуем координаты выстрела (положения курсора) в координаты матрицы
			coords = self.transformCoordinates(e, this.state.curEnemy);

			matrixEnemy = this.state.matrixUser2;
			flotEnemy = this.state.flotUser2;
		} else {
			// получаем координаты для выстрела компьютера
			coords = self.getCoordinatesShot();

			matrixEnemy = this.state.matrixUser1;
			flotEnemy = this.state.flotUser1;
		}

		// console.log('shoot this.state',  this.state);
		// console.log('shoot coords',  coords);
		// console.log('shoot curEnemy', this.state.curEnemy);
		// console.log('shoot matrixEnemy', matrixEnemy);
		// console.log('shoot flotEnemy', flotEnemy);
		
		// // значение матрицы по полученным координатам
		let val = matrixEnemy[coords.x][coords.y];

		switch(val) {
			// промах
			case 0:
				console.log('промах');
				// ставим точку и записываем промах в матрицу
				self.showIcons(this.state.curEnemy, coords, 'dot');

				matrixEnemy[coords.x][coords.y] = 3;
				// запись в state App данные по матрице поля
				// this.props.setAppState(this.state.curEnemy, 'matrix', matrixEnemy);


				text = (this.state.curPlayer === 'user1') ? 'Вы промахнулись. Стреляет компьютер.' : 'Компьютер промахнулся. Ваш выстрел.';
				self.showServiseText(text);

				// // меняем местами стреляющего и врага
				this.state.curPlayer = (this.state.curPlayer === 'user1') ? 'user2' : 'user1';
				this.state.curEnemy = (this.state.curPlayer === 'user1') ? 'user2' : 'user1';

				// console.log('curPlayer 20=', this.state.curPlayer);
				// console.log('curEnemy 20=', this.state.curEnemy);

				if (this.state.curPlayer === 'user2') {
					userfield2.removeEventListener('click', function(e) {self.shoot(e)} );

					if (this.state.compShootMatrixAround.length === 0) {
						self.resetTempShip();
					}

					setTimeout(() => {
						return self.shoot();
					}, 1000);
				} else {
					userfield2.addEventListener('click', function(e) {self.shoot(e)} );
				}
				break;

			// попадание
			case 1:
				console.log('попадание');

				self.showIcons(this.state.curEnemy, coords, 'red-cross');
				matrixEnemy[coords.x][coords.y] = 4;

				// this.props.setAppState(this.state.curEnemy, 'matrix', matrixEnemy);

				text = (this.state.curPlayer === 'user1') ? 'Поздравляем! Вы попали. Ваш выстрел.' : 'Компьютер попал в ваш корабль. Выстрел компьютера';
				self.showServiseText(text);
				
				for (let i = flotEnemy.length - 1; i >= 0; i--) {
					let warship = flotEnemy[i], 
							arrayDescks = warship.state.shipMatrix;
							// console.log(`warship`, warship);
							// console.log(`arrayDescks`, arrayDescks);

					for (let j = 0, length = arrayDescks.length; j < length; j++) {
						if (arrayDescks[j][0] === coords.x && arrayDescks[j][1] === coords.y) {
							warship.state.hits++;

							if (warship.state.hits === warship.state.decks) {
								if (this.state.curPlayer === 'user2') {
									this.state.compTempShip.x0 = warship.state.x;
									this.state.compTempShip.y0 = warship.state.y;
								}

								flotEnemy.splice(i, 1);
							}
							break;
						}
					}
				}

				// console.log('curEnemy', this.state.curEnemy);
				// console.log('flotEnemy.length', flotEnemy.length);
				if (flotEnemy.length === 0) {
					// конец игры
					text = (this.state.curPlayer === 'user1') ? 'Поздравляем! Вы выиграли.' : 'К сожалению, вы проиграли.';
					
					// заменить на смену состояния и очистку поля
					self.showServiseText(text + ' <a id="one_more_time" href="#" onClick="window.location.reload()">Ещё раз!</a>');

					if (this.state.curPlayer === 'user1') {
						userfield2.removeEventListener('click', function(e) {self.shoot(e)});
					} else {
						// вставить переключение состояния отображения кораблей компа
						// 
					}
				// бой продолжается
				} else {
					if (this.state.curPlayer === 'user2') {
						this.state.compTempShip.totalHits++;
						let points	= [
							[coords.x - 1, coords.y - 1],
							[coords.x - 1, coords.y + 1],
							[coords.x + 1, coords.y - 1],
							[coords.x + 1, coords.y + 1]
						];
						self.markEmptyCell(points);

						let max = self.checkMaxDecks();

						if (this.state.compTempShip.totalHits >= max) {
							if (this.state.compTempShip.totalHits === 1) {
								points = [
									[this.state.compTempShip.x0 - 1, this.state.compTempShip.y0],
									[this.state.compTempShip.x0 + 1, this.state.compTempShip.y0],
									[this.state.compTempShip.x0, this.state.compTempShip.y0 - 1],
									[this.state.compTempShip.x0, this.state.compTempShip.y0 + 1],
								];
							} else {
								let x1 = this.state.compTempShip.x0 - this.state.compTempShip.dirx,
										y1 = this.state.compTempShip.y0 - this.state.compTempShip.diry,
										x2 = this.state.compTempShip.x0 + this.state.compTempShip.dirx * this.state.compTempShip.totalHits,
										y2 = this.state.compTempShip.y0 + this.state.compTempShip.diry * this.state.compTempShip.totalHits;
										
								points = [
									[x1, y1],
									[x2, y2]
								];
							}
							self.resetTempShip();
						} else {
							self.setShootMatrixAround();
						}

						setTimeout(function() {
							return self.shoot();
						}, 1000);
					}
				}
				break;

			default:
				// do nothing
		}
		// console.log('curPlayer 3=', this.state.curPlayer);
		// console.log('curEnemy 3=', this.state.curEnemy);
	}

	showIcons = function(enemy, coords, iconClass) {
		// console.log('showIcons');
		let fname = (enemy === 'user1') ? '#field_user1' : '#field_user2';
		let field = document.querySelector(fname);
    
		let div = document.createElement('div');
		div.className = 'icon-field ' + iconClass;
		div.style.cssText = `left: ${coords.y * this.props.shipSize}px; 
													top: ${coords.x * this.props.shipSize}px;`;
		field.appendChild(div);
	}

	setShootMatrix = function() {
    // console.log('setShootMatrix');
    
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
    
			// let self = this;

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
			obj.x = Math.trunc((e.pageY - this.props.fieldXUser2) / this.props.shipSize);
			obj.y = Math.trunc((e.pageX - this.props.fieldYUser2) / this.props.shipSize);
			return obj;
		} catch(err) {
			console.error(err);
		}
	}

	showServiseText = function(text) {
    // console.log(`showServiseText '${text}'`);
		let srvText = document.getElementById('text_btm');
		
		srvText.innerHTML = text;
		// setTimeout("srvText.innerHTML = ''", 1000);
	}
	
	getRandom(n) {
		return Math.floor(Math.random() * (n + 1));
	}
	
	componentDidUpdate(prevProps, prevState) {
		// console.log('Controller DidUpdate')
		if (this.props.start === true && this.props.gameStarted === false) {
			this.init();
		}

		if (this.props.matrixUser1 !== prevProps.matrixUser1) {
			this.setState({matrixUser1: this.props.matrixUser1});
		}
		if (this.props.matrixUser2 !== prevProps.matrixUser2) {
			this.setState({matrixUser2: this.props.matrixUser2});
		}
		if (this.props.flotUser1 !== prevProps.flotUser1) {
			this.setState({flotUser1: this.props.flotUser1});
		}
		if (this.props.flotUser1 !== prevProps.flotUser1) {
			this.setState({flotUser1: this.props.flotUser1});
		}
	}
	
	render() {
		// console.log('Controller this.props',  this.props);
		// console.log('Controller this.state',  this.state);

		// заглушка
   return <></>;
	}
}
