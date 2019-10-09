import React from 'react'

export default
class Controller extends React.Component {
	init = function() {
		self = this;
		// рандомно определяем кто будет стрелять первым
		let rnd = getRandom(1);
		player = (rnd == 0) ? user : comp;
		// чей выстрел следующий
		enemy = (player === user) ? comp : user;

		// массив с координатами выстрелов при рандомном выборе
		comp.shootMatrix = [];
		// массив с координатами выстрелов для AI (компьютер стреляет случайно не по всему полю, 
		// а только по диагоналям)
		comp.shootMatrixAI = [];
		// массив с координатами вокруг клетки с попаданием
		comp.shootMatrixAround = [];
		// массив координат начала циклов
		comp.startPoints = [
			[ [6,0], [2,0], [0,2], [0,6] ],
			[ [3,0], [7,0], [9,2], [9,6] ]
		];

		self.resetTempShip();
		self.setShootMatrix();

		// если первым стреляет человек
		if (player === user) {
			compfield.addEventListener('click', self.shoot);
			self.showServiseText('Вы стреляете первым.');
		} else {
			self.showServiseText('Первым стреляет компьютер.');
			// вызываем функцию выстрела компа
			setTimeout(function() {
				return self.shoot();
			}, 1000);
		}
	}

	// обработка выстрела
	shoot = function(e) {
		// e !== undefined - значит выстрел производит игрок
		if (e !== undefined) {
			// преобразуем координаты выстрела (положения курсора) в координаты матрицы
			coords = self.transformCoordinates(e, enemy);
		} else {
			// получаем координаты для выстрела компьютера
			coords = self.getCoordinatesShot();
		}

		// значение матрицы по полученным координатам
		let val	= enemy.matrix[coords.x][coords.y];

		switch(val) {
			// промах
			case 0:
				// ставим точку и записываем промах в матрицу
				self.showIcons(enemy, coords, 'dot');
				enemy.matrix[coords.x][coords.y] = 3;

				text = (player === user) ? 'Вы промахнулись. Стреляет компьютер.' : 'Компьютер промахнулся. Ваш выстрел.';
				self.showServiseText(text);

				// меняем местами стреляющего и врага
				player = (player === user) ? comp : user;
				enemy = (player === user) ? comp : user;

				if (player == comp) {
					compfield.removeEventListener('click', self.shoot);

					if (comp.shootMatrixAround.length == 0) {
						self.resetTempShip();
					}

					setTimeout(function() {
						return self.shoot();
					}, 1000);
				} else {
					compfield.addEventListener('click', self.shoot);
				}
				break;

			// попадание
			case 1:
				enemy.matrix[coords.x][coords.y] = 4;
				self.showIcons(enemy, coords, 'red-cross');
				text = (player === user) ? 'Поздравляем! Вы попали. Ваш выстрел.' : 'Компьютер попал в ваш корабль. Выстрел компьютера';
				self.showServiseText(text);

				for (let i = enemy.flot.length - 1; i >= 0; i--) {
					let warship = enemy.flot[i], 
							arrayDescks = warship.matrix;

					for (let j = 0, length = arrayDescks.length; j < length; j++) {
						if (arrayDescks[j][0] == coords.x && arrayDescks[j][1] == coords.y) {
							warship.hits++;

							if (warship.hits == warship.decks) {
								if (player === comp) {
									comp.tempShip.x0 = warship.x0;
									comp.tempShip.y0 = warship.y0;
								}
								enemy.flot.splice(i, 1);
							}
							break;
						}
					}
				}

				if (enemy.flot.length == 0) {
					text = (player === user) ? 'Поздравляем! Вы выиграли.' : 'К сожалению, вы проиграли.';
					srvText.innerHTML = text + ' <a id="one_more_time" href="#" onClick="window.location.reload()">Ещё раз!</a>';

					if (player == user) {
						compfield.removeEventListener('click', self.shoot);
					} else {
						for (let i = 0, length = comp.flot.length; i < length; i++) {
							let div = document.createElement('div'),
									dir_v = (comp.flot[i].dir == 1) ? ' vertical' : '',
									classname	= comp.flot[i].shipname.slice(0, -1);

							div.className = 'ship ' + classname + dir_v;
							div.style.cssText = `left: ${comp.flot[i].y0 * comp.shipSide}px; 
																		top: ${comp.flot[i].x0 * comp.shipSide}px;`;
							comp.field.appendChild(div);
						}
					}
				// бой продолжается
				} else {
					if (player === comp) {
						comp.tempShip.totalHits++;
						let points	= [
							[coords.x - 1, coords.y - 1],
							[coords.x - 1, coords.y + 1],
							[coords.x + 1, coords.y - 1],
							[coords.x + 1, coords.y + 1]
						];
						self.markEmptyCell(points);

						let max = self.checkMaxDecks();

						if (comp.tempShip.totalHits >= max) {
							if (comp.tempShip.totalHits == 1) {
								points = [
									[comp.tempShip.x0 - 1, comp.tempShip.y0],
									[comp.tempShip.x0 + 1, comp.tempShip.y0],
									[comp.tempShip.x0, comp.tempShip.y0 - 1],
									[comp.tempShip.x0, comp.tempShip.y0 + 1],
								];
							} else {
								let x1 = comp.tempShip.x0 - comp.tempShip.dirx,
										y1 = comp.tempShip.y0 - comp.tempShip.diry,
										x2 = comp.tempShip.x0 + comp.tempShip.dirx * comp.tempShip.totalHits,
										y2 = comp.tempShip.y0 + comp.tempShip.diry * comp.tempShip.totalHits;
										
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
		}
	}

	showIcons = function(enemy, coords, iconClass) {
		let div = document.createElement('div');
		div.className = 'icon-field ' + iconClass;
		div.style.cssText = `left: ${coords.y * enemy.shipSide}px; top: ${coords.x * enemy.shipSide}px;`;
		enemy.field.appendChild(div);
	}

	setShootMatrix = function() {
		for (let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				comp.shootMatrix.push([i, j]);
			}
		}

		for (let i = 0, length = comp.startPoints.length; i < length; i++) {
			let arr = comp.startPoints[i];
			for (let j = 0, lh = arr.length; j < lh; j++) {
				let x = arr[j][0],
						y = arr[j][1];

				switch(i) {
					case 0:
						while(x <= 9 && y <= 9) {
							comp.shootMatrixAI.push([x,y]);
							x = (x <= 9) ? x : 9;
							y = (y <= 9) ? y : 9;
							x++; y++;
						};
						break;

					case 1:
						while(x >= 0 && x <= 9 && y <= 9) {
							comp.shootMatrixAI.push([x,y]);
							x = (x >= 0 && x <= 9) ? x : (x < 0) ? 0 : 9;
							y = (y <= 9) ? y : 9;
							x--; y++;
						};
						break;
				}
			}
		}

		function compareRandom(a, b) {
			return Math.random() - 0.5;
		}
		comp.shootMatrix.sort(compareRandom);
		comp.shootMatrixAI.sort(compareRandom);
		return;
	}

	getCoordinatesShot = function() {
		if (comp.shootMatrixAround.length > 0) {
			coords = comp.shootMatrixAround.pop();
		} else if (comp.shootMatrixAI.length > 0) {
			coords = comp.shootMatrixAI.pop();
		} else {
			coords = comp.shootMatrix.pop();
		}

		let obj = {
			x: coords[0],
			y: coords[1]
		};

		if (comp.shootMatrixAI.length != 0) {
			self.deleteElementMatrix(comp.shootMatrixAI, obj);
		}
		self.deleteElementMatrix(comp.shootMatrix, obj);

		return obj;
	}

	setShootMatrixAround = function() {
		if (comp.tempShip.dirx == 0 && comp.tempShip.diry == 0) {
			if (Object.keys(comp.tempShip.firstHit).length === 0) {
				comp.tempShip.firstHit = coords;
			} else {
				comp.tempShip.nextHit = coords;
				comp.tempShip.dirx = (Math.abs(comp.tempShip.firstHit.x - comp.tempShip.nextHit.x) == 1) ? 1 : 0;
				comp.tempShip.diry = (Math.abs(comp.tempShip.firstHit.y - comp.tempShip.nextHit.y) == 1) ? 1 : 0;
			}
		}

		// корабль расположен вертикально
		if (coords.x > 0 && comp.tempShip.diry == 0) comp.shootMatrixAround.push([coords.x - 1, coords.y]);
		if (coords.x < 9 && comp.tempShip.diry == 0) comp.shootMatrixAround.push([coords.x + 1, coords.y]);
		// корабль расположен горизонтально
		if (coords.y > 0 && comp.tempShip.dirx == 0) comp.shootMatrixAround.push([coords.x, coords.y - 1]);
		if (coords.y < 9 && comp.tempShip.dirx == 0) comp.shootMatrixAround.push([coords.x, coords.y + 1]);

		// необходимо проверить их валидность
		// координата валидна, если значение массива не равно или 2 (гарантированно пустая клетка), 
		// или 3 (промах), или 4 (попадание)
		for (let i = comp.shootMatrixAround.length - 1; i >= 0; i--) {
			// координаты возможного выстрела
			let x = comp.shootMatrixAround[i][0],
					y = comp.shootMatrixAround[i][1];
			
			if (user.matrix[x][y] !== 0 && user.matrix[x][y] !== 1) {
				comp.shootMatrixAround.splice(i,1);
				self.deleteElementMatrix(comp.shootMatrix, coords);
			}
		}
		if (comp.shootMatrixAround.length == 0) {
			// корабль потоплен, сбрасываем свойства объекта tempShip
			self.resetTempShip();
		}

		return;
	}

	deleteElementMatrix = function(array, obj) {
		for (let i = 0, lh = array.length; i < lh; i++) {
			// удаляем ячейку с координатой выстрела
			if (array[i][0] == obj.x && array[i][1] == obj.y) {
				array.splice(i, 1);
				break;
			}
		}
	}

	resetTempShip = function() {
		// обнуляем массив с координатами обстрела клеток вокруг попадания
		comp.shootMatrixAround = [];
		comp.tempShip = {
			// количество попаданий в корабль
			totalHits: 0,
			// объекты для хранения координат первого и второго попадания
			firstHit: {},
			nextHit: {},
			// значения для вычисления координат обстрела "раненого" корабля
			dirx: 0,
			diry: 0
		};
	}

	checkMaxDecks = function() {
		let arr = [];
		for (let i = 0, length = user.flot.length; i < length; i++) {
			// записываем в массив кол-во палуб у оставшихся кораблей
			arr.push(user.flot[i].decks);
		}
		// возвращаем max значение
		return Math.max.apply(null, arr);
	}

	markEmptyCell = function(points) {
		let obj;

		// перебираем массив с координатами
		for (let i = 0, lh = points.length ; i < lh ; i++) {
			obj = {
				x: points[i][0],
				y: points[i][1]
			};
			// если true хотя бы одно из условий, значит координата находится
			// за пределами игрового поля
			if (obj.x < 0 || obj.x > 9 || obj.y < 0 || obj.y > 9) continue;

			// в этом месте уже стоит отметка
			if (user.matrix[obj.x][obj.y] != 0) continue;

			// записываем в двумерный массив игрового поля игрока по данным координатам
			// значение '2', соотвествующее пустой клетке
			user.matrix[obj.x][obj.y] = 2;

			// удаляем из массивов выстрелов данные координаты, чтобы исключить в дальнейшем их обстрел
			self.deleteElementMatrix(comp.shootMatrix, obj);
			if (comp.shootMatrixAround.length != 0) {
				self.deleteElementMatrix(comp.shootMatrixAround, obj);
			}
			if (comp.shootMatrixAI.length != 0) {
				self.deleteElementMatrix(comp.shootMatrixAI, obj);
			}
			self.deleteElementMatrix(comp.shootMatrix, obj);
		}
	}

	transformCoordinates = function(e, instance) {

		// создадим объект, в который запишем полученные координаты матрицы
		let obj = {};
		// вычисляем ячейку двумерного массива,которая соответствует
		// координатам выстрела
		obj.x = Math.trunc((e.pageY - instance.fieldX) / instance.shipSide),
		obj.y = Math.trunc((e.pageX - instance.fieldY) / instance.shipSide);
		return obj;
	}

	// вывод сообщений в ходе игры
	showServiseText = function(text) {
		srvText.innerHTML = text;
		// setTimeout("tm = srvText.innerHTML = ''", 1000);
	}
}
