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
import { Link } from 'react-router-dom'
import Modal from 'react-modal'

// Page to list all active images on which all data except the ID can be edited

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export default class ImagesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal_open: false,
      status_message: null,
      current_image: null,
      current_index: -1,
      images: [],
      file: null,
    }
  }

  componentDidMount = async () => {
    const response = await fetch('/api/test/images?viewCategory=dynamic')
    const images = await response.json()
    this.setState({ images: images })
  }

  onFileChange = (e) => {
    this.setState({ file: e.target.files[0] })
  }

  addImage = async (e) => {
    if (!this.state.file) return
    if (this.state.file.size > 512_000) {
      alert('Fehler: Maximale Dateigrösse: 500KB')
      return
    }

    const reader = new FileReader()
    const result = await new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e.target.error)

      reader.readAsDataURL(this.state.file)
    })

    const response = await fetch('/api/test/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.file.name,
        data: result,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      alert(error.message)
      return
    }

    const img = await response.json()
    this.setState({ images: [...this.state.images, img], file: null })
  }

  setActiveImage = async (id, index) => {
    const response = await fetch(`/api/test/images/${id}`)
    const img_data = await response.json()
    this.setState({
      current_image: img_data,
      current_index: index,
    })
  }

  openModal = () => {
    this.setState({ modal_open: true })
  }

  closeModal = () => {
    this.setState({ modal_open: false })
  }

  syncImages = async () => {
    const response = await fetch('/api/test/images/sync')
    const json = await response.json()
    this.setState({
      modal_open: false,
      status_message: json.message,
    })
  }

  render() {
    const {
      images,
      current_image,
      current_index,
      modal_open,
      status_message,
    } = this.state

    return (
      <>
        <Modal
          isOpen={modal_open}
          onRequestClose={this.closeModal}
          style={modalStyles}
        >
          <h4>Synchronisieren</h4>
          <p>
            Dieser Vorgang überschreibt alle Bilder in der produktiven App.
            <br />
            Soll der Vorgang fortgesetzt werden?
          </p>
          <div class="d-flex">
            <button class="btn btn-success ml-auto" onClick={this.syncImages}>
              Ja
            </button>
            <button class="btn btn-danger ml-2" onClick={this.closeModal}>
              Nein
            </button>
          </div>
        </Modal>
        <div class="row mb-2">
          <h4>Bilder Slider</h4>
        </div>
        <div class="row mb-2">
          <div class="col">
            <input
              id="fileAddImage"
              type="file"
              accept="image/*"
              onChange={this.onFileChange}
            />
            <button class="btn btn-success ml-auto" onClick={this.addImage}>
              Hinzufügen
            </button>
          </div>
        </div>
        <div class="row mb-2">
          <ul className="list-group col-md-6">
            {images &&
              images.map((img, index) => (
                <li
                  className={`list-group-item ${
                    index == current_index ? 'active' : ''
                  }`}
                  style={{ zIndex: 0 }}
                  onClick={this.setActiveImage.bind(this, img.id, index)}
                >
                  {img.name}
                </li>
              ))}
          </ul>
          <div class="col-md-6">
            {current_image ? (
              <div>
                <div>
                  <img
                    src={current_image.data}
                    alt={current_image.altText}
                    height="400px"
                  />
                </div>
                <div>
                  <label>
                    <strong>Name:</strong>
                  </label>
                  &nbsp;
                  {current_image.name}
                </div>
                <div>
                  <label>
                    <strong>Alternativer Text:</strong>
                  </label>
                  &nbsp;
                  {current_image.altText}
                </div>
                <div>
                  <label>
                    <strong>Typ:</strong>
                  </label>
                  &nbsp;
                  {current_image.type == 'bild'
                    ? 'Bild'
                    : current_image.type == 'fotopiktogramm'
                    ? 'Fotopiktogramm'
                    : 'Vektorpiktogramm'}
                </div>
                <div>
                  <label>
                    <strong>Anzeige Kategorie:</strong>
                  </label>
                  &nbsp;
                  {current_image.viewCategory == 'dynamic'
                    ? 'Slider'
                    : current_image.viewCategory == 'static'
                    ? 'statisch'
                    : 'archiviert'}
                </div>
                <Link
                  to={`/images/${current_image.id}`}
                  className="badge badge-warning"
                >
                  Edit
                </Link>
              </div>
            ) : (
              <div>
                <br />
                <p>Please click on a ContentItem...</p>
              </div>
            )}
          </div>
        </div>
        <div class="row mb-2">
          <div className="col-md-6">
            <h4>Inhalte veröffentlichen</h4>
            <button
              className="m-3 btn btn-sm btn-danger"
              onClick={this.openModal}
            >
              MoveTestToProd
            </button>
            {status_message && <div>{status_message}</div>}
          </div>
        </div>
      </>
    )
  }
}

