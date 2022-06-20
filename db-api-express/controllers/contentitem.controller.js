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
const ContentItem = db.contentitem
const Op = db.Sequelize.Op

// Create and Save a content item
exports.create = (req, res) => {
  var tmpArray = []
  if (!(Object.prototype.toString.call(req.body) === '[object Array]')) {
    tmpArray.push(req.body)
  } else {
    tmpArray = req.body
  }
  var contentItemsArray = []
  for (let index = 0; index < tmpArray.length; index++) {
    var item = tmpArray[index]
    // Validate request
    if (!item.name) {
      res
        ? res.status(400).send({
            message: 'Content can not be empty!',
          })
        : console.log(err.message || 'Content can not be empty!')
      return
    }
    // Create a content item
    const contentitem = {
      name: item.name,
      title: item.title,
      text: item.text,
      imageId: !item.imageId || item.imageId == -1 ? null : item.imageId,
      contentData: item.contentData,
      language: item.language,
      contentType: item.contentType,
      menuItemName: item.menuItemName,
      pageType: item.pageType,
      searchData: item.searchData,
      position: item.position,
    }
    contentItemsArray.push(contentitem)
  }

  // Save menu item in the database
  ContentItem.bulkCreate(contentItemsArray)
    .then((result) => {
      res
        ? res.send(result)
        : console.log('Content Items written succeccfully!')
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while creating the content item!',
          })
        : console.log(
            err.message ||
              'Some error occurred while creating the content item!',
          )
    })
}

// Get all content items from the database.
exports.findAll = (req, res) => {
  const name = req ? req.query.name : null
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null

  return ContentItem.findAll({ where: condition })
    .then((data) => {
      res ? res.send(data) : null
      return data
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message || 'Some error occurred while getting content item.',
          })
        : console.log(
            err.message || 'Some error occurred while getting content item.',
          )
    })
}

// Find a single content item by id
exports.findOne = (req, res) => {
  const id = req.params.id

  ContentItem.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error getting content item with the id=' + id,
      })
    })
}

// Update a single content item by id
exports.update = (req, res) => {
  const id = req.params.id

  if (!req.body.imageId || req.body.imageId == -1) {
    req.body.imageId = null
  }

  ContentItem.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'content item was updated successfully.',
        })
      } else {
        res.send({
          message: 'Cannot update content item with the id=' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating content item with the id=' + id,
      })
    })
}

// Delete a single content item by id
exports.delete = (req, res) => {
  const id = req.params.id

  ContentItem.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res
          ? res.send({
              message: 'Content item was deleted successfully!',
            })
          : console.log('Content item was deleted successfully!')
      } else {
        res
          ? res.send({
              message: 'Cannot delete content item with the id=' + id,
            })
          : console.log('Cannot delete content item with the id=' + id)
      }
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message: 'Could not delete content item with id=' + id,
          })
        : console.log('Cannot delete content item with the id=' + id)
    })
}

// Delete all single content items from the database.
exports.deleteAll = (req, res) => {
  ContentItem.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res
        ? res.send({ message: `${nums} content items deleted successfully!` })
        : console.log(`${nums} content items deleted successfully!`)
    })
    .catch((err) => {
      res
        ? res.status(500).send({
            message:
              err.message ||
              'Some error occurred while deleting all content items.',
          })
        : console.log(
            err.message ||
              'Some error occurred while deleting all content items.',
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

  const content_items_prod = db2.contentitem

  await content_items_prod.destroy({
    where: {},
    truncate: false,
  })
  const content_items = await ContentItem.findAll({ raw: true })
  await content_items_prod.bulkCreate(content_items)

  res.send({
    message: 'Contentitems wurden erfolgreich synchronisiert',
  })
}

