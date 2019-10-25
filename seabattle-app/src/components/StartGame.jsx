import React, {Component} from 'react'
import Controller from './Controller'

export default class StartGame extends Component {

	playClick = () => {
    try {
      let controlBtns = document.querySelectorAll('.control-btns');
      for (let btn of controlBtns) {
        btn.setAttribute('data-hidden', true);
      }
      // кидаем флаг запуска игры
      this.props.setStart();
    } catch(err) {
      console.error(err);
    }
  }
  

  render() {
    const {start, gameStarted, 
            matrixUser1, flotUser1, 
            matrixUser2, fieldXUser2, fieldYUser2, flotUser2, 
            fieldSize, shipSize, 
            setAppState, setGameStarted} = this.props;
    
    return (
      <div className="control-btns start-btn" data-hidden="false">
        <span id="play" className="btn-play" data-hidden="true" onClick={this.playClick}>Играть</span>

        <Controller matrixUser1={matrixUser1}
                    matrixUser2={matrixUser2}
                    fieldXUser2={fieldXUser2}
                    fieldYUser2={fieldYUser2}
                    flotUser1={flotUser1}
                    flotUser2={flotUser2}
                    fieldSize={fieldSize}
                    shipSize={shipSize}
                    start={start}
                    gameStarted={gameStarted}
                    setAppState={setAppState}
                    setGameStarted={setGameStarted} />
      </div>
    )
  }
}
