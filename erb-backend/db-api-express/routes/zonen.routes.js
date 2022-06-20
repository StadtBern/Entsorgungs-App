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
  const zonen = require('../controllers/zonen.controller.js')

  var router = require('express').Router()

  // Create a new zonen item
  router.post('/', zonen.create)

  // Get all zonen items
  router.get('/', zonen.findAll)

  // Get a single zonen item by id
  router.get('/:id', zonen.findOne)

  // Update a zonen item by id
  router.put('/:id', zonen.update)

  // Delete a zonen item by id
  router.delete('/:id', zonen.delete)

  // Delete all zonen items
  router.delete('/', zonen.deleteAll)

  app.use('/api/*/zonen', router)
}

