import React from 'react'
import axios from 'axios'

export default class FoodForm extends React.Component {
  state = { food: { description: '' }, sent: [] }
  handleOnChange = ({ target: { value: description } }) => this.setState({ food: { description }})
  handleSubmit = () => {
    const url = '/api/food'
    const { food } = this.state
    console.log('POSTing', food)
    axios.post(url, { food })
      .then(({ data }) => {
        console.log(data)
        this.setState({
          food: { description: ''},
          sent: [data, ...this.state.sent],
        })
      })
      .catch(console.log);
  }
  render = () => {
    return (
      <div>
        <input type="text" onChange={this.handleOnChange} value={this.state.food.description}></input>
        <input type="button" value="Submit" onClick={this.handleSubmit}/>
        {this.state.sent.map((f,i) => <div key={i}><em>sent:</em> {f.description}</div>)}
      </div>
    )
  }
}