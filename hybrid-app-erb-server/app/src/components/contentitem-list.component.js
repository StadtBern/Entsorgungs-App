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
import ContentItemDataService from '../services/contentitem.service'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'

// Page to list all content item

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

export default class ContentItemList extends Component {
  constructor(props) {
    super(props)
    this.onChangeSearchName = this.onChangeSearchName.bind(this)
    this.retrieveContentItem = this.retrieveContentItem.bind(this)
    this.refreshList = this.refreshList.bind(this)
    this.setActiveContentItem = this.setActiveContentItem.bind(this)
    this.fileSelected = this.fileSelected.bind(this)
    this.uploadJsonFile = this.uploadJsonFile.bind(this)
    this.downloadJsonFile = this.downloadJsonFile.bind(this)
    this.searchName = this.searchName.bind(this)

    this.state = {
      sync_modal_open: false,
      remove_modal_open: false,
      status_message: null,
      contentItem: [],
      currentContentItem: null,
      currentIndex: -1,
      searchName: '',
      fileDownloadUrl: '',
      files: '',
      images: null,
    }
  }

  async componentDidMount() {
    this.retrieveContentItem()
    const response = await fetch('/api/test/images?type=bild')
    const images = await response.json()
    this.setState({ images: images })
  }

  onChangeSearchName(e) {
    const searchName = e.target.value

    this.setState({
      searchName: searchName,
    })
  }

  retrieveContentItem() {
    ContentItemDataService.getAll()
      .then((response) => {
        this.setState({
          contentItem: response.data,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  refreshList() {
    this.retrieveContentItem()
    this.setState({
      currentContentItem: null,
      currentIndex: -1,
    })
  }

  setActiveContentItem(contentItem, index) {
    this.setState({
      currentContentItem: contentItem,
      currentIndex: index,
    })
  }

  removeAllContentItem = async () => {
    await ContentItemDataService.deleteAll()
    this.setState({ remove_modal_open: false })
    this.refreshList()
  }

  openSyncModal = () => {
    this.setState({ sync_modal_open: true })
  }

  closeSyncModal = () => {
    this.setState({ sync_modal_open: false })
  }

  syncContentItems = async () => {
    const response = await fetch('/api/test/contentitem/sync')
    const json = await response.json()
    this.setState({
      sync_modal_open: false,
      status_message: json.message,
    })
  }

  openRemoveModal = () => {
    this.setState({ remove_modal_open: true })
  }

  closeRemoveModal = () => {
    this.setState({ remove_modal_open: false })
  }

  searchName() {
    ContentItemDataService.findByName(this.state.searchName)
      .then((response) => {
        this.setState({
          contentItem: response.data,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  fileSelected(e) {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (e) => {
      this.setState({
        files: e.target.result,
      })
    }
  }

  async uploadJsonFile() {
    let uploadJson = JSON.parse(this.state.files)
    var index,
      array,
      limit = 100
    for (index = 0; index < uploadJson.length; index += limit) {
      array = uploadJson.slice(index, index + limit)
      await ContentItemDataService.create(array)
    }
    this.refreshList()
  }

  downloadJsonFile() {
    const blob = new Blob([JSON.stringify(this.state.contentItem, null, 4)])
    this.setState(
      {
        fileDownloadUrl: URL.createObjectURL(blob),
      },
      () => {
        this.dofileDownload.click()
        this.setState({ fileDownloadUrl: '' })
      },
    )
  }

  render() {
    const {
      searchName,
      contentItem,
      currentContentItem,
      currentIndex,
      fileDownloadUrl,
      files,
    } = this.state

    return (
      <>
        <Modal
          isOpen={this.state.sync_modal_open}
          onRequestClose={this.closeSyncModal}
          style={modalStyles}
        >
          <h4>Synchronisieren</h4>
          <p>
            Dieser Vorgang überschreibt alle Contentitems in der produktiven
            App.
            <br />
            Soll der Vorgang fortgesetzt werden?
          </p>
          <div class="d-flex">
            <button
              class="btn btn-success ml-auto"
              onClick={this.syncContentItems}
            >
              Ja
            </button>
            <button class="btn btn-danger ml-2" onClick={this.closeSyncModal}>
              Nein
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.remove_modal_open}
          onRequestClose={this.closeRemoveModal}
          style={modalStyles}
        >
          <h4>Entfernen</h4>
          <p>Wollen Sie wirklich alle Contentitems entfernen?</p>
          <div class="d-flex">
            <button
              class="btn btn-success ml-auto"
              onClick={this.removeAllContentItem}
            >
              Ja
            </button>
            <button class="btn btn-danger ml-2" onClick={this.closeRemoveModal}>
              Nein
            </button>
          </div>
        </Modal>
        <div className="list row">
          <div className="col-md-8">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchName}
                onChange={this.onChangeSearchName}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.searchName}
                >
                  Search
                </button>
              </div>
            </div>
            <Link to={'/addcontent'} className="btn btn-success">
              Add
            </Link>
          </div>
          <div className="col-md-6">
            <h4>Content Items List</h4>

            <ul className="list-group">
              {contentItem &&
                contentItem.map((contentItem, index) => (
                  <li
                    className={
                      'list-group-item ' +
                      (index === currentIndex ? 'active' : '')
                    }
                    style={{ zIndex: 0 }}
                    onClick={() =>
                      this.setActiveContentItem(contentItem, index)
                    }
                    key={index}
                  >
                    {contentItem.name}
                  </li>
                ))}
            </ul>

            <button
              className="m-3 btn btn-sm btn-danger"
              onClick={this.openRemoveModal}
            >
              Remove All
            </button>
          </div>
          <div className="col-md-6">
            {currentContentItem ? (
              <div>
                <h4>Content Item</h4>
                <div>
                  <label>
                    <strong>Name:</strong>
                  </label>{' '}
                  {currentContentItem.name}
                </div>
                <div>
                  <label>
                    <strong>Titel:</strong>
                  </label>{' '}
                  {currentContentItem.title}
                </div>
                <div>
                  <label>
                    <strong>Text:</strong>
                  </label>{' '}
                  {currentContentItem.text}
                </div>
                <div>
                  <label>
                    <strong>Bild:</strong>
                  </label>{' '}
                  {
                    this.state.images?.find(
                      (img) => img.id == currentContentItem.imageId,
                    )?.name
                  }
                  {currentContentItem.imageId
                    ? ` (ID: ${currentContentItem.imageId})`
                    : ' (N/A)'}
                </div>
                <div>
                  <label>
                    <strong>Anzuzeigende Daten:</strong>
                  </label>{' '}
                  {currentContentItem.contentData}
                </div>
                <div>
                  <label>
                    <strong>Sprache:</strong>
                  </label>{' '}
                  {currentContentItem.language}
                </div>
                <div>
                  <label>
                    <strong>Inhalts Typ:</strong>
                  </label>{' '}
                  {currentContentItem.contentType}
                </div>
                <div>
                  <label>
                    <strong>Menu Name:</strong>
                  </label>{' '}
                  {currentContentItem.menuItemName}
                </div>
                <div>
                  <label>
                    <strong>Seiten Typ:</strong>
                  </label>{' '}
                  {currentContentItem.pageType}
                </div>
                <div>
                  <label>
                    <strong>Suchdaten:</strong>
                  </label>{' '}
                  {currentContentItem.searchData}
                </div>
                <div>
                  <label>
                    <strong>Reihenfolge:</strong>
                  </label>{' '}
                  {currentContentItem.position}
                </div>

                <Link
                  to={'/contentitem/' + currentContentItem.id}
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
          <div className="col-md-6">
            <h4>Import / Export</h4>
            <button className="btn btn-success" onClick={this.downloadJsonFile}>
              Inhalt als Datei herunterladen
            </button>
            <a
              style={{ display: 'none' }}
              download={'contentitems.json'}
              href={fileDownloadUrl}
              ref={(e) => (this.dofileDownload = e)}
            >
              download it
            </a>
            <br />
            <br />
            Datei Import:
            <br />
            <input type="file" onChange={this.fileSelected} />
            <br />
            {files ? (
              <div>
                <br />
                <button
                  className="btn btn-success"
                  onClick={this.uploadJsonFile}
                >
                  Datei hochladen
                </button>
              </div>
            ) : (
              <div></div>
            )}
            <br />
            <br />
          </div>
          <div className="col-md-6">
            <h4>Inhalte veröffentlichen</h4>
            <button
              className="m-3 btn btn-sm btn-danger"
              onClick={this.openSyncModal}
            >
              MoveTestToProd
            </button>
            {this.state.status_message && (
              <div>{this.state.status_message}</div>
            )}
          </div>
        </div>
      </>
    )
  }
}

