import React, { Component } from 'react'
import axios from 'axios';

export default class UnsyncedRequests extends Component {
  state = { items: {}}
  componentWillMount(){
    this.getUnsyncedItems();
    this.handleServiceWorkersMessages()
  }
  getUnsyncedItems(){
    axios.get('/_sw/get')
      .then(({ data }) => {
        const items = this.groupDataByUrl(data)
        this.setState({ items })
      })
  }
  groupDataByUrl(input){
    const result = {}
    input.forEach(({ url, payload}) => {
      result[url] = result[url] || [];
      result[url].push(payload);
    })
    return result;
  }
  handleServiceWorkersMessages(){
    navigator.serviceWorker.addEventListener('message', event => {
      console.log(event.data.msg);
    });
  }
  render() {
    const urls = Object.keys(this.state.items);
    return (
      <div>
        <h3>Unsynced elements({this.state.items.length}): </h3>
        {urls.map((url) => <div>
          <h4>url</h4>
          {
            this.state.items[url].map(elem => <div>{elem.idbKey}{elem.food.description}</div>)
          }
          </div>)}
        <div onClick={this.getUnsyncedItems.bind(this)}>Reload</div>
      </div>
    )
  }
}
