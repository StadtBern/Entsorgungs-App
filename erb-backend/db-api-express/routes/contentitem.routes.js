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
  const contentitem = require('../controllers/contentitem.controller.js')

  var router = require('express').Router()

  // Create a new content item
  router.post('/', contentitem.create)

  // Get all content items
  router.get('/', contentitem.findAll)

  // Get a single content item by id
  router.get('/:id(\\d+)', contentitem.findOne)

  // Update a content item by id
  router.put('/:id', contentitem.update)

  // Delete a content item by id
  router.delete('/:id', contentitem.delete)

  // Delete all content items
  router.delete('/', contentitem.deleteAll)

  // sync test to prod
  router.get('/sync', contentitem.sync)

  app.use('/api/*/contentitem', router)
}

