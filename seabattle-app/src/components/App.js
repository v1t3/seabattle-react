import React, {Component} from 'react'
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
              <div id="field_user" className="ships"></div>
            </div>
          </div>

          <div className="bfield bfield2">
            <p className="btext btext2">Игрок 2: <span>Компьютер</span></p>
            <div className="field field-comp">
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
              <div id="field_comp" className="ships"></div>
            </div>
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