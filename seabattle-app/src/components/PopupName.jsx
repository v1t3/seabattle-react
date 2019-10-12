// import React, {Component} from 'react'

// export default 
// class PopupName extends Component {
//   constructor(props) {
//     super(props);
    
//     this.state = {
//       value: ''
//     };

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(event) {
//     this.setState({value: event.target.value});
//     console.log('A name was submitted: ' + this.state.value);
//   }

//   handleSubmit(event) {
//     console.log('A name was submitted: ' + this.state.value);
//     event.preventDefault();
//   }

//   render() {
//     return (
//       <div id="popup" className="popup" data-hidden="false">
//         <div className="popup-wrap">
//           <h3>Введите имя игрока 1</h3>
//           <form action="post" onSubmit={this.handleChange}>
//             <input id="popup_txt" type="text" placeholder="" onChange={this.handleChange} value={this.state.value} />
//             <input id="popup_submit" type="button" value="OK" />
//           </form>
//         </div>
//       </div>
//     )
//   }
// }