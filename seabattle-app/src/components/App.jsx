import React, {Component} from 'react'
import './style.css'
import Field from './Field/'
import StartGame from './StartGame'
// import Rules from './Rules'
// import PopupName from './PopupName'

export default class App extends Component {
  state = {
    user1: {
      name: "user1",
      id: "1",
      playerName: "Юзер"
    },
    user2: {
      name: "user2",
      id: "2",
      playerName: "Комп"
    }
  }

  render() {
    const {user1, user2} = this.state;

    return (
      <div className="wrap">
        <h3 id="text_top" className="text-top">Игра "Морской бой"</h3>
        <div className="field-wrap">
          <Field user={user1.name} playerNum={user1.id} playerName={user1.playerName} />
          <Field user={user2.name} playerNum={user2.id} playerName={user2.playerName} />
        </div>
        
        <StartGame />

        <div id="text_btm" className="text-btm"></div>

        {/* <Rules/> */}
        {/* <PopupName/> */}
      </div>
    )
  }
  
}
