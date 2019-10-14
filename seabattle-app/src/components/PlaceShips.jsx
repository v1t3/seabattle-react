import React, {Component} from 'react'
import Ships from './Ships'

export default class PlaceShips extends Component {
  
	randomLocationShips = function() {
    console.log('');
    console.log('randomLocationShips');
    console.log('this.props=', this.props);
    console.log('this.state=', this.props.state);

    try {
      this.matrix = this.createMatrix();  // заполняем базу нулями
      const state = this.props.state;
    
      let length = state.shipsData.length;
      let decks;
      let fieldCoord;

      for (let i = 1; i < length; i++) {
        decks = state.shipsData[i][0];
        // console.log('decks=', decks);
    
        for (let j = 0; j < i; j++) {
          fieldCoord = this.getCoordinatesDecks(decks);
          // console.log('fieldCoord=', fieldCoord);

          fieldCoord.decks = decks;
          fieldCoord.shipname	= state.shipsData[i][1] + String(j + 1);
          // console.log('fieldCoord.decks=', fieldCoord.decks);
          // console.log('fieldCoord.shipname=', fieldCoord.shipname);
    
          let ship = new Ships({
            x: fieldCoord.x,
            y: fieldCoord.y,
            dir: fieldCoord.dir,
            decks, 
            player: state.user,
            shipname: fieldCoord.shipname,
            shipSide: state.shipSide,
            flot: state.flot,
            matrix: this.matrix
          });
          console.log('ship=', ship);
          console.log('state.field=', state.field);
          
          ship.createShip();
          ship.showShip();
        }
      }
    } catch(err) {
      console.error(err);
    }
	}

	getCoordinatesDecks = function(decks) {
    // console.log('');
    // console.log('getCoordinatesDecks');

    try {
      // const state = this.props.state;
      let x, y,
          dir = this.getRandom(1);
    
      if (dir === 0) {
      	x = this.getRandom(9);
      	y = this.getRandom(10 - decks);
      } else {
      	x = this.getRandom(10 - decks);
      	y = this.getRandom(9);
      }
    
      let result = this.checkLocationShip(x, y, dir, decks);
      if (!result) return this.getCoordinatesDecks(decks);
    
      let obj = {
        x: x,
        y: y,
        dir: dir
      };
      return obj;
    } catch (err) {
      console.error(err);
    }
	}

	checkLocationShip = function(x, y, dir, decks) {
    // console.log('');
    // console.log('checkLocationShip');

    try {
      let fromX, toX, fromY, toY;
      // console.log('x=', x);
      // console.log('y=', y);
      // console.log('dir=', dir);
      // console.log('decks=', decks);

      fromX = (x === 0) ? x : x - 1;
      fromY = (y === 0) ? y : y - 1;
      // console.log('fromX=', fromX);
      // console.log('fromY=', fromY);
    
      if (dir === 1) {
      	if (x + decks === 10) toX = x + decks;
      	else toX = x + decks + 1;
    
      	if (y === 9) toY = y + 1;
      	else toY = y + 2;
      } else {
      	if (x === 9) toX = x + 1;
      	else toX = x + 2;
    
      	if (y + decks === 10) toY = y + decks;
      	else toY = y + decks + 1;
      }
      // console.log('toX=', toX);
      // console.log('toY=', toY);
    
      // make func
        // console.log('matrix[i][j]=', this.matrix);
      for (let i = fromX; i < toX; i++) {
      	for (let j = fromY; j < toY; j++) {
      		if (this.matrix[i][j] === 1) return false;
      	}
      }

      return true;
    } catch(err) {
      console.error(err);
    }
	}

	cleanField = function() {
    // console.log('');
    // console.log('cleanField');
    // console.log('this.props=', this.props);

    try {
      const state = this.props.state;
      let parent = state.field;
      // console.log('parent=', parent);
      let id = parent.getAttribute('id');
      // console.log('id=', id);

          // получаем коллекцию все кораблей, которые нужно удалить
      let divs = document.querySelectorAll(`#${id} > div`);
      // console.log('divs=', divs);
    
      // перебираем в цикле полученную коллекцию и удаляем входящие в неё корабли
      for (let el of divs) {
        parent.removeChild(el);
      }
    
      // очищаем массив объектов кораблей
      state.flot.length = 0;
    } catch(err) {
      console.error(err);
    }
  }
  
  createMatrix() {
    try {
      let x = 10, y = 10, arr = [10];
      for (let i = 0; i < x; i++) {
        arr[i] = [10];
        for(let j = 0; j < y; j++) {
          arr[i][j] = 0;
        }
      }
      return arr;
    } catch(err) {
      console.error(err);
    }
  }
  
  getRandom(n) {
    try {
      return Math.floor(Math.random() * (n + 1));
    } catch(err) {
      console.error(err);
    }
  }


	randomClick = () => {
    // console.log('');
    // console.log('clicked PlaceShips');

    try {
      let userfield1 = document.getElementById('field_user1');
      // console.log('userfield1=', userfield1);

      this.props.setUserfield(userfield1);
      // console.log('child setUserfield');

      const user = this.props.user;
      // console.log('user= ',user);
      
      // рандомно расставляем корабли
      this.cleanField();
      this.randomLocationShips();
    } catch(err) {
      console.error(err);
    }
	}
  
  render() {
    return (
      <div id="control_btns" className="control-btns" data-hidden="false">
        <span className="link-random" 
              id="random" 
              data-target="random" 
              data-hidden="false"
              onClick={this.randomClick}
        >
          Расставить корабли
        </span>
      </div>
    )
  }
}