import React, {Component} from 'react'
import Field from './Field/'
import './style.css'
import PlaceShips from './PlaceShips'
import StartGame from './StartGame'
import Rules from './Rules'
// import PopupName from './PopupName'
import Ships from './Ships'
import Controller from './Controller'
import getId from './getId'

export default 
class App extends Component {
  state = {
    reverted: false
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

