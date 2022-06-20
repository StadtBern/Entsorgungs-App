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

class ContentItemDataService {
  getAll() {
    return http.get('/contentitem')
  }

  get(id) {
    return http.get(`/contentitem/${id}`)
  }

  create(data) {
    return http.post('/contentitem', data)
  }

  update(id, data) {
    return http.put(`/contentitem/${id}`, data)
  }

  delete(id) {
    return http.delete(`/contentitem/${id}`)
  }

  deleteAll() {
    return http.delete(`/contentitem`)
  }

  findByName(name) {
    return http.get(`/contentitem?name=${name}`)
  }
}

export default new ContentItemDataService()

