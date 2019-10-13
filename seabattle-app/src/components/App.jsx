import React, {Component} from 'react'
import './style.css'
import Field from './Field/'
// import PlaceShips from './PlaceShips'
import StartGame from './StartGame'
// import Rules from './Rules'
// import PopupName from './PopupName'

export default class App extends Component {
  state = {
    user1: null,
    user2: null
  }

  render() {
    let user1 = <Field user="user1" playerNum="1" playerName="Юзер" />
    let user2 = <Field user="user2" playerNum="2" playerName="Комп" />
    return (
      <div className="wrap">
        <h3 id="text_top" className="text-top">Игра "Морской бой"</h3>
        <div className="field-wrap">
          {user1}
          {user2}
        </div>        
        
        
        <StartGame />

        <div id="text_btm" className="text-btm"></div>

        {/* <Rules/> */}
        {/* <PopupName/> */}
        {/* <Ships/> */}
      </div>
    )
  }
  
}
