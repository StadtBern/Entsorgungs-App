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
 


const { db, db2 } = require('../models')
const MenuItem = db.menuitem
const Op = db.Sequelize.Op

// Create and Save a menu item
exports.create = async (req, res) => {
  var tmpArray = []
  if (!(Object.prototype.toString.call(req.body) === '[object Array]')) {
    tmpArray.push(req.body)
  } else {
    tmpArray = req.body
  }
  var menuItemsArray = []
  for (let index = 0; index < tmpArray.length; index++) {
    var item = tmpArray[index]
    // Validate request
    if (!item.name) {
      res
        ? res.status(400).send({
            message: err.message || 'Content can not be empty!',
          })
        : console.log(err.message || 'Content can not be empty!')
      return
    }
    // Create a menu item
    const menuitem = {
      name: item.name,
      title: item.title,
      data: item.data,
      icon: item.icon,
      category: item.category,
      pageType: item.pageType,
      language: item.language,
      position: item.position,
      inputPlaceHolder: item.inputPlaceHolder,
      sortByAbc: item.sortByAbc,
    }
    menuItemsArray.push(menuitem)
  }

  // Save menu item in the database
  MenuItem.bulkCreate(menuItemsArray)
    .then((result) => {
      res ? res.send(result) : console.log('Menu Items written succeccfully!')
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while creating the menu item!',
          })
        : console.log(
            err.message || 'Some error occurred while creating the menu item!',
          )
    })
}

// Get all menu items from the database.
exports.findAll = (req, res) => {
  const name = req ? req.query.name : null
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null

  return MenuItem.findAll({ where: condition })
    .then((data) => {
      res ? res.send(data) : null
      return data
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message || 'Some error occurred while getting menu item.',
          })
        : console.log(
            err.message || 'Some error occurred while getting menu item.',
          )
    })
}

// Find a single menu item by id
exports.findOne = (req, res) => {
  const id = req.params.id

  MenuItem.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error getting menu item with the id=' + id,
      })
    })
}

// Update a single menu item by id
exports.update = (req, res) => {
  const id = req.params.id

  MenuItem.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Menu item was updated successfully.',
        })
      } else {
        res.send({
          message: 'Cannot update menu item with the id=' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating menu item with the id=' + id,
      })
    })
}

// Delete a single menu item by id
exports.delete = (req, res) => {
  const id = req.params.id

  MenuItem.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res
          ? res.send({
              message: 'Menu item was deleted successfully!',
            })
          : console.log('Menu item was deleted successfully!')
      } else {
        res
          ? res.send({
              message: 'Cannot delete menu item with the id=' + id,
            })
          : console.log('Cannot delete menu item with the id=' + id)
      }
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message: 'Could not delete menu item with id=' + id,
          })
        : console.log('Cannot delete menu item with the id=' + id)
    })
}

// Delete all menu items from the database.
exports.deleteAll = (req, res) => {
  MenuItem.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res
        ? res.send({ message: `${nums} menu items deleted successfully!` })
        : console.log(`${nums} menu items deleted successfully!`)
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while deleting all menu items.',
          })
        : console.log(
            err.message || 'Some error occurred while deleting all menu items.',
          )
    })
}

exports.sync = async (req, res) => {
  if (!db2) {
    res.send({
      message: 'Synchronisation fehlgeschlagen (No Sync Target specified)',
    })
    return
  }

  const menu_items_prod = db2.menuitem

  await menu_items_prod.destroy({
    where: {},
    truncate: false,
  })
  const menu_items = await MenuItem.findAll({ raw: true })
  await menu_items_prod.bulkCreate(menu_items)

  res.send({
    message: 'Menuitems wurden erfolgreich synchronisiert',
  })
}

