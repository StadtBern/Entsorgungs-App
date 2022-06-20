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
 


const crypto = require('crypto')
const { db, db2 } = require('../models')
const Image = db.images

exports.create = async (req, res) => {
  const body = req.body

  // validate body
  if (!body.name) {
    res.status(400).send({
      message: 'Name can not be empty!',
    })
    return
  }

  if (!body.data) {
    res.status(400).send({
      message: 'Data can not be empty!',
    })
    return
  }

  const [contentType, data] = body.data.split(',')

  const img = {
    name: body.name,
    altText: body.altText ?? '',
    data: Buffer.from(data, 'base64'),
    checksum: crypto.createHash('sha256').update(data, 'base64').digest('hex'),
    contentType: contentType,
    type: 'bild',
    viewCategory: 'dynamic',
  }

  let result
  try {
    result = await Image.create(img)
  } catch (err) {
    res.status(500).send({
      message: err.message ?? 'Some error occurred while saving the image!',
    })
    return
  }

  res.status(201).send({
    id: result.id,
    name: result.name,
    altText: result.altText,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    checksum: result.checksum,
    type: result.type,
    viewCategory: result.viewCategory,
  })
}

exports.findAll = async (req, res) => {
  const includeUnused = req ? req.query.includeUnused ?? false : true
  const viewCategory = req
    ? req.query.viewCategory ?? req.query.viewCategory
    : null
  const type = req ? req.query.type : null

  let query = `
        SELECT DISTINCT images.id, images.name, altText, images.createdAt, images.updatedAt, checksum, type, viewCategory
        FROM images
            LEFT JOIN contentitems ON contentitems.imageId = images.id
        WHERE `

  if (!type && !includeUnused && !viewCategory) {
    query += `type != 'bild' OR contentitems.id IS NOT NULL`
  } else if (type) {
    query += `type = '${type}'`
    if (type == 'bild' && !includeUnused) {
      query += ` AND contentitems.id IS NOT NULL`
    }
  } else if (viewCategory) {
    query += `viewCategory = '${viewCategory}'`
  } else {
    // return all images: !type && includeUnused
    query += 'TRUE'
  }

  let result
  try {
    ;[result] = await db.sequelize.query(query)
  } catch (err) {
    res
      ? res.status(500).send({
          message:
            err.message ?? 'Some error occurred while retrieving the images!',
        })
      : console.log(
          err.message || 'Some error occurred while retrieving the images!',
        )
    return
  }
  var output = result.map((img) => {
    return {
      id: img.id,
      name: img.name,
      altText: img.altText,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
      checksum: img.checksum,
      type: img.type,
      viewCategory: img.viewCategory,
    }
  })
  res ? res.send(output) : null
  return output
}

exports.findOne = async (req, res) => {
  const id = req.params.id

  let result
  try {
    result = await Image.findByPk(id)
  } catch (err) {
    res.status(500).send({
      message: err.message ?? 'Some error occurred while retrieving the image!',
    })
    return
  }

  if (!result) {
    res.status(404).send({
      message: `Eintrag mit der id=${id} nicht gefunden.`,
    })
    return
  }

  res.send({
    id: result.id,
    name: result.name,
    altText: result.altText,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    checksum: result.checksum,
    data: `${result.contentType},${result.data.toString('base64')}`,
    type: result.type,
    viewCategory: result.viewCategory,
  })
}

exports.update = async (req, res) => {
  const id = req.params.id
  const body = req.body

  let result
  try {
    const img = await Image.findByPk(id)

    if (!img) {
      res.status(404).send({
        message: `Eintrag mit der id=${id} nicht gefunden.`,
      })
      return
    }

    if (body.data) {
      const [contentType, data] = body.data.split(',')

      img.data = Buffer.from(data, 'base64')
      img.checksum = crypto
        .createHash('sha256')
        .update(data, 'base64')
        .digest('hex')
      img.contentType = contentType
    }

    if (body.altText) {
      img.altText = body.altText
    }

    if (body.name) {
      img.name = body.name
    }

    // validation done by db
    if (body.type) {
      img.type = body.type
    }
    if (body.viewCategory) {
      img.viewCategory = body.viewCategory
    }

    result = await img.save()
  } catch (err) {
    res.status(500).send({
      message: err.message ?? 'Some error occurred while updating the image!',
    })
    return
  }

  res.send({
    id: result.id,
    name: result.name,
    altText: result.altText,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    checksum: result.checksum,
    type: result.type,
    viewCategory: result.viewCategory,
  })
}

exports.sync = async (req, res) => {
  if (!db2) {
    res.send({
      message: 'Synchronisation fehlgeschlagen (No Sync Target specified)',
    })
    return
  }

  const images_prod = db2.images

  await images_prod.destroy({
    where: {},
    truncate: false,
  })

  const images = await Image.findAll({ raw: true })
  await images_prod.bulkCreate(images)

  res.send({
    message: 'Bilder wurden erfolgreich synchronisiert',
  })
}

