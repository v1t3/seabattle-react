import React, {Component} from 'react'
import Ships from './Ships'

export default class PlaceShips extends Component {
  // constructor(props) {
  //   super(props);

  //   // this.state = {
  //   //   randomId: 'random' + this.props.playerNum
  //   // }
  // }

  // state = {
    // user: this.props.user,
    // shipSide: this.props.shipSide,
    // shipsData:  this.props.shipsData,
    // field: this.props.field,
    // flot: this.props.flot,
  // }
  
	randomLocationShips = function() {
    try {
      this.matrix = this.createMatrix();  // заполняем базу нулями
    
      let length = this.props.shipsData.length;
      let decks;
      let fieldCoord;

      for (let i = 1; i < length; i++) {
        decks = this.props.shipsData[i][0];
    
        for (let j = 0; j < i; j++) {
          fieldCoord = this.getCoordinatesDecks(decks);
          fieldCoord.decks = decks;
          fieldCoord.shipname	= this.props.shipsData[i][1] + String(j + 1);
    
          let ship = new Ships({
            x: fieldCoord.x,
            y: fieldCoord.y,
            dir: fieldCoord.dir,
            decks, 
            player: this.props.user,
            field: this.props.field,
            shipname: fieldCoord.shipname,
            shipSide: this.props.shipSide,
            flot: this.props.flot,
            matrix: this.matrix
          });
          
          ship.createShip();
          ship.showShip();
        }
      }
    } catch(err) {
      console.error(err);
    }
	}

	getCoordinatesDecks = function(decks) {
    try {
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
    try {
      let fromX, toX, fromY, toY;

      fromX = (x === 0) ? x : x - 1;
      fromY = (y === 0) ? y : y - 1;
    
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
    
      // make func
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
    try {
      let parent = this.props.field;
      let id = parent.getAttribute('id');

      // получаем коллекцию все кораблей, которые нужно удалить
      let divs = document.querySelectorAll(`#${id} > div`);
    
      // перебираем в цикле полученную коллекцию и удаляем входящие в неё корабли
      for (let el of divs) {
        parent.removeChild(el);
      }
    
      // очищаем массив объектов кораблей
      this.props.flot.length = 0;
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
      this.props.setUserfield();
      
      // рандомно расставляем корабли
      this.cleanField();
      this.randomLocationShips();
    } catch(err) {
      console.error(err);
    }
	}
  
  render() {
    // console.log(`'props PlaceShips ${this.props.user}`, this.props);
    
    return (
      <div id="control_btns" className="control-btns" data-hidden="false">
        <span className="link-random" 
              id={this.props.randomId} 
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