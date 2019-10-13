import React, {Component} from 'react'
// import Field from './Field/'

export default class PlaceShips extends Component {
  
	randomLocationShips = function() {
    console.log('');
    console.log('randomLocationShips');
    console.log('this.props=', this.props);
    console.log('this.state=', this.props.state);

    try {
      this.matrix = this.createMatrix();
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
    
          // let ship = new Ships(this, fieldCoord);
          // ship.createShip();
        }
      }
    } catch(err) {
      console.error(err);
    }
	}

	getCoordinatesDecks = function(decks) {
    console.log('');
    console.log('getCoordinatesDecks');

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
    console.log('');
    console.log('checkLocationShip');

    try {
      // let fromX, toX, fromY, toY;
      // fromX = (x === 0) ? x : x - 1;
      // fromY = (y === 0) ? y : y - 1;
    
      // if (dir === 1) {
      // 	if (x + decks === 10) toX = x + decks;
      // 	else toX = x + decks + 1;
    
      // 	if (y === 9) toY = y + 1;
      // 	else toY = y + 2;
      // } else {
      // 	if (x === 9) toX = x + 1;
      // 	else toX = x + 2;
    
      // 	if (y + decks === 10) toY = y + decks;
      // 	else toY = y + decks + 1;
      // }
    
      // // make func
      // for (let i = fromX; i < toX; i++) {
      // 	for (let j = fromY; j < toY; j++) {
      // 		if (this.matrix[i][j] === 1) return false;
      // 	}
      // }

      return true;
    } catch(err) {
      console.error(err);
    }
	}

	cleanField = function() {
    console.log('');
    console.log('cleanField');
    console.log('this.props=', this.props);

    try {
      const state = this.props.state;
      let parent = state.field;
      console.log('parent=', parent);
      let id = parent.getAttribute('id');
      console.log('id=', id);

          // получаем коллекцию все кораблей, которые нужно удалить
      let divs = document.querySelectorAll(`#${id} > div`);
      console.log('divs=', divs);
    
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
    try {
      let userfield1 = document.getElementById('field_user1');
      console.log('userfield1=', userfield1);

      this.props.setUserfield(userfield1);
      // this.setState({field: document.getElementById('field_user1')});
      console.log('child setUserfield');

      console.log('clicked PlaceShips');
      const user = this.props.user;
      console.log('user= ',user);
      
      // рандомно расставляем корабли
      this.cleanField();
      this.randomLocationShips();
    } catch(err) {
      console.error(err);
    }
	}
  
  render() {
    // console.log('PlaceShips field ', this.props.field);
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