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
import MenuItemDataService from '../services/menuitem.service'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'

// Page to list all menu items

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

export default class MenuItemList extends Component {
  constructor(props) {
    super(props)
    this.onChangeSearchName = this.onChangeSearchName.bind(this)
    this.retrieveMenuItem = this.retrieveMenuItem.bind(this)
    this.refreshList = this.refreshList.bind(this)
    this.setActiveMenuItem = this.setActiveMenuItem.bind(this)
    this.fileSelected = this.fileSelected.bind(this)
    this.uploadJsonFile = this.uploadJsonFile.bind(this)
    this.downloadJsonFile = this.downloadJsonFile.bind(this)
    this.searchName = this.searchName.bind(this)

    this.state = {
      sync_modal_open: false,
      remove_modal_open: false,
      status_message: null,
      menuItem: [],
      currentMenuItem: null,
      currentIndex: -1,
      searchName: '',
      fileDownloadUrl: '',
      files: '',
    }
  }

  componentDidMount() {
    this.retrieveMenuItem()
  }

  onChangeSearchName(e) {
    const searchName = e.target.value

    this.setState({
      searchName: searchName,
    })
  }

  retrieveMenuItem() {
    MenuItemDataService.getAll()
      .then((response) => {
        this.setState({
          menuItem: response.data,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  refreshList() {
    this.retrieveMenuItem()
    this.setState({
      currentMenuItem: null,
      currentIndex: -1,
    })
  }

  setActiveMenuItem(menuItem, index) {
    this.setState({
      currentMenuItem: menuItem,
      currentIndex: index,
    })
  }

  removeAllMenuItem = async () => {
    await MenuItemDataService.deleteAll()
    this.setState({ remove_modal_open: false })
    this.refreshList()
  }

  openSyncModal = () => {
    this.setState({ sync_modal_open: true })
  }

  closeSyncModal = () => {
    this.setState({ sync_modal_open: false })
  }

  syncMenuItems = async () => {
    const response = await fetch('/api/test/menuitem/sync')
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
    MenuItemDataService.findByName(this.state.searchName)
      .then((response) => {
        this.setState({
          menuItem: response.data,
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
      await MenuItemDataService.create(array)
    }
    this.refreshList()
  }

  downloadJsonFile() {
    const blob = new Blob([JSON.stringify(this.state.menuItem, null, 4)])
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
      menuItem,
      currentMenuItem,
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
            Dieser Vorgang überschreibt alle Menuitems in der produktiven App.
            <br />
            Soll der Vorgang fortgesetzt werden?
          </p>
          <div class="d-flex">
            <button
              class="btn btn-success ml-auto"
              onClick={this.syncMenuItems}
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
          <p>Wollen Sie wirklich alle Menuitems entfernen?</p>
          <div class="d-flex">
            <button
              class="btn btn-success ml-auto"
              onClick={this.removeAllMenuItem}
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
            <Link to={'/add'} className="btn btn-success">
              Add
            </Link>
          </div>
          <div className="col-md-6">
            <h4>Menu Items List</h4>

            <ul className="list-group">
              {menuItem &&
                menuItem.map((menuItem, index) => (
                  <li
                    className={
                      'list-group-item ' +
                      (index === currentIndex ? 'active' : '')
                    }
                    style={{ zIndex: 0 }}
                    onClick={() => this.setActiveMenuItem(menuItem, index)}
                    key={index}
                  >
                    {menuItem.name}
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
            {currentMenuItem ? (
              <div>
                <h4>Menu Item</h4>
                <div>
                  <label>
                    <strong>Name:</strong>
                  </label>{' '}
                  {currentMenuItem.name}
                </div>
                <div>
                  <label>
                    <strong>Titel:</strong>
                  </label>{' '}
                  {currentMenuItem.title}
                </div>
                <div>
                  <label>
                    <strong>Daten:</strong>
                  </label>{' '}
                  {currentMenuItem.data}
                </div>
                <div>
                  <label>
                    <strong>Icon:</strong>
                  </label>{' '}
                  {currentMenuItem.icon}
                </div>
                <div>
                  <label>
                    <strong>Kategorie:</strong>
                  </label>{' '}
                  {currentMenuItem.category}
                </div>
                <div>
                  <label>
                    <strong>Seiten Typ:</strong>
                  </label>{' '}
                  {currentMenuItem.pageType}
                </div>
                <div>
                  <label>
                    <strong>Sprache:</strong>
                  </label>{' '}
                  {currentMenuItem.language}
                </div>
                <div>
                  <label>
                    <strong>Reihenfolge:</strong>
                  </label>{' '}
                  {currentMenuItem.position}
                </div>
                <div>
                  <label>
                    <strong>Platzhalter im Eingabefeld:</strong>
                  </label>{' '}
                  {currentMenuItem.inputPlaceHolder}
                </div>
                <div>
                  <label>
                    <strong>Sortierung nach Alphabet:</strong>
                  </label>{' '}
                  {currentMenuItem.sortByAbc}
                </div>
                <Link
                  to={'/menuitem/' + currentMenuItem.id}
                  className="badge badge-warning"
                >
                  Edit
                </Link>
              </div>
            ) : (
              <div>
                <br />
                <p>Please click on a MenuItem...</p>
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
              download={'menuitems.json'}
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

