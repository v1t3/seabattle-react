import React, {Component} from 'react'

export default class PopupName extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({value: event.target.value});
  }
  
  handleSubmit(event) {
    event.preventDefault();
    if (this.state.value !== '') this.props.setAppState('user1', 'playerName', this.state.value);
    document.querySelector('#popup').setAttribute('data-hidden', true);
  }

  render() {
    // добавить возможность закрыть окно по Esc
    return (
      <div id="popup" className="popup" data-hidden="false">
        <div className="popup-wrap">
          <h3>Введите имя игрока 1</h3>
          <form action="post" onSubmit={this.handleChange}>
            <input id="popup_txt" type="text" placeholder="" onChange={this.handleChange} value={this.state.value} />
            <input id="popup_submit" type="button" value="OK" onClick={this.handleSubmit} />
          </form>
        </div>
      </div>
    )
  }
}