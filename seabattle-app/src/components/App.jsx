import React, {Component} from 'react'
import Field from './Field/'
import PlaceShips from './PlaceShips'
import StartGame from './StartGame'
import Rules from './Rules'
import Ships from './Ships'
import './style.css'
import './globals'

export default 
class App extends Component {
  state = {
    user1: null,
    user2: null
  }

  getId(id) {
    return document.getElementById(id);
  }

  getRandom(n) {
    return Math.floor(Math.random() * (n + 1));
  }

  createMatrix() {
    let x = 10, y = 10, arr = [10];
    for (let i = 0; i < x; i++) {
      arr[i] = [10];
      for(let j = 0; j < y; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }
  
  render() {
    return (
      <div className="wrap">
        <h3 id="text_top" className="text-top">Игра "Морской бой"</h3>
        <div className="field-wrap">
          <Field playerState='user' />
          <Field playerState='pc' />
        </div>        
        
        <div id="control_btns" className="control-btns" data-hidden="false">
          <PlaceShips />
          <StartGame />
        </div>

        <div id="text_btm" className="text-btm"></div>

        <Rules/>
        {/* <PopupName/> */}
        <Ships/>
      </div>
    )
  }
}

