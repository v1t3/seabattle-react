import React from 'react'

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
		
		// console.log('Controller')
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
			let userNum = (rnd === 0) ? 'user1' : 'user2';
			await this.setState({curPlayer: userNum});
			// console.log('curPlayer=', this.state.curPlayer);

			// чей выстрел следующий
			let enemyNum = (this.state.curPlayer === 'user1') ? 'user2' : 'user1';
			await this.setState({curEnemy: enemyNum});
			// console.log('curEnemy=', this.state.curEnemy);
			
			self.resetTempShip();
			self.setShootMatrix();

      let userfield2 = document.querySelector('#field_user2');
			userfield2.addEventListener('click', self.shoot.bind(this) );

			// если первым стреляет человек
			if (this.state.curPlayer === 'user1') {
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
	async shoot(e) {
    console.log('');
    console.log('shoot');
		console.log('shoot this.state 1=', this.state);
		// console.log('this.state.coords', this.state.coords);
		
		// console.log('curPlayer 1', this.state.curPlayer);
		// console.log('curEnemy 1', this.state.curEnemy);
		    
		let matrixEnemy, coords, text, flotEnemy;
		let userfield2 = document.querySelector('#field_user2');

		// e !== undefined - значит выстрел производит игрок
		if (e !== undefined) {
			if (this.state.curPlayer === 'user2') return;
			if (this.state.flotUser1.length === 0 || this.state.flotUser2.length === 0)	return;

			// преобразуем координаты выстрела (положения курсора) в координаты матрицы
			// coords = self.transformCoordinates(e, this.state.curEnemy);
			coords = self.transformCoordinates(e);

			matrixEnemy = this.state.matrixUser2;
			flotEnemy = this.state.flotUser2;
		} else {
			// получаем координаты для выстрела компьютера
			coords = self.getCoordinatesShot();
			// console.log('coords', coords);

			matrixEnemy = this.state.matrixUser1;
			flotEnemy = this.state.flotUser1;
		}
		
		// значение матрицы по полученным координатам
		let val = matrixEnemy[coords.x][coords.y];

		switch(val) {
			// промах
			case 0:
				console.log('промах');
				// ставим точку и записываем промах в матрицу
				self.showIcons(this.state.curEnemy, coords, 'dot');
				matrixEnemy[coords.x][coords.y] = 3;

				text = (this.state.curPlayer === 'user1') ? 'Вы промахнулись. Стреляет компьютер.' : 'Компьютер промахнулся. Ваш выстрел.';
				self.showServiseText(text);

				// // меняем местами стреляющего и врага
				let curPlayerName = (this.state.curPlayer === 'user1') ? 'user2' : 'user1';
				let curEnemyName = (this.state.curEnemy === 'user1') ? 'user2' : 'user1';
				await this.setState({
					curPlayer: curPlayerName,
					curEnemy: curEnemyName
				})
				// console.log('curPlayer 20', this.state.curPlayer);
				// console.log('curEnemy 20', this.state.curEnemy);

				if (this.state.curPlayer === 'user2') {
					if (this.state.compShootMatrixAround.length === 0) {
						self.resetTempShip();
					}

					setTimeout(() => {
						return self.shoot();
					}, 1000);
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
				
				if (flotEnemy.length === 0) {
					// конец игры
					console.log('конец игры');
					
					text = (this.state.curPlayer === 'user1') ? 'Поздравляем! Вы выиграли.' : 'К сожалению, вы проиграли.';
					
					// заменить на смену состояния и очистку поля
					self.showServiseText(text + ' <a id="one_more_time" href="#" onClick="window.location.reload()">Ещё раз!</a>');

					userfield2.removeEventListener('click', self.shoot.bind(this) );

					// вставить переключение состояния отображения кораблей компа
					// 
					// 

				} else {
					// бой продолжается
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
						// console.log('max', max);
						// console.log('this.state.compTempShip.totalHits', this.state.compTempShip.totalHits);

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
		// console.log('curPlayer 3', this.state.curPlayer);
		// console.log('curEnemy 3', this.state.curEnemy);
		// console.log('this.state.coords', this.state.coords);
		// console.log('coords', coords);
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
		if (this.state.compShootMatrixAround.length > 0) {
			// this.state.coords = this.state.compShootMatrixAround.pop();
			let coordsState = this.state.compShootMatrixAround.pop();
			this.setState({coords: coordsState});
		} else if (this.state.compShootMatrixAI.length > 0) {
			// this.state.coords = this.state.compShootMatrixAI.pop();
			let coordsState = this.state.compShootMatrixAI.pop();
			this.setState({coords: coordsState});
		} else {
			// this.state.coords = this.state.compShootMatrix.pop();
			let coordsState = this.state.compShootMatrix.pop();
			this.setState({coords: coordsState});
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

	setShootMatrixAround() {
		console.log('setShootMatrixAround');
		const {compTempShip, coords, compShootMatrixAround, compShootMatrix, matrixUser1} = this.state;
		// console.log('compTempShip.firstHit', compTempShip.firstHit);
		// console.log('compTempShip.nextHit', compTempShip.nextHit);
		// console.log('compTempShip.dirx', compTempShip.dirx);
		// console.log('compTempShip.diry', compTempShip.diry);
		// console.log('this.state.coords 2', this.state.coords);
		// console.log('coords 2', coords);
		// console.log('compShootMatrixAround', compShootMatrixAround);
		
		// тут coords.x - coords[0], coords.y - coords[1]
		if (compTempShip.dirx === 0 && compTempShip.diry === 0) {
			if (Object.keys(compTempShip.firstHit).length === 0) {
				let tempShipFirstHit = coords;
				this.setState((prevState) => prevState.compTempShip.firstHit = tempShipFirstHit);
			} else {
				let tempShipNextHit, tempShipDirx, tempShipDiry;
				tempShipNextHit = coords;
				tempShipDirx = (Math.abs(compTempShip.firstHit[0] - compTempShip.nextHit[0]) === 1) ? 1 : 0;
				tempShipDiry = (Math.abs(compTempShip.firstHit[1] - compTempShip.nextHit[1]) === 1) ? 1 : 0;
				
				this.setState((prevState) => prevState.compTempShip.nextHit = tempShipNextHit);
				this.setState((prevState) => prevState.compTempShip.dirx = tempShipDirx);
				this.setState((prevState) => prevState.compTempShip.diry = tempShipDiry);
			}
		}
		// console.log('compTempShip.firstHit 2', compTempShip.firstHit);
		// console.log('compTempShip.nextHit 2', compTempShip.nextHit);
		// console.log('compTempShip.dirx 2', compTempShip.dirx);
		// console.log('compTempShip.diry 2', compTempShip.diry);

		// корабль расположен вертикально
		if (coords[0] > 0 && compTempShip.diry === 0) this.state.compShootMatrixAround.push([coords[0] - 1, coords[1]]);
		if (coords[0] < 9 && compTempShip.diry === 0) this.state.compShootMatrixAround.push([coords[0] + 1, coords[1]]);
		// корабль расположен горизонтально
		if (coords[1] > 0 && compTempShip.dirx === 0) this.state.compShootMatrixAround.push([coords[0], coords[1] - 1]);
		if (coords[1] < 9 && compTempShip.dirx === 0) this.state.compShootMatrixAround.push([coords[0], coords[1] + 1]);

		// необходимо проверить их валидность
		// координата валидна, если значение массива не равно или 2 (гарантированно пустая клетка), 
		// или 3 (промах), или 4 (попадание)
		for (let i = compShootMatrixAround.length - 1; i >= 0; i--) {
			// координаты возможного выстрела
			let x = compShootMatrixAround[i][0],
					y = compShootMatrixAround[i][1];
			
			if (matrixUser1[x][y] !== 0 && matrixUser1[x][y] !== 1) {
				compShootMatrixAround.splice(i,1);
				self.deleteElementMatrix(compShootMatrix, coords);
			}
		}
		if (compShootMatrixAround.length === 0) {
			// корабль потоплен, сбрасываем свойства объекта tempShip
			self.resetTempShip();
		}
		
		// console.log('compTempShip', compTempShip);
		// console.log('compShootMatrixAround', compShootMatrixAround);
		// console.log('compShootMatrix', compShootMatrix);

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
		// this.state.compShootMatrixAround = [];
		// this.state.compTempShip = {
		// 	// количество попаданий в корабль
		// 	totalHits: 0,
		// 	// объекты для хранения координат первого и второго попадания
		// 	firstHit: {},
		// 	nextHit: {},
		// 	// значения для вычисления координат обстрела "раненого" корабля
		// 	dirx: 0,
		// 	diry: 0
		// };
		this.setState({compShootMatrixAround: []});
		this.setState((prevState) => prevState.compTempShip.totalHits = 0 );
		this.setState((prevState) => prevState.compTempShip.firstHit = {} );
		this.setState((prevState) => prevState.compTempShip.nextHit = {} );
		this.setState((prevState) => prevState.compTempShip.dirx = 0 );
		this.setState((prevState) => prevState.compTempShip.diry = 0 );

		// console.log('this.state resetTempShip=', this.state);
	}

	checkMaxDecks = function() {
    console.log('checkMaxDecks');
    // console.log('flotUser1', this.state.flotUser1);
    
		let arr = [];
		for (let i = 0, length = this.state.flotUser1.length; i < length; i++) {
			// записываем в массив кол-во палуб у оставшихся кораблей
			arr.push(this.state.flotUser1[i].state.decks);
		}
		// возвращаем max значение
		return Math.max.apply(null, arr);
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

	transformCoordinates = function(e) {
		try {
			// console.log('transformCoordinates');
			let obj = {};

			// вычисляем ячейку двумерного массива, которая соответствует координатам выстрела
			obj.x = Math.trunc((e.pageY - this.props.fieldXUser2) / this.props.shipSize);
			obj.y = Math.trunc((e.pageX - this.props.fieldYUser2) / this.props.shipSize);
			return obj;
		} catch(err) {
			console.error(err);
		}
	}

	showServiseText = function(text) {
		let srvText = document.getElementById('text_btm');
		srvText.innerHTML = text;
		// setTimeout("srvText.innerHTML = ''", 1000);
	}
	
	getRandom(n) {
		return Math.floor(Math.random() * (n + 1));
	}
	
	componentDidUpdate(prevProps) {
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
