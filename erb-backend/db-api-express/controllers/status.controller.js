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
const ContentItem = db.contentitem

exports.get = async (req, res) => {
  let message = null,
    status = 200

  try {
    const msg = await ContentItem.findOne({
      where: {
        contentType: 'StatusMessage',
      },
    })

    message = msg?.text ?? null
  } catch (err) {
    status = 500
    message = 'Backend currently unavailable'
  }

  res.status(status).send({
    message: message,
  })
}

