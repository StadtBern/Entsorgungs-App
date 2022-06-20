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
 


const https = require('https')
const { google } = require('googleapis')

const HOST = 'fcm.googleapis.com'
const PATH = '/v1/projects/' + process.env.PROJECT_ID + '/messages:send'
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

exports.sendMessage = (title, text, topic) => {
  console.log('sendMessage:', title, text, topic)
  this.sendFcmMessage(this.buildCommonMessage(title, text, topic))
}

// Get a valid access token.
// [START retrieve_access_token]
exports.getAccessToken = () => {
  console.log('getAccessToken')
  return new Promise(function (resolve, reject) {
    const key = JSON.parse(process.env.GOOGLE_AUTH)
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null,
    )
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}
// [END retrieve_access_token]

// Send HTTP request to FCM with given message.
exports.sendFcmMessage = (fcmMessage) => {
  this.getAccessToken().then(function (accessToken) {
    const options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }
    console.log('options', options)

    const request = https.request(options, function (resp) {
      resp.setEncoding('utf8')
      resp.on('data', function (data) {
        console.log('Message sent to Firebase for delivery')
      })
    })

    request.on('error', function (err) {
      console.log('Unable to send message to Firebase')
      console.log(err)
    })
    request.write(JSON.stringify(fcmMessage))
    request.end()
  })
}

// Build JSOn to customize message
exports.buildOverrideMessage = () => {
  const fcmMessage = this.buildCommonMessage()
  const apnsOverride = {
    payload: {
      aps: {
        badge: 1,
      },
    },
    headers: {
      'apns-priority': '10',
    },
  }

  const androidOverride = {
    notification: {
      click_action: 'android.intent.action.MAIN',
    },
  }

  fcmMessage['message']['android'] = androidOverride
  fcmMessage['message']['apns'] = apnsOverride

  return fcmMessage
}

// Build JSON for common message to topic
exports.buildCommonMessage = (title, text, topic) => {
  title = title || 'Default title'
  text = text || 'Default text'
  topic = topic || 'TestDevices'
  return {
    message: {
      topic: topic,
      notification: {
        title: title,
        body: text,
      },
    },
  }
}

