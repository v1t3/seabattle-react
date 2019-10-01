'use strict';

/*
*
* fieldSide - размер игрового поля
* shipSide - размер клетки палубы корабля
* shipsData - массив с данными кораблей. Индекс элемента массива 
							будет соответствовать количеству кораблей пустой 
							нулевой элемент нужен, для удобства, чтобы начинать с 1цы
*	flot - массив с кораблями
*
*/
	
// функция построения полей
function Field(field) {
	this.fieldSide	= 330,
	this.shipSide	= 33,
	this.shipsData	= ['',
										[4, 'fourdeck'],
										[3, 'tripledeck'],
										[2, 'doubledeck'],
										[1, 'singledeck']
									],
	this.field = field;
	this.fieldX = field.getBoundingClientRect().top + window.pageYOffset;
	this.fieldY = field.getBoundingClientRect().left + window.pageXOffset;
	this.fieldRight	= this.fieldY + this.fieldSide;
	this.fieldBtm	= this.fieldX + this.fieldSide;
	this.flot	= [];
}


// добавим метод случайного расположения кораблей
Field.prototype.randomLocationShips = function() {
	this.matrix = createMatrix();

	let length = this.shipsData.length;
	for (let i = 1; i < length; i++) {
		let decks = this.shipsData[i][0];

		for (let j = 0; j < i; j++) {
			// получаем координаты первой палубы и направление расположения палуб (корабля)
			let fieldCoord = this.getCoordinatesDecks(decks);

			// добавим объекту 'fieldCoord' свойства: количество палуб и уникальное имя корабля, которое будет в качестве его 'id'
			fieldCoord.decks = decks,
			fieldCoord.shipname	= this.shipsData[i][1] + String(j + 1);

			// создаём корабль
			let ship = new Ships(this, fieldCoord);
			ship.createShip();
		}
	}
}


// добавим метод генерации координат кораблей
Field.prototype.getCoordinatesDecks = function(decks) {
	// dir == 0 - корабль горизонтально, dir == 1 - вертикально
	let dir = getRandom(1),
			x, y;

	// генерируем начальные координаты
	if (dir == 0) {
		x = getRandom(9);
		y = getRandom(10 - decks);
	} else {
		x = getRandom(10 - decks);
		y = getRandom(9);
	}

	// проверяем валидность координат всех палуб корабля
	let result = this.checkLocationShip(x, y, dir, decks);
	if (!result) return this.getCoordinatesDecks(decks);

	// создаём объект, свойствами которого будут начальные координаты и коэфициенты определяющие направления палуб
	let obj = {
		x: x,
		y: y,
		// kx: dir,
		// ky: !dir,
		dir: dir
	};
	return obj;
}


// добавим метод проверки положения кораблей
Field.prototype.checkLocationShip = function(x, y, dir, decks) {
	let fromX, toX, fromY, toY;

	// если 'x' равна нулю, то палуба примыкает к верхней границе,
	// тогда сверху не проверяем
	fromX = (x == 0) ? x : x - 1;
	
	// то же самое для столбцов
	fromY = (y == 0) ? y : y - 1;

	if (dir == 1) {
		// корабль расположен вертикально и его последняя палуба примыкает к нижней границе игрового поля
		if (x + decks == 10) toX = x + decks;
		// между ним и нижней границей игрового поля есть, как минимум, ещё одна строка
		else toX = x + decks + 1;

		// корабль расположен вертикально вдоль правой границы игрового поля
		if (y == 9) toY = y + 1;
		// корабль расположен вертикально где-то по середине игрового поля
		else toY = y + 2;
	} else {
		if (x == 9) toX = x + 1;
		else toX = x + 2;

		if (y + decks == 10) toY = y + decks;
		else toY = y + decks + 1;
	}

	// ставим корабль
	for (let i = fromX; i < toX; i++) {
		for (let j = fromY; j < toY; j++) {
			if (this.matrix[i][j] == 1) return false;
		}
	}

	return true;
}


// метод очистки поля
Field.prototype.cleanField = function() {
	let parent	= this.field,
			id = parent.getAttribute('id'),
			// получаем коллекцию все кораблей, которые нужно удалить
			divs = document.querySelectorAll(`#${id} > div`);

	// перебираем в цикле полученную коллекцию и удаляем входящие в неё корабли
	for (let el of divs) {
		parent.removeChild(el);
	}

	// очищаем массив объектов кораблей
	this.flot.length = 0;
}

let userfield = getId('field_user');
let	compfield = getId('field_comp');
let	comp;

// построим поле игрока
let user = new Field(userfield);


	/////////////////////////////////////////


function Ships(player, fieldCoord) {
	// на каком поле создаётся данный корабль
	this.player = player;
	// уникальное имя корабля
	this.shipname = fieldCoord.shipname;
	//количество палуб
	this.decks = fieldCoord.decks;
	// координата X первой палубы
	this.x0 = fieldCoord.x;
	// координата Y первой палубы
	this.y0 = fieldCoord.y;
	// направлении расположения палуб
	this.dir = fieldCoord.dir;
	// счётчик попаданий
	this.hits = 0;
	// массив с координатами палуб корабля
	this.matrix = [];
}

Ships.prototype.createShip = function() {
	let k = 0,
			x = this.x0,
			y = this.y0,
			dir = this.dir,
			decks	= this.decks,
			player = this.player

	// количество циклов будет равно количеству палуб создаваемого корабля
	while (k < decks) {
		// записываем координаты корабля в матрицу игрового поля
		player.matrix[x + k * dir][y + k * !dir] = 1;
		// записываем координаты корабля в матрицу экземпляра корабля
		this.matrix.push([x + k * dir, y + k * !dir]);
		k++;
	}

	// заносим информацию о созданном корабле в массив флот
	player.flot.push(this);
	// если корабль создан для игрока, выводим его на экран
	if (player == user) this.showShip();
	// когда созданы все корабли (10 шт), показываем кнопку запуска игры
	if (user.flot.length == 10) {
		getId('play').setAttribute('data-hidden', 'false');
	}
}

Ships.prototype.showShip = function() {
	let div = document.createElement('div'),
			dir_v = (this.dir == 1) ? ' vertical' : '',
			classname	= this.shipname.slice(0, -1),
			player = this.player;

	div.setAttribute('id', this.shipname);
	div.className = 'ship ' + classname + dir_v;
	// задаём позиционирование кораблю
	div.style.cssText = `left: ${this.y0 * player.shipSide}px; 
												top: ${this.x0 * player.shipSide}px;`;
	player.field.appendChild(div);
}


	/////////////////////////////////////////


let Controller = (function() {
	let player, enemy, self, coords, text,
			srvText = getId('text_btm'),
			tm = 0;

	let battle = {
		// инициализация игры
		init: function() {
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

			// временный объект корабля 'tempShip' куда будут заноситься
			// координаты попаданий, расположение корабля, количество попаданий
			self.resetTempShip();

			// генерируем координаты выстрелов компьютера и заносим их в массивы shootMatrix и shootMatrixAI
			self.setShootMatrix();

			// если первым стреляет человек
			if (player === user) {
				// регистрируем обработчик выстрела
				compfield.addEventListener('click', self.shoot);
				self.showServiseText('Вы стреляете первым.');
			} else {
				self.showServiseText('Первым стреляет компьютер.');
				// вызываем функцию выстрела компа
				setTimeout(function() {
					return self.shoot();
				}, 1000);
			}
		},

		// обработка выстрела			
		shoot: function(e) {
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
						// запрет игроку стрелять
						compfield.removeEventListener('click', self.shoot);

						// если в массиве нет координат, сбрасываем объект к исходным значениям
						if (comp.shootMatrixAround.length == 0) {
							self.resetTempShip();
						}

						setTimeout(function() {
							return self.shoot();
						}, 1000);
					} else {
						// возврат игроку возможности стрелять
						compfield.addEventListener('click', self.shoot);
					}
					break;

				// попадание
				case 1:
					// записываем в матрицу значение '4', которое соответствует попаданию
					enemy.matrix[coords.x][coords.y] = 4;
					// рисуем крестик
					self.showIcons(enemy, coords, 'red-cross');
					text = (player === user) ? 'Поздравляем! Вы попали. Ваш выстрел.' : 'Компьютер попал в ваш корабль. Выстрел компьютера';
					self.showServiseText(text);

					for (let i = enemy.flot.length - 1; i >= 0; i--) {
						let warship = enemy.flot[i], 
								arrayDescks = warship.matrix;

						// перебираем координаты палуб корабля
						for (let j = 0, length = arrayDescks.length; j < length; j++) {
							// если координаты одной из палуб корабля совпали с координатами выстрела
							// увеличиванием счётчик попаданий
							if (arrayDescks[j][0] == coords.x && arrayDescks[j][1] == coords.y) {
								warship.hits++;

								// если кол-во попаданий в корабль становится равным кол-ву палуб
								// считаем этот корабль уничтоженным и удаляем его из массива флота,
								// но перед этим сохраняем координаты первой палубы удаляемого корабля
								// понадобятся для отметки клеток по краям корабля
								if (warship.hits == warship.decks) {
									if (player === comp) {
										// сохраняем координаты первой палубы
										comp.tempShip.x0 = warship.x0;
										comp.tempShip.y0 = warship.y0;
									}
									enemy.flot.splice(i, 1);
								}
								// выходим из цикла, т.к. палуба найдена
								break;
							}
						}
					}

					// игра закончена, все корабли противника уничтожены
					if (enemy.flot.length == 0) {
						text = (player === user) ? 'Поздравляем! Вы выиграли.' : 'К сожалению, вы проиграли.';
						srvText.innerHTML = text + ' <a id="one_more_time" href="#" onClick="window.location.reload()">Ещё раз!</a>';

						// победа игрока
						if (player == user) {
							compfield.removeEventListener('click', self.shoot);
						// победа компьютера
						} else {
							// если выиграл комп, показываем оставшиеся корабли компьютера
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
							// увеличиваем счётчик попаданий, равный кол-ву уничтоженных палуб
							comp.tempShip.totalHits++;
							// отмечаем клетки, где точно не может стоять корабль
							let points	= [
								[coords.x - 1, coords.y - 1],
								[coords.x - 1, coords.y + 1],
								[coords.x + 1, coords.y - 1],
								[coords.x + 1, coords.y + 1]
							];
							self.markEmptyCell(points);

							// находим максимально количество палуб из оставшихся кораблей
							let max = self.checkMaxDecks();

							if (comp.tempShip.totalHits >= max) {
								// корабль потоплен, помечаем клетки вокруг корабля, 
								// как гарантированно пустые
								if (comp.tempShip.totalHits == 1) { // однопалубный
									points = [
										// верхняя
										[comp.tempShip.x0 - 1, comp.tempShip.y0],
										// нижняя
										[comp.tempShip.x0 + 1, comp.tempShip.y0],
										// левая
										[comp.tempShip.x0, comp.tempShip.y0 - 1],
										// правая
										[comp.tempShip.x0, comp.tempShip.y0 + 1],
									];
								// многопалубный корабль
								} else {
									// получаем координаты левой (верхней) клетки для многопалубного корабля
									let x1 = comp.tempShip.x0 - comp.tempShip.dirx,
											y1 = comp.tempShip.y0 - comp.tempShip.diry,
											// получаем координаты правой или нижней клетки
											// для этого к координате первой палубы прибавляем количество палуб
											// умноженное на коэффициент, определяющий направление расположения
											// палуб корабля
											x2 = comp.tempShip.x0 + comp.tempShip.dirx * comp.tempShip.totalHits,
											y2 = comp.tempShip.y0 + comp.tempShip.diry * comp.tempShip.totalHits;
											
									points = [
										[x1, y1],
										[x2, y2]
									];
								}
								// сбрасываем значения свойств объекта comp.tempShip в исходное состояние;
								self.resetTempShip();
							} else {
								// формируем координаты выстрелов вокруг попадания
								self.setShootMatrixAround();
							}

							// производим новый выстрел
							setTimeout(function() {
								return self.shoot();
							}, 1000);
						}
					}
					break;
			}
		},

		showIcons: function(enemy, coords, iconClass) {
			let div = document.createElement('div');
			div.className = 'icon-field ' + iconClass;
			// задаём смещение созданного элемента
			div.style.cssText = `left: ${coords.y * enemy.shipSide}px; top: ${coords.x * enemy.shipSide}px;`;
			// устанавливаем созданный элемент в игровом поле противника
			enemy.field.appendChild(div);
		},

		setShootMatrix: function() {
			// заполняем массив shootMatrix
			for (let i = 0; i < 10; i++) {
				for(let j = 0; j < 10; j++) {
					comp.shootMatrix.push([i, j]);
				}
			}

			// заполняем массив shootMatrixAI
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

			// премешиваем массив setShootMatrixAI
			function compareRandom(a, b) {
				return Math.random() - 0.5;
			}
			comp.shootMatrix.sort(compareRandom);
			comp.shootMatrixAI.sort(compareRandom);
			return;
		},

		getCoordinatesShot: function() {
			// если ещё есть координаты выстрелов для реализации оптимальной
			// тактики, получаем их, в противном случае
			// берём координаты очередного выстрела из массива shootMatrix			
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

			// удаляем выбранные координаты из массива shootMatrix для исключения повторного обстрела
			if (comp.shootMatrixAI.length != 0) {
				self.deleteElementMatrix(comp.shootMatrixAI, obj);
			}
			self.deleteElementMatrix(comp.shootMatrix, obj);

			return obj;
		},

		setShootMatrixAround: function() {
			// если положение корабля не определено, то вычисляем его используя
			// координаты первого и второго попадания
			if (comp.tempShip.dirx == 0 && comp.tempShip.diry == 0) {
				// проверяем, есть ли в объекте 'tempShip.firstHit' координаты, если нет
				// то будем считать, что это первое попадание и запишем
				// в этот объект координаты первого попадания
				if (Object.keys(comp.tempShip.firstHit).length === 0) {
					comp.tempShip.firstHit = coords;
				} else {
					// запишем координаты второго попадания в объект 'nextHit'
					comp.tempShip.nextHit = coords;
					// вычисляем коэффициенты определяющие положения корабля
					// разность между соответствующими координатами первого и второго
					// попадания не может быть больше 1, в противном случае будем
					// считать, что второе попадание было по другому кораблю
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
		},

		deleteElementMatrix: function(array, obj) {
			for (let i = 0, lh = array.length; i < lh; i++) {
				// удаляем ячейку с координатой выстрела
				if (array[i][0] == obj.x && array[i][1] == obj.y) {
					array.splice(i, 1);
					break;
				}
			}
		},

		resetTempShip: function() {
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
		},

		checkMaxDecks: function() {
			let arr = [];
			for (let i = 0, length = user.flot.length; i < length; i++) {
				// записываем в массив кол-во палуб у оставшихся кораблей
				arr.push(user.flot[i].decks);
			}
			// возвращаем max значение
			return Math.max.apply(null, arr);
		},

		markEmptyCell: function(points) {
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
		},

		transformCoordinates: function(e, instance) {

			// создадим объект, в который запишем полученные координаты матрицы
			let obj = {};
			// вычисляем ячейку двумерного массива,которая соответствует
			// координатам выстрела
			obj.x = Math.trunc((e.pageY - instance.fieldX) / instance.shipSide),
			obj.y = Math.trunc((e.pageX - instance.fieldY) / instance.shipSide);
			return obj;
		},

		// вывод сообщений в ходе игры
		showServiseText: function(text) {
			srvText.innerHTML = text;
			// setTimeout("tm = srvText.innerHTML = ''", 1000);
		}
	};

	// делаем доступ к инициализации публичным, т.е. доступным снаружи модуля
	return ({
		battle: battle,
		init: battle.init
	});

})();


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
	Controller.battle.init();
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
