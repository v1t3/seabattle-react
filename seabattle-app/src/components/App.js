import React, {Component} from 'react'
import Field from './Field/'
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

          <Field playerState='user' />

          <Field playerState='pc' />

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