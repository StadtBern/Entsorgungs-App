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
const POI = db.poi
const Op = db.Sequelize.Op

// Create and Save a poi item
exports.create = (req, res) => {
  var tmpArray = []
  if (!(Object.prototype.toString.call(req.body) === '[object Array]')) {
    tmpArray.push(req.body)
  } else {
    tmpArray = req.body
  }
  var poiArray = []
  for (let index = 0; index < tmpArray.length; index++) {
    var item = tmpArray[index]
    // Validate request
    if (!item.PUNKTNAME) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    // Create a poi item
    const poi = {
      RUBRIK: item.RUBRIK,
      TELEFON: item.TELEFON,
      BESCHRIEB: item.BESCHRIEB,
      H_COORD: item.H_COORD,
      V_COORD: item.V_COORD,
      HAUSNUMMER: item.HAUSNUMMER,
      PUNKTNAME: item.PUNKTNAME,
      URL: item.URL,
      EMAIL: item.EMAIL,
      STRASSE: item.STRASSE,
      TYP: item.TYP,
      ORT: item.ORT,
      PLZ: item.PLZ,
      MATERIALIEN: item.MATERIALIEN,
      UID: item.UID,
      QUARTIER: item.QUARTIER,
      coordinates: item.json_geometry
        ? String(item.json_geometry.coordinates)
        : null,
    }
    poiArray.push(poi)
  }

  // Save menu item in the database
  POI.bulkCreate(poiArray, { logging: false })
    .then((result) => {
      res ? res.send(result) : console.log('POI written succeccfully!')
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while creating the poi item.!',
          })
        : console.log(
            err.message || 'Some error occurred while creating the poi item.!',
          )
    })
}

// Get all poi items from the database.
exports.findAll = (req, res) => {
  const PUNKTNAME = req.query.PUNKTNAME
  var condition = PUNKTNAME
    ? { PUNKTNAME: { [Op.like]: `%${PUNKTNAME}%` } }
    : null

  POI.findAll({ where: condition })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while getting poi item.',
      })
    })
}

// Find a single poi item by id
exports.findOne = (req, res) => {
  const id = req.params.id

  POI.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error getting poi item with the id=' + id,
      })
    })
}

// Update a single poi item by id
exports.update = (req, res) => {
  const id = req.params.id

  POI.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'POI item was updated successfully.',
        })
      } else {
        res.send({
          message: 'Cannot update poi item with the id=' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating poi item with the id=' + id,
      })
    })
}

// Delete a single poi item by id
exports.delete = (req, res) => {
  const id = req.params.id

  POI.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'POI item was deleted successfully!',
        })
      } else {
        res.send({
          message: 'Cannot delete poi item with the id=' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete poi item with id=' + id,
      })
    })
}

// Delete all single poi items from the database.
exports.deleteAll = (req, res) => {
  return POI.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res
        ? res.send({ message: `${nums} poi items deleted successfully!` })
        : console.log(`${nums} poi items deleted successfully!`)
      return nums
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while deleting all poi items.',
          })
        : console.log(
            err.message || 'Some error occurred while deleting all poi items.',
          )
    })
}

