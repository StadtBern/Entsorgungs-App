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
 


const { db } = require('../models')
const ZonenItem = db.zonen
const Op = db.Sequelize.Op

// Create and Save a zonen item
exports.create = (req, res) => {
  var tmpArray = []
  if (!(Object.prototype.toString.call(req.body) === '[object Array]')) {
    tmpArray.push(req.body)
  } else {
    tmpArray = req.body
  }
  var zonenArray = []
  for (let index = 0; index < tmpArray.length; index++) {
    var item = tmpArray[index]
    // Validate request
    if (!item.Zone) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    // Create a poi item
    const zonenitem = {
      Zone: item.Zone,
      Bereitstellung: item.Bereitstellung,
      Hauskehricht_und_brennbares_Kleinsperrgut:
        item['Hauskehricht und brennbares Kleinsperrgut'],
      Papier_und_Karton: item['Papier und Karton'],
      Gruengut: item['Grüngut'],
    }
    zonenArray.push(zonenitem)
  }

  // Save menu item in the database
  ZonenItem.bulkCreate(zonenArray, { logging: false })
    .then((result) => {
      res ? res.send(result) : console.log('Zonen written succeccfully!')
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while creating the zonen item.!',
          })
        : console.log(
            err.message ||
              'Some error occurred while creating the zonen item.!',
          )
    })
}

// Get all zonen items from the database.
exports.findAll = (req, res) => {
  const Zone = req.query.Zone
  var condition = Zone ? { Zone: { [Op.like]: `%${Zone}%` } } : null

  ZonenItem.findAll({ where: condition })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while getting zonen item.',
      })
    })
}

// Find a single zonen item by id
exports.findOne = (req, res) => {
  const id = req.params.id

  ZonenItem.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error getting zonen item with the id=' + id,
      })
    })
}

// Update a single zonen item by id
exports.update = (req, res) => {
  const id = req.params.id

  ZonenItem.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Zonen item was updated successfully.',
        })
      } else {
        res.send({
          message: 'Cannot update zonen item with the id=' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating zonen item with the id=' + id,
      })
    })
}

// Delete a single zonen item by id
exports.delete = (req, res) => {
  const id = req.params.id

  ZonenItem.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Zonen item was deleted successfully!',
        })
      } else {
        res.send({
          message: 'Cannot delete zonen item with the id=' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete zonen item with id=' + id,
      })
    })
}

// Delete all single zonen items from the database.
exports.deleteAll = (req, res) => {
  return ZonenItem.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res
        ? res.send({ message: `${nums} zonen items deleted successfully!` })
        : console.log(`${nums} zonen items deleted successfully!`)
      return nums
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while deleting all zonen items.',
          })
        : console.log(
            err.message ||
              'Some error occurred while deleting all zonen items.',
          )
    })
}

