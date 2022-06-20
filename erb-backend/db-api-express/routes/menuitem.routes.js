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
  const menuitem = require('../controllers/menuitem.controller.js')

  var router = require('express').Router()

  // Create a new menu item
  router.post('/', menuitem.create)

  // Get all menu items
  router.get('/', menuitem.findAll)

  // Get a single menu item by id
  router.get('/:id(\\d+)', menuitem.findOne)

  // Update a menu item by id
  router.put('/:id', menuitem.update)

  // Delete a menu item by id
  router.delete('/:id', menuitem.delete)

  // Delete all menu items
  router.delete('/', menuitem.deleteAll)

  // sync test to prod
  router.get('/sync', menuitem.sync)

  app.use('/api/*/menuitem', router)
}

