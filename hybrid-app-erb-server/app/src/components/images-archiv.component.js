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
 


import React, { Component } from 'react'

// View to edit one archived image on which no data except the category can be edited

export default class Image extends Component {
  constructor(props) {
    super(props)
    this.state = null
  }

  componentDidMount = async () => {
    try {
      const response = await fetch(
        `/api/test/images/${this.props.match.params.id}`,
      )
      const img_data = await response.json()
      this.setState(img_data)
    } catch (err) {
      this.setState({ error: err })
    }
  }

  onChange = (prop, e) => {
    this.setState({ [prop]: e.target.value })
  }

  onFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 512_000) {
      alert('Fehler: Maximale Dateigrösse: 500KB')
      return
    }

    const reader = new FileReader()

    const result = await new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e.target.error)

      reader.readAsDataURL(file)
    })

    this.setState({ data: result })
  }

  onSubmit = async () => {
    try {
      const response = await fetch(`/api/test/images/${this.state.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (err) {
      alert(err.message)
      return
    }

    this.props.history.goBack()
  }

  render() {
    if (!this.state) {
      return (
        <div>
          <br />
          <p>Loading...</p>
        </div>
      )
    }

    if (this.state.error) {
      return (
        <div>
          <br />
          <p>{this.state.error}</p>
        </div>
      )
    }

    return (
      <div class="edit-form">
        <h4>Image</h4>
        <img src={this.state.data} alt={this.state.altText} height="400px" />
        <form>
          <div className="form-group">
            <div>
              <label>
                <strong>Name:</strong>
              </label>
              &nbsp;
              {this.state.name}
            </div>
            <div>
              <label>
                <strong>Alternativer Text:</strong>
              </label>
              &nbsp;
              {this.state.altText}
            </div>
            <div>
              <label>
                <strong>Typ:</strong>
              </label>
              &nbsp;
              {this.state.type == 'bild'
                ? 'Bild'
                : this.state.type == 'fotopiktogramm'
                ? 'Fotopiktogramm'
                : 'Vektorpiktogramm'}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="viewCategory">Anzeige Kategorie</label>
            <select
              className="form-control"
              id="viewCategory"
              onChange={this.onChange.bind(this, 'viewCategory')}
            >
              <option
                value="dynamic"
                selected={this.state.viewCategory == 'dynamic'}
              >
                Slider
              </option>
              <option
                value="static"
                selected={this.state.viewCategory == 'static'}
              >
                statisch
              </option>
              <option
                value="archive"
                selected={this.state.viewCategory == 'archive'}
              >
                archiviert
              </option>
            </select>
          </div>
        </form>
        <button
          type="submit"
          className="badge badge-success"
          onClick={this.onSubmit}
        >
          Update
        </button>
        <br />
        <br />
      </div>
    )
  }
}

