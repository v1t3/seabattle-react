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
	}
	
	async init() {
		try {			
			// кидаем флаг, что игра уже запущена
			this.props.setGameStarted();

			self = this;
			// рандомно определяем кто будет стрелять первым
			let rnd = this.getRandom(1);			
			let userNum = (rnd === 0) ? 'user1' : 'user2';
			await this.setState({curPlayer: userNum});

			let enemyNum = (this.state.curPlayer === 'user1') ? 'user2' : 'user1';
			await this.setState({curEnemy: enemyNum});
			
			self.resetTempShip();
			self.setShootMatrix();

      let userfield2 = document.querySelector('#field_user2');
			userfield2.addEventListener('click', self.shoot.bind(this) );

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
		let matrixEnemy, coords, text, flotEnemy;
		let userfield2 = document.querySelector('#field_user2');

		// e !== undefined - значит выстрел производит игрок
		if (e !== undefined) {
			if (this.state.curPlayer === 'user2') return;
			if (this.state.flotUser1.length === 0 || this.state.flotUser2.length === 0)	return;

			// преобразуем координаты выстрела (положения курсора) в координаты матрицы
			coords = self.transformCoordinates(e);

			matrixEnemy = this.state.matrixUser2;
			flotEnemy = this.state.flotUser2;
		} else {
			// получаем координаты для выстрела компьютера
			coords = self.getCoordinatesShot();

			matrixEnemy = this.state.matrixUser1;
			flotEnemy = this.state.flotUser1;
		}
		
		// значение матрицы по полученным координатам
		let val = matrixEnemy[coords.x][coords.y];

		switch(val) {
			// промах
			case 0:
				// ставим точку и записываем промах в матрицу
				self.showIcons(this.state.curEnemy, coords, 'dot');
				matrixEnemy[coords.x][coords.y] = 3;

				text = (this.state.curPlayer === 'user1') ? 'Вы промахнулись. Стреляет компьютер.' : 'Компьютер промахнулся. Ваш выстрел.';
				self.showServiseText(text);

				let curPlayerName = (this.state.curPlayer === 'user1') ? 'user2' : 'user1';
				let curEnemyName = (this.state.curEnemy === 'user1') ? 'user2' : 'user1';
				await this.setState({
					curPlayer: curPlayerName,
					curEnemy: curEnemyName
				});

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
				self.showIcons(this.state.curEnemy, coords, 'red-cross');
				matrixEnemy[coords.x][coords.y] = 4;

				text = (this.state.curPlayer === 'user1') ? 'Поздравляем! Вы попали. Ваш выстрел.' : 'Компьютер попал в ваш корабль. Выстрел компьютера';
				self.showServiseText(text);
				
				for (let i = flotEnemy.length - 1; i >= 0; i--) {
					let warship = flotEnemy[i], 
							arrayDescks = warship.state.shipMatrix;

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
					text = (this.state.curPlayer === 'user1') ? 'Поздравляем! Вы выиграли.' : 'К сожалению, вы проиграли.';
					
					userfield2.removeEventListener('click', self.shoot.bind(this) );
					
					//// заменить на смену состояния и очистку поля
					self.showServiseText(text + ' <a id="one_more_time" href="#" onClick="window.location.reload()">Ещё раз!</a>');

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
	}

	showIcons = function(enemy, coords, iconClass) {
		let fname = (enemy === 'user1') ? '#field_user1' : '#field_user2';
		let field = document.querySelector(fname);
		let div = document.createElement('div');
		div.className = 'icon-field ' + iconClass;
		div.style.cssText = `left: ${coords.y * this.props.shipSize}px; 
													top: ${coords.x * this.props.shipSize}px;`;
		field.appendChild(div);
	}

	setShootMatrix = function() {
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
		if (this.state.compShootMatrixAround.length > 0) {
			let coordsState = this.state.compShootMatrixAround.pop();
			this.setState({coords: coordsState});

		} else if (this.state.compShootMatrixAI.length > 0) {
			let coordsState = this.state.compShootMatrixAI.pop();
			this.setState({coords: coordsState});

		} else {
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
		const {compTempShip, coords, compShootMatrixAround, compShootMatrix, matrixUser1} = this.state;
		
		// тут coords.x - coords[0], coords.y - coords[1]
		if (compTempShip.dirx === 0 && compTempShip.diry === 0) {
			if (Object.keys(compTempShip.firstHit).length === 0) {
				let tempShipFirstHit = coords;
				this.setState((prevState) => {prevState.compTempShip.firstHit = tempShipFirstHit});
			} else {
				let tempShipNextHit, tempShipDirx, tempShipDiry;
				tempShipNextHit = coords;
				tempShipDirx = (Math.abs(compTempShip.firstHit[0] - compTempShip.nextHit[0]) === 1) ? 1 : 0;
				tempShipDiry = (Math.abs(compTempShip.firstHit[1] - compTempShip.nextHit[1]) === 1) ? 1 : 0;
				
				this.setState((prevState) => {prevState.compTempShip.nextHit = tempShipNextHit});
				this.setState((prevState) => {prevState.compTempShip.dirx = tempShipDirx});
				this.setState((prevState) => {prevState.compTempShip.diry = tempShipDiry});
			}
		}

		// корабль расположен вертикально
		if (coords[0] > 0 && compTempShip.diry === 0) this.state.compShootMatrixAround.push([coords[0] - 1, coords[1]]);
		if (coords[0] < 9 && compTempShip.diry === 0) this.state.compShootMatrixAround.push([coords[0] + 1, coords[1]]);
		// корабль расположен горизонтально
		if (coords[1] > 0 && compTempShip.dirx === 0) this.state.compShootMatrixAround.push([coords[0], coords[1] - 1]);
		if (coords[1] < 9 && compTempShip.dirx === 0) this.state.compShootMatrixAround.push([coords[0], coords[1] + 1]);

		// проверить их валидность
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
			// корабль потоплен
			self.resetTempShip();
		}

	}

	deleteElementMatrix = function(array, obj) {    
		for (let i = 0; i < array.length; i++) {
			// удаляем ячейку с координатой выстрела
			if (array[i][0] === obj.x && array[i][1] === obj.y) {
				array.splice(i, 1);
				break;
			}
		}
	}

	resetTempShip = function() {
		// обнуляем массив с координатами обстрела клеток вокруг попадания
		this.setState({compShootMatrixAround: []});
		// количество попаданий в корабль
		this.setState((prevState) => {prevState.compTempShip.totalHits = 0 });
		// объекты для хранения координат первого и второго попадания
		this.setState((prevState) => {prevState.compTempShip.firstHit = {} });
		this.setState((prevState) => {prevState.compTempShip.nextHit = {} });
		// значения для вычисления координат обстрела "раненого" корабля
		this.setState((prevState) => {prevState.compTempShip.dirx = 0 });
		this.setState((prevState) => {prevState.compTempShip.diry = 0 });
	}

	checkMaxDecks = function() {
		let arr = [];
		let flotUser1 = this.state.flotUser1;
		let length = flotUser1.length;

		for (let i = 0; i < length; i++) {
			// записываем в массив кол-во палуб у оставшихся кораблей
			arr.push(flotUser1[i].state.decks);
		}
		
		return Math.max.apply(null, arr);
	}

	markEmptyCell = function(points) {
		const {matrixUser1, compShootMatrix, compShootMatrixAround, compShootMatrixAI} = this.state;
		let obj;

		// перебираем массив с координатами
		for (let i = 0; i < points.length; i++) {
			obj = {
				x: points[i][0],
				y: points[i][1]
			};
			// если true хотя бы одно из условий, значит координата находится
			// за пределами игрового поля
			if (obj.x < 0 || obj.x > 9 || obj.y < 0 || obj.y > 9) continue;
			// в этом месте уже стоит отметка
			if (matrixUser1[obj.x][obj.y] !== 0) continue;

			// значение '2' = пустой клетке
			matrixUser1[obj.x][obj.y] = 2;

			// удаляем координаты, чтобы исключить их обстрел
			self.deleteElementMatrix(compShootMatrix, obj);
			if (compShootMatrixAround.length !== 0) {
				self.deleteElementMatrix(compShootMatrixAround, obj);
			}
			if (compShootMatrixAI.length !== 0) {
				self.deleteElementMatrix(compShootMatrixAI, obj);
			}
			self.deleteElementMatrix(compShootMatrix, obj);
		}
	}

	transformCoordinates = function(e) {
		try {
			let obj = {};

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
		return <></>;
	}
}
