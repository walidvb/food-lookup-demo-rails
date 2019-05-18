import React, { Component } from 'react'
import axios from 'axios';

export default class UnsyncedRequests extends Component {
  state = { items: []}
  componentWillMount(){
    this.getUnsyncedItems();
  }
  getUnsyncedItems(){
    axios.get('/_sw/get')
      .then(({ data }) => {
        console.log(data);
        this.setState({ items: data })
      })
  }
  render() {
    return (
      <div>
        <h3>Unsynced elements: </h3>
        {this.state.items.length}
        <div onClick={this.getUnsyncedItems.bind(this)}>Reload</div>
      </div>
    )
  }
}
