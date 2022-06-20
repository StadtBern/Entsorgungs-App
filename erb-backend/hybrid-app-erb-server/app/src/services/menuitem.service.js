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
 


import http from '../http-common'

class MenuItemDataService {
  getAll() {
    return http.get('/menuitem')
  }

  get(id) {
    return http.get(`/menuitem/${id}`)
  }

  create(data) {
    return http.post('/menuitem', data)
  }

  createDataFromFile(data) {
    return http.post('/abfuhradressen', data)
  }

  update(id, data) {
    return http.put(`/menuitem/${id}`, data)
  }

  delete(id) {
    return http.delete(`/menuitem/${id}`)
  }

  deleteAll() {
    return http.delete(`/menuitem`)
  }

  findByName(name) {
    return http.get(`/menuitem?name=${name}`)
  }
}

export default new MenuItemDataService()

