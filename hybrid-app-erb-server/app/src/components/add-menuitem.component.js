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

// Page to add a new menu item

export default class AddMenuItem extends Component {
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

    this.saveMenuItem = this.saveMenuItem.bind(this)
    this.newMenuItem = this.newMenuItem.bind(this)

    this.state = {
      id: null,
      name: '',
      title: '',
      data: '',
      icon: '',
      category: '',
      pageType: '',
      language: '',
      position: '',
      submitted: false,
    }
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    })
  }
  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    })
  }
  onChangeData(e) {
    this.setState({
      data: e.target.value,
    })
  }
  onChangeIcon(e) {
    this.setState({
      icon: e.target.value,
    })
  }
  onChangeCategory(e) {
    this.setState({
      category: e.target.value,
    })
  }
  onChangePageType(e) {
    this.setState({
      pageType: e.target.value,
    })
  }
  onChangeLanguage(e) {
    this.setState({
      language: e.target.value,
    })
  }
  onChangePosition(e) {
    this.setState({
      position: e.target.value,
    })
  }
  onChangeInputPlaceHolder(e) {
    this.setState({
      inputPlaceHolder: e.target.value,
    })
  }
  onChangeSortByAbc(e) {
    this.setState({
      sortByAbc: e.target.value,
    })
  }
  saveMenuItem() {
    var data = {
      name: this.state.name,
      title: this.state.title,
      data: this.state.data,
      icon: this.state.icon,
      category: this.state.category,
      pageType: this.state.pageType,
      language: this.state.language,
      position: this.state.position,
      inputPlaceHolder: this.state.inputPlaceHolder,
      sortByAbc: this.state.sortByAbc,
    }

    MenuItemDataService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          title: response.data.title,
          data: response.data.data,
          icon: response.data.icon,
          category: response.data.category,
          pageType: response.data.pageType,
          language: response.data.language,
          position: response.data.position,
          inputPlaceHolder: response.data.inputPlaceHolder,
          sortByAbc: response.data.sortByAbc,
          submitted: true,
        })
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  newMenuItem() {
    this.setState({
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
      submitted: false,
    })
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newMenuItem}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={this.state.name}
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
                required
                value={this.state.title}
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
                required
                value={this.state.data}
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
                <option value="ABC" selected={this.state.icon == 'ABC'}>
                  ABC
                </option>
                <option value="Abfuhr" selected={this.state.icon == 'Abfuhr'}>
                  Abfuhr
                </option>
                <option
                  value="Entsorgungshof"
                  selected={this.state.icon == 'Entsorgungshof'}
                >
                  Entsorgungshof
                </option>
                <option value="Home" selected={this.state.icon == 'Home'}>
                  Home
                </option>
                <option
                  value="OekoInfoMobil"
                  selected={this.state.icon == 'OekoInfoMobil'}
                >
                  OekoInfoMobil
                </option>
                <option
                  value="Sammelstellen"
                  selected={this.state.icon == 'Sammelstellen'}
                >
                  Sammelstellen
                </option>
                <option
                  value="Settings"
                  selected={this.state.icon == 'Settings'}
                >
                  Settings
                </option>
                <option value="Info" selected={this.state.icon == 'Info'}>
                  Info
                </option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Kategorie</label>
              <select
                className="form-control"
                id="category"
                value={this.state.category}
                onChange={this.onChangeCategory}
              >
                <option value="">- Auswählen -</option>
                <option
                  value="MenuBottom"
                  selected={this.state.category == 'MenuBottom'}
                >
                  MenuBottom
                </option>
                <option value="Menu" selected={this.state.category == 'Menu'}>
                  Menu
                </option>
                <option
                  value="OverlayMenu"
                  selected={this.state.category == 'OverlayMenu'}
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
                value={this.state.pageType}
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
                value={this.state.language}
                onChange={this.onChangeLanguage}
              >
                <option value="DE" selected={this.state.language == 'DE'}>
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
                required
                value={this.state.position}
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
                value={this.state.inputPlaceHolder}
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
                <option value="1" selected={this.state.sortByAbc == '1'}>
                  Ja
                </option>
                <option value="0" selected={this.state.sortByAbc == '0'}>
                  Nein
                </option>
              </select>
            </div>

            <button onClick={this.saveMenuItem} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    )
  }
}

