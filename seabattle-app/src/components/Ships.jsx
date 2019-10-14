import React, {Component} from 'react'

export default class Ships extends Component {  
  state = {
    // x: this.props.x,
    // y: this.props.y,
    // dir: this.props.dir,
    // decks: this.props.decks,
    // player: this.props.player,
    // shipname: this.props.shipname,
    // shipSide: this.props.shipSide
    shipMatrix: []
  }
		
	createShip = function() {
    console.log('');
    console.log('createShip');

    try {
      let {dir, decks, x, y, player} = this.props;
      let k = 0;
          
      // количество циклов будет равно количеству палуб создаваемого корабля
      while (k < decks) {
      	// записываем координаты корабля в матрицу игрового поля
      	this.props.matrix[x + k * dir][y + k * !dir] = 1;
      	// записываем координаты корабля в матрицу экземпляра корабля
      	this.state.shipMatrix.push([x + k * dir, y + k * !dir]);    // возможно уже не нужно
        // this.props.setMatrix([x + k * dir, y + k * !dir]);
        
        // console.log('x=', x);
        // console.log('y=', y);
        // console.log('k=', k);
        // console.log('decks=', decks);
        // console.log('dir=', dir);
        // console.log('this.props.matrix=', this.props.matrix);
        // console.log('this.state.shipMatrix=', this.state.shipMatrix);
    
      	k++;
      }

      // заносим информацию о созданном корабле в массив флот
      this.props.flot.push(this);
      console.log('this.props.flot=', this.props.flot);

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
    // console.log('');
    // console.log('showShip');

    try {
      let {dir, shipname, x, y, shipSide} = this.props;
      let div = document.createElement('div'),
          dir_v = (dir === 1) ? ' vertical' : '',
          classname	= shipname.slice(0, -1);
          

      div.setAttribute('id', shipname);
      div.className = 'ship ' + classname + dir_v;
      // задаём позиционирование кораблю
      div.style.cssText = `left: ${y * shipSide}px; 
                           top: ${x * shipSide}px;`;

      // let player_field = document.querySelector('#field_user1');    // временно
      console.log(this.props);
      this.props.field.appendChild(div);
    } catch(err) {
      console.error(err);
    }
	}

  render() {
    console.log('');
    console.log('render Ships');

    return (
      <div id="ships_collection" className="ships-collection">
        <div id="fourdeck1" className="ship fourdeck"></div>
        <div id="tripledeck1" className="ship tripledeck tripledeck1"></div>
        <div id="tripledeck2" className="ship tripledeck tripledeck2"></div>
        <div id="doubledeck1" className="ship doubledeck"></div>
        <div id="doubledeck2" className="ship doubledeck doubledeck2"></div>
        <div id="doubledeck3" className="ship doubledeck doubledeck3"></div>
        <div id="singledeck1" className="ship singledeck"></div>
        <div id="singledeck2" className="ship singledeck singledeck2"></div>
        <div id="singledeck3" className="ship singledeck singledeck3"></div>
        <div id="singledeck4" className="ship singledeck singledeck4"></div>
      </div>
    )
  }
}