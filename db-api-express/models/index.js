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
 


const dbConfig = require('../config/db.config.js')
const Sequelize = require('sequelize')

const images = require('./images.model.js')
const menuitems = require('./menuitem.model.js')
const contentitems = require('./contentitem.model.js')
const abfuhradressen = require('./abfuhradressen.model.js')
const pois = require('./poi.model.js')
const zonen = require('./zonen.model.js')

// connect to test db
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// Include the different models
db.images = images(sequelize, Sequelize)
db.menuitem = menuitems(sequelize, Sequelize)
db.contentitem = contentitems(sequelize, Sequelize, db.images)
db.abfuhradressen = abfuhradressen(sequelize, Sequelize)
db.poi = pois(sequelize, Sequelize)
db.zonen = zonen(sequelize, Sequelize)

module.exports.db = db

// connect to prod db if present
if (dbConfig.DB2) {
  const db2 = {}

  const sequelize2 = new Sequelize(
    dbConfig.DB2,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      operatorsAliases: false,

      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
      },
    },
  )

  db2.Sequelize = Sequelize
  db2.sequelize = sequelize2

  // Include the different models
  db2.images = images(sequelize2, Sequelize)
  db2.menuitem = menuitems(sequelize2, Sequelize)
  db2.contentitem = contentitems(sequelize2, Sequelize, db2.images)
  db2.abfuhradressen = abfuhradressen(sequelize2, Sequelize)
  db2.poi = pois(sequelize2, Sequelize)
  db2.zonen = zonen(sequelize2, Sequelize)

  module.exports.db2 = db2
}

