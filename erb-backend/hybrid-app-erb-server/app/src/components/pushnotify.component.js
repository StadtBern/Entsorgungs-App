/* 
 * Entsorgung Stadt Bern - An app to get information about Disposal and Recycling Bern.
 * 
 * Copyright (C) 2022 City of Bern Switzerland 
 * 
 * This program is free software: you can redistribute it and/or modify 
 * it under the terms of the GNU Affero General Public License as 
 * published by the Free Software Foundation, either version 3 of the 
 * License, or (at your option) any later version. 
 * 
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU Affero General Public License for more details. 
 * 
 * You should have received a copy of the GNU Affero General Public License 
 * along with this program. If not, see <http://www.gnu.org/licenses/>. 
 */
 


import React, { Component } from 'react'
import PushNotifyDataService from '../services/pushnotify.service'

// Page create a push notification with a title, text and topic to specify the receivers of the message

export default class MenuItem extends Component {
  constructor(props) {
    super(props)
    this.onChangeText = this.onChangeText.bind(this)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeTopic = this.onChangeTopic.bind(this)

    this.submitPushNotification = this.submitPushNotification.bind(this)

    this.state = {
      title: '',
      text: '',
      topic: 'TestDevices',
      message: '',
    }
  }

  onChangeText(e) {
    const text = e.target.value

    this.setState(() => ({
      text: text,
    }))
  }
  onChangeTitle(e) {
    const title = e.target.value

    this.setState(() => ({
      title: title,
    }))
  }
  onChangeTopic(e) {
    const topic = e.target.value

    this.setState(() => ({
      topic: topic,
    }))
  }

  submitPushNotification() {
    console.log('run submitPushNotification')
    const message = {
      title: this.state.title,
      text: this.state.text,
      topic: this.state.topic,
    }
    PushNotifyDataService.create(message)
      .then((response) => {
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })

    this.setState(() => ({
      title: '',
      text: '',
      topic: 'TestDevices',
      message:
        'Nachricht ' +
        this.state.title +
        ': ' +
        this.state.text +
        ' to TOPIC: ' +
        this.state.topic,
    }))
  }
  render() {
    const { title, text, topic } = this.state

    return (
      <div>
        <div className="edit-form">
          <h4>Send remote push message to topic</h4>
          <form>
            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <select
                className="form-control"
                id="topic"
                onChange={this.onChangeTopic}
              >
                <option value="TestDevices">TEST: TestDevices</option>
                <option value="TestDevices2">TEST: TestDevices2</option>
                <option value="allDevices">PROD: An alle Geräte!</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="text">Text</label>
              <input
                type="text"
                className="form-control"
                id="text"
                value={text}
                onChange={this.onChangeText}
                name="text"
              />
            </div>
          </form>

          <button
            type="submit"
            className="badge badge-success"
            onClick={this.submitPushNotification}
          >
            Senden
          </button>
          <p>{this.state.message}</p>
        </div>
      </div>
    )
  }
}

