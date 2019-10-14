import React, {Component} from 'react'

export default class Ships extends Component {
	// constructor(props) {
	// 	super(props);
		
	// 	const {player, fieldCoord} = this.props;
    
  //   this.player = player;
	// 	this.shipname = fieldCoord.shipname;
	// 	this.decks = fieldCoord.decks;
	// 	this.x0 = fieldCoord.x;
	// 	this.y0 = fieldCoord.y;
	// 	this.dir = fieldCoord.dir;
	// 	this.hits = 0;
	// 	this.matrix = [];
  // }
  
  state = {
    x: this.props.x,
    y: this.props.y,
    dir: this.props.dir,
    player: this.props.player,
    decks: this.props.decks,
    shipname: this.props.shipname,
    player: this.props.player
  }
		
	createShip = function() {
    console.log('');
    console.log('createShip');
    // console.log('this.props', this.props);

    try {
      // let k = 0
          
      // // количество циклов будет равно количеству палуб создаваемого корабля
      // while (k < decks) {
      // 	// записываем координаты корабля в матрицу игрового поля
      // 	player.matrix[x + k * dir][y + k * !dir] = 1;
      // 	// записываем координаты корабля в матрицу экземпляра корабля
      // 	this.matrix.push([x + k * dir, y + k * !dir]);
      // 	k++;
      // }

      // // заносим информацию о созданном корабле в массив флот
      // player.flot.push(this);
      // // если корабль создан для игрока, выводим его на экран
      // if (player == user1) this.showShip();
      // // когда созданы все корабли (10 шт), показываем кнопку запуска игры
      // if (user1.flot.length == 10) {
      // 	document.getElementById('play').setAttribute('data-hidden', 'false');
      // }
    } catch(err) {
      console.error(err);
    }
	}

	showShip = function() {
    console.log('');
    console.log('showShip');

    try {
      let div = document.createElement('div'),
          dir_v = (this.state.dir == 1) ? ' vertical' : '',
          classname	= this.state.shipname.slice(0, -1);
          

      div.setAttribute('id', this.state.shipname);
      div.className = 'ship ' + classname + dir_v;
      // задаём позиционирование кораблю
      div.style.cssText = `left: ${this.state.y * this.state.player.shipSide}px; 
                           top: ${this.state.x * this.state.player.shipSide}px;`;
      // console.log('div=', div);
      // console.log('div.className=', div.className);
      // console.log('div.style.cssText=', div.style.cssText);

      let player_field = document.querySelector('#field_user1');    // временно

      player_field.appendChild(div);
    } catch(err) {
      console.error(err);
    }
	}

  render() {
    console.log('');
    console.log('render Ships');

    try {
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
    } catch(err) {
      console.error(err);
    }
  }
}