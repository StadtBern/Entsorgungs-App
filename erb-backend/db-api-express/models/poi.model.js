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
 


module.exports = (sequelize, Sequelize) => {
  const POI = sequelize.define('poi', {
    RUBRIK: {
      type: Sequelize.STRING,
    },
    TELEFON: {
      type: Sequelize.STRING,
    },
    BESCHRIEB: {
      type: Sequelize.STRING,
    },
    H_COORD: {
      type: Sequelize.DOUBLE,
    },
    V_COORD: {
      type: Sequelize.DOUBLE,
    },
    HAUSNUMMER: {
      type: Sequelize.STRING,
    },
    PUNKTNAME: {
      type: Sequelize.STRING,
    },
    URL: {
      type: Sequelize.STRING,
    },
    EMAIL: {
      type: Sequelize.STRING,
    },
    STRASSE: {
      type: Sequelize.STRING,
    },
    TYP: {
      type: Sequelize.STRING,
    },
    ORT: {
      type: Sequelize.STRING,
    },
    PLZ: {
      type: Sequelize.INTEGER,
    },
    MATERIALIEN: {
      type: Sequelize.STRING,
    },
    UID: {
      type: Sequelize.STRING,
    },
    QUARTIER: {
      type: Sequelize.STRING,
    },
    coordinates: {
      type: Sequelize.STRING,
    },
  })

  return POI
}

