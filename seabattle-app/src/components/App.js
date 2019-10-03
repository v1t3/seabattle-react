import React, {Component} from 'react'
import Field from './Field'
import './style.css'

class App extends Component {
  state = {
    reverted: false
  }
  
  render() {
    return (
      <div className="wrap">
        <h3 id="text_top" className="text-top">Игра "Морской бой"</h3>
        <div className="field-wrap">

          <div className="bfield bfield1">
            <p className="btext btext1">Игрок 1: <span id="username1">Юзер</span></p>
            {/* Field */}
          </div>

          <div className="bfield bfield2">
            <p className="btext btext2">Игрок 2: <span>Компьютер</span></p>
            
          </div>

        </div>

        <div id="control_btns" className="control-btns" data-hidden="false">
          <span className="link-random" id="random" data-target="random" data-hidden="false">Расставить корабли</span>
          <span id="play" className="btn-play" data-hidden="true">Играть</span>
        </div>

        <div id="text_btm" className="text-btm"></div>
        
      </div>
    )
  }
}

export default App