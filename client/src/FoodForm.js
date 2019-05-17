import React from 'react'
import axios from 'axios'

export default class FoodForm extends React.Component {
  state = { food: { description: '' } }
  handleOnChange = ({ target: { value: description } }) => this.setState({ food: { description }})
  handleSubmit = () => {
    const url = '/api/food'
    const { food } = this.state
    console.log('POSTing', food)
    axios.post(url, { food })
      .then(() => {
        this.setState({
          food: { description: ''}
        })
      });
  }
  render = () => {
    return (
      <div>
        <input type="text" onChange={this.handleOnChange} value={this.state.description}></input>
        <input type="button" value="Submit" onClick={this.handleSubmit}/>
      </div>
    )
  }
}