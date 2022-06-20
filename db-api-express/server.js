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
 


const schedule = require('node-schedule')
const fs = require('fs')
var https = require('https')
const zonen = require('./controllers/zonen.controller.js')
const abfuhradressen = require('./controllers/abfuhradressen.controller.js')
const poi = require('./controllers/poi.controller.js')

const menuitem = require('./controllers/menuitem.controller.js')
const contentitem = require('./controllers/contentitem.controller.js')
const images = require('./controllers/images.controller.js')

var urlToJsonBase = process.env.SOURCE_URL_GEOINFO

schedule.scheduleJob(process.env.SYNC_SCHEDULE_GEOINFO, function () {
  console.log('Download all Data Files from Geoinfo: Start!')

  loadAllData()

  console.log('Download all Data Files from Geoinfo: End!')
})

function loadAllData() {
  getJsonToDB(urlToJsonBase + 'Zonen.json', zonen.create, zonen.deleteAll)
  getJsonToDB(urlToJsonBase + 'erb_poi.json', poi.create, poi.deleteAll)
  getJsonToDB(
    urlToJsonBase + 'Abfallsammeladressen.json',
    abfuhradressen.create,
    abfuhradressen.deleteAll,
  )
}

loadAllData()
var toTwoDigits = (n) => ('0' + n).slice(-2)

async function generateBackup(tableName, findAllFunc) {
  console.log('generateBackup Start')
  var menuitemsBackup = await findAllFunc()
  let backupData = JSON.stringify(menuitemsBackup, null, 2)
  var date = new Date()

  var filename =
    'mountData/backup_' +
    process.env.MYSQL_DATABASE +
    '_' +
    tableName +
    '_' +
    date.getFullYear() +
    '-' +
    toTwoDigits(date.getMonth() + 1) +
    '-' +
    toTwoDigits(date.getDate()) +
    '_' +
    toTwoDigits(date.getHours() + 1) +
    '-' +
    toTwoDigits(date.getMinutes()) +
    '-' +
    toTwoDigits(date.getSeconds()) +
    '.json'

  fs.writeFile(filename, backupData, (err) => {
    if (err) throw err
    console.log('BackupData written to file:', filename)
  })
}

schedule.scheduleJob(process.env.BACKUP_SCHEDULE, function () {
  generateBackup('menuitem', menuitem.findAll)
  generateBackup('contentitem', contentitem.findAll)
  generateBackup('images', images.findAll)
})

function getJsonToDB(url, createFunc, deleteFunc) {
  var index,
    array,
    limit = 100

  console.log('getJsonToDB: Start!')
  https
    .get(url, (res) => {
      var body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', async () => {
        try {
          var data = JSON.parse(body)
          console.log(data.length)
          if (data.length > 0) {
            console.log('Data is available to load. Delete existing data.')
            console.log('DeleteFunc Return Value', await deleteFunc())

            for (index = 0; index < data.length; index += limit) {
              console.log('Load Data From JsonFile: index:', index)
              array = data.slice(index, index + limit)
              createFunc({ body: array })
            }
          }
        } catch (error) {
          console.error(error.message)
        }
      })
    })
    .on('error', (error) => {
      console.error(error.message)
    })
  console.log('getJsonToDB: End!')
}

console.log('Start API!!!')
console.log('!!!')

const express = require('express')
const cors = require('cors')

const app = express()

const { db } = require('./models')

// prod?
if (true) {
  // in prod:
  db.sequelize.sync()
} else {
  // in dev, reset DB:
  db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and re-sync db.')
  })
}

var corsOptions = {
  origin: process.env.BACKEND_URL,
}

app.use(cors(corsOptions))
// parse content-type application/json
app.use(express.json({ limit: '200mb' }))

// parse content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '200mb', extended: true }))

require('./routes/menuitem.routes')(app)
require('./routes/contentitem.routes')(app)
require('./routes/abfuhradressen.routes')(app)
require('./routes/poi.routes')(app)
require('./routes/zonen.routes')(app)
require('./routes/push.routes')(app)
require('./routes/images.routes')(app)
require('./routes/status.routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 80
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

