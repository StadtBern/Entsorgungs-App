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
 


module.exports = (sequelize, Sequelize, Image) => {
  const ContentItem = sequelize.define('contentitem', {
    name: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    text: {
      type: Sequelize.TEXT,
    },
    contentData: {
      type: Sequelize.STRING,
    },
    language: {
      type: Sequelize.STRING,
    },
    contentType: {
      type: Sequelize.STRING,
    },
    menuItemName: {
      type: Sequelize.STRING,
    },
    pageType: {
      type: Sequelize.STRING,
    },
    searchData: {
      type: Sequelize.STRING,
    },
    position: {
      type: Sequelize.INTEGER,
    },
  })

  // 1:N relation
  Image.hasMany(ContentItem)
  ContentItem.belongsTo(Image)

  return ContentItem
}

