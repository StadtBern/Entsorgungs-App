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
 


module.exports = (app) => {
  const abfuhradressen = require('../controllers/abfuhradressen.controller.js')

  var router = require('express').Router()

  // Create a new abfuhradresse item
  router.post('/', abfuhradressen.create)

  // Get all abfuhradresse items
  router.get('/', abfuhradressen.find)

  // Get a single abfuhradresse item by id
  router.get('/:id', abfuhradressen.findOne)

  // Update a abfuhradresse item by id
  router.put('/:id', abfuhradressen.update)

  // Delete a abfuhradresse item by id
  router.delete('/:id', abfuhradressen.delete)

  // Delete all abfuhradresse items
  router.delete('/', abfuhradressen.deleteAll)

  app.use('/api/*/abfuhradressen', router)
}

