import {Component} from 'react'

class Field extends Component {
  
  state = {
    player: ''
  }

  render() {
    return(
    
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
  )
  }
}

export default Field