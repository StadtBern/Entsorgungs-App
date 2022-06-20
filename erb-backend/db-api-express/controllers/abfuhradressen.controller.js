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
const Abfuhradressen = db.abfuhradressen
const Op = db.Sequelize.Op

// Create and Save a new abfuhradresse item
exports.create = (req, res) => {
  var tmpArray = []
  if (!(Object.prototype.toString.call(req.body) === '[object Array]')) {
    tmpArray.push(req.body)
  } else {
    tmpArray = req.body
  }
  var abfuhradressenArray = []
  for (let index = 0; index < tmpArray.length; index++) {
    var item = tmpArray[index]
    // Validate request
    if (!item.STRASSENNAME) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    // Create a poi item
    const abfuhradressen = {
      UID: item.UID,
      STRASSENNAME: item.STRASSENNAME,
      HAUSNUMMER: item.HAUSNUMMER,
      FLAECHENAME: item.FLAECHENAME,
      H_COORD: item.H_COORD,
      V_COORD: item.V_COORD,
      Zone: item.Zone,
      coordinates: item.json_geometry
        ? String(item.json_geometry.coordinates)
        : null,
    }
    abfuhradressenArray.push(abfuhradressen)
  }

  // Save menu item in the database
  Abfuhradressen.bulkCreate(abfuhradressenArray, { logging: false })
    .then((result) => {
      res ? res.send(result) : console.log('Adressen written succeccfully!') //result)
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while creating the abfuhradressen item.!',
          })
        : console.log(
            err.message ||
              'Some error occurred while creating the abfuhradressen item.!',
          )
    })
}

// Get all abfuhradresse items from the database with paging.
exports.find = (req, res) => {
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 0
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 100
  const offset = page * limit

  const STRASSENNAME = req.query.STRASSENNAME
  var condition = STRASSENNAME
    ? { STRASSENNAME: { [Op.like]: `%${STRASSENNAME}%` } }
    : null

  Abfuhradressen.findAndCountAll({
    limit: limit,
    offset: offset,
    where: condition,
  })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while getting all abfuhradresse items.',
      })
    })
}

// Get all abfuhradresse items from the database.
exports.findAll = (req, res) => {
  const STRASSENNAME = req.query.STRASSENNAME
  var condition = STRASSENNAME
    ? { STRASSENNAME: { [Op.like]: `%${STRASSENNAME}%` } }
    : null

  Abfuhradressen.findAll({ where: condition })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while getting all abfuhradresse items.',
      })
    })
}

// Find a single abfuhradresse item by id
exports.findOne = (req, res) => {
  const id = req.params.id

  Abfuhradressen.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error getting abfuhradresse item with id=' + id,
      })
    })
}

// Update a abfuhradresse item by id
exports.update = (req, res) => {
  const id = req.params.id

  Abfuhradressen.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Abfuhradresse item was updated successfully.',
        })
      } else {
        res.send({
          message: 'Cannot update abfuhradresse item with the id=' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating abfuhradresse item with the id=' + id,
      })
    })
}

// Delete a abfuhradresse item by id
exports.delete = (req, res) => {
  const id = req.params.id

  Abfuhradressen.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Abfuhradresse item was deleted successfully!',
        })
      } else {
        res.send({
          message: 'Cannot delete abfuhradresse item with the id=' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete abfuhradresse item with the id=' + id,
      })
    })
}

// Delete all abfuhradresse items from the database.
exports.deleteAll = (req, res) => {
  return Abfuhradressen.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res
        ? res.send({
            message: `${nums} abfuhradresse items deleted successfully!`,
          })
        : console.log(`${nums} abfuhradresse items deleted successfully!`)
      return nums
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while deleting all abfuhradresse items.',
          })
        : console.log(
            err.message ||
              'Some error occurred while deleting all abfuhradresse items.',
          )
    })
}

