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

// View to edit one menu item

export default class MenuItem extends Component {
  constructor(props) {
    super(props)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeData = this.onChangeData.bind(this)
    this.onChangeIcon = this.onChangeIcon.bind(this)
    this.onChangeCategory = this.onChangeCategory.bind(this)
    this.onChangePageType = this.onChangePageType.bind(this)
    this.onChangeLanguage = this.onChangeLanguage.bind(this)
    this.onChangePosition = this.onChangePosition.bind(this)
    this.onChangeInputPlaceHolder = this.onChangeInputPlaceHolder.bind(this)
    this.onChangeSortByAbc = this.onChangeSortByAbc.bind(this)

    this.getMenuItem = this.getMenuItem.bind(this)
    this.updateMenuItem = this.updateMenuItem.bind(this)
    this.deleteMenuItem = this.deleteMenuItem.bind(this)

    this.state = {
      currentMenuItem: {
        id: null,
        name: '',
        title: '',
        data: '',
        icon: '',
        category: '',
        pageType: '',
        language: '',
        position: '',
        inputPlaceHolder: '',
        sortByAbc: '',
      },
      message: '',
    }
  }

  componentDidMount() {
    this.getMenuItem(this.props.match.params.id)
  }

  onChangeName(e) {
    const name = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        name: name,
      },
    }))
  }
  onChangeTitle(e) {
    const title = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        title: title,
      },
    }))
  }
  onChangeData(e) {
    const data = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        data: data,
      },
    }))
  }
  onChangeIcon(e) {
    const icon = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        icon: icon,
      },
    }))
  }
  onChangeCategory(e) {
    const category = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        category: category,
      },
    }))
  }
  onChangePageType(e) {
    const pageType = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        pageType: pageType,
      },
    }))
  }
  onChangeLanguage(e) {
    const language = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        language: language,
      },
    }))
  }
  onChangePosition(e) {
    const position = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        position: position,
      },
    }))
  }
  onChangeInputPlaceHolder(e) {
    const inputPlaceHolder = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        inputPlaceHolder: inputPlaceHolder,
      },
    }))
  }
  onChangeSortByAbc(e) {
    const sortByAbc = e.target.value

    this.setState((prevState) => ({
      currentMenuItem: {
        ...prevState.currentMenuItem,
        sortByAbc: sortByAbc,
      },
    }))
  }

  getMenuItem(id) {
    MenuItemDataService.get(id)
      .then((response) => {
        this.setState({
          currentMenuItem: response.data,
        })
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  updateMenuItem() {
    MenuItemDataService.update(
      this.state.currentMenuItem.id,
      this.state.currentMenuItem,
    )
      .then((response) => {
        console.log(response.data)
        this.setState({
          message: 'The menu item was updated successfully!',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  deleteMenuItem() {
    MenuItemDataService.delete(this.state.currentMenuItem.id)
      .then((response) => {
        console.log(response.data)
        this.props.history.push('/menuitem')
      })
      .catch((e) => {
        console.log(e)
      })
  }

  render() {
    const { currentMenuItem } = this.state

    return (
      <div>
        {currentMenuItem ? (
          <div className="edit-form">
            <h4>Menu Item</h4>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={currentMenuItem.name}
                  onChange={this.onChangeName}
                  name="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentMenuItem.title}
                  onChange={this.onChangeTitle}
                  name="title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="data">Daten</label>
                <input
                  type="text"
                  className="form-control"
                  id="data"
                  value={currentMenuItem.data}
                  onChange={this.onChangeData}
                  name="data"
                />
              </div>
              <div className="form-group">
                <label htmlFor="icon">Icon</label>
                <select
                  id="icon"
                  name="icon"
                  className="form-control"
                  required
                  onChange={this.onChangeIcon}
                >
                  <option value="">- Auswählen -</option>
                  <option value="ABC" selected={currentMenuItem.icon == 'ABC'}>
                    ABC
                  </option>
                  <option
                    value="Abfuhr"
                    selected={currentMenuItem.icon == 'Abfuhr'}
                  >
                    Abfuhr
                  </option>
                  <option
                    value="Entsorgungshof"
                    selected={currentMenuItem.icon == 'Entsorgungshof'}
                  >
                    Entsorgungshof
                  </option>
                  <option
                    value="Home"
                    selected={currentMenuItem.icon == 'Home'}
                  >
                    Home
                  </option>
                  <option
                    value="OekoInfoMobil"
                    selected={currentMenuItem.icon == 'OekoInfoMobil'}
                  >
                    OekoInfoMobil
                  </option>
                  <option
                    value="Sammelstellen"
                    selected={currentMenuItem.icon == 'Sammelstellen'}
                  >
                    Sammelstellen
                  </option>
                  <option
                    value="Settings"
                    selected={currentMenuItem.icon == 'Settings'}
                  >
                    Settings
                  </option>
                  <option
                    value="Info"
                    selected={currentMenuItem.icon == 'Info'}
                  >
                    Info
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="category">Kategorie</label>
                <select
                  className="form-control"
                  id="category"
                  value={currentMenuItem.category}
                  onChange={this.onChangeCategory}
                >
                  <option value="">- Auswählen -</option>
                  <option
                    value="MenuBottom"
                    selected={this.state.pageType == 'MenuBottom'}
                  >
                    MenuBottom
                  </option>
                  <option value="Menu" selected={this.state.pageType == 'Menu'}>
                    Menu
                  </option>
                  <option
                    value="OverlayMenu"
                    selected={this.state.pageType == 'OverlayMenu'}
                  >
                    OverlayMenu
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pageType">Seiten Typ</label>
                <select
                  className="form-control"
                  id="pageType"
                  value={currentMenuItem.pageType}
                  onChange={this.onChangePageType}
                >
                  <option value="">- Auswählen -</option>
                  <option value="Home" selected={this.state.pageType == 'Home'}>
                    Home
                  </option>
                  <option
                    value="Search"
                    selected={this.state.pageType == 'Search'}
                  >
                    Search
                  </option>
                  <option
                    value="Details"
                    selected={this.state.pageType == 'Details'}
                  >
                    Details
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="language">Sprache</label>
                <select
                  className="form-control"
                  id="language"
                  value={currentMenuItem.language}
                  onChange={this.onChangeLanguage}
                >
                  <option value="DE" selected={this.state.pageType == 'DE'}>
                    DE
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="position">Reihenfolge</label>
                <input
                  type="text"
                  className="form-control"
                  id="position"
                  value={currentMenuItem.position}
                  onChange={this.onChangePosition}
                  name="position"
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Platzhalter im Eingabefeld</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPlaceHolder"
                  value={currentMenuItem.inputPlaceHolder}
                  onChange={this.onChangeInputPlaceHolder}
                  name="inputPlaceHolder"
                />
              </div>

              <div className="form-group">
                <label htmlFor="icon">Sortierung nach Alphabet</label>
                <select
                  id="sortByAbc"
                  name="sortByAbc"
                  className="form-control"
                  required
                  onChange={this.onChangeSortByAbc}
                >
                  <option value="1" selected={currentMenuItem.sortByAbc == '1'}>
                    Ja
                  </option>
                  <option value="0" selected={currentMenuItem.sortByAbc == '0'}>
                    Nein
                  </option>
                </select>
              </div>
            </form>

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteMenuItem}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateMenuItem}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a MenuItem...</p>
          </div>
        )}
      </div>
    )
  }
}

