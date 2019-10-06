import React, {Component} from 'react'
import './style.css'

class Field extends Component {
  
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



export default Field