import React, {Component} from 'react'
import './style.css'

export default
class Field extends Component {
	constructor(props) {
    super(props);
		const {field} = this.props;

		this.fieldSide = 330;
		this.shipSide	= 33;
		this.shipsData = ['',
											[4, 'fourdeck'],
											[3, 'tripledeck'],
											[2, 'doubledeck'],
											[1, 'singledeck']
										];
		this.field = field;
		this.fieldX = field.getBoundingClientRect().top + window.pageYOffset;
		this.fieldY = field.getBoundingClientRect().left + window.pageXOffset;
		this.fieldRight	= this.fieldY + this.fieldSide;
		this.fieldBtm	= this.fieldX + this.fieldSide;
		this.flot	= [];
	}

	randomLocationShips = function() {
		this.matrix = createMatrix();
	
		let length = this.shipsData.length;
		for (let i = 1; i < length; i++) {
			let decks = this.shipsData[i][0];
	
			for (let j = 0; j < i; j++) {
				
				let fieldCoord = this.getCoordinatesDecks(decks);
	
				fieldCoord.decks = decks,
				fieldCoord.shipname	= this.shipsData[i][1] + String(j + 1);
	
				let ship = new Ships(this, fieldCoord);
				ship.createShip();
			}
		}
	}

	getCoordinatesDecks = function(decks) {
		let dir = getRandom(1),
				x, y;
	
		if (dir == 0) {
			x = getRandom(9);
			y = getRandom(10 - decks);
		} else {
			x = getRandom(10 - decks);
			y = getRandom(9);
		}
	
		let result = this.checkLocationShip(x, y, dir, decks);
		if (!result) return this.getCoordinatesDecks(decks);
	
		let obj = {
			x: x,
			y: y,
			dir: dir
		};
		return obj;
	}

	checkLocationShip = function(x, y, dir, decks) {
		let fromX, toX, fromY, toY;
		fromX = (x == 0) ? x : x - 1;
		fromY = (y == 0) ? y : y - 1;
	
		if (dir == 1) {
			if (x + decks == 10) toX = x + decks;
			else toX = x + decks + 1;
	
			if (y == 9) toY = y + 1;
			else toY = y + 2;
		} else {
			if (x == 9) toX = x + 1;
			else toX = x + 2;
	
			if (y + decks == 10) toY = y + decks;
			else toY = y + decks + 1;
		}
	
		// make func
		for (let i = fromX; i < toX; i++) {
			for (let j = fromY; j < toY; j++) {
				if (this.matrix[i][j] == 1) return false;
			}
		}

		return true;
	}

	cleanField = function() {
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

  
  render() {
    const {playerState} = this.props;
    let playerNum, playerName;

    if (playerState === "user") {
      playerNum = "1";
      playerName = "Юзер";
    }
    if (playerState === "pc") {
      playerNum = "2";
      playerName = "Комп";
    }
    
    return (
      <div className={'bfield bfield' + playerNum}>
          <p className={'btext btext' + playerNum}>
            Игрок {playerNum}: <span id={'username' + playerNum}> {playerName}</span>
          </p>
        <div className="field field-user">
          <div className="top-nums">
            <div className="top-num top-num1">1</div>
            <div className="top-num top-num2">2</div>
            <div className="top-num top-num3">3</div>
            <div className="top-num top-num4">4</div>
            <div className="top-num top-num5">5</div>
            <div className="top-num top-num6">6</div>
            <div className="top-num top-num7">7</div>
            <div className="top-num top-num8">8</div>
            <div className="top-num top-num9">9</div>
            <div className="top-num top-num10">10</div>
          </div>
          <div className="left-nums">
            <div className="left-num left-num1">А</div>
            <div className="left-num left-num2">Б</div>
            <div className="left-num left-num3">В</div>
            <div className="left-num left-num4">Г</div>
            <div className="left-num left-num5">Д</div>
            <div className="left-num left-num6">Е</div>
            <div className="left-num left-num7">Ж</div>
            <div className="left-num left-num8">З</div>
            <div className="left-num left-num9">И</div>
            <div className="left-num left-num10">К</div>
          </div>
          <div id={'field_user' + playerNum} className="ships"></div>
        </div>
      </div>
    )
  }
}
