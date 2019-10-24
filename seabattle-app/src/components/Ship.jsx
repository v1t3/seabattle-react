import React, {Component} from 'react'

export default class Ship extends Component {  
  state = {
    shipMatrix: [],
    hits: 0,
    decks: this.props.decks,
    x: this.props.x,
    y: this.props.y,
  }
		
	createShip = function() {
    try {
      const {dir, decks, x, y, player} = this.props;
      let k = 0;
          
      // количество циклов будет равно количеству палуб создаваемого корабля
      while (k < decks) {
      	// записываем координаты корабля в матрицу игрового поля
      	this.props.matrix[x + k * dir][y + k * !dir] = 1;
      	// записываем координаты корабля в матрицу экземпляра корабля
      	this.state.shipMatrix.push([x + k * dir, y + k * !dir]);    // возможно уже не нужно
    
      	k++;
      }

      // заносим информацию о созданном корабле в массив флот
      this.props.flot.push(this);

      // если корабль создан для игрока, выводим его на экран
      if (player === 'user1') this.showShip();

      // когда созданы все корабли (10 шт), показываем кнопку запуска игры
      if (this.props.flot.length === 10) {
      	document.getElementById('play').setAttribute('data-hidden', 'false');
      }
    } catch(err) {
      console.error(err);
    }
	}

	showShip = function() {
    try {
      let {dir, shipname, x, y, shipSize} = this.props;
      let div = document.createElement('div'),
          dir_v = (dir === 1) ? ' vertical' : '',
          classname	= shipname.slice(0, -1);
          

      div.setAttribute('id', shipname);
      div.className = 'ship ' + classname + dir_v;
      // задаём позиционирование кораблю
      div.style.cssText = `left: ${y * shipSize}px; 
                           top: ${x * shipSize}px;`;

      this.props.field.appendChild(div);
    } catch(err) {
      console.error(err);
    }
	}

  render() {
    return (
      <div></div>
    )
  }
}