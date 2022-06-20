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
 


import React, { Component, useRef } from 'react'
import JoditEditor from 'jodit-react'
import ContentItemDataService from '../services/contentitem.service'

// Page to add a new content item

const HTMLEditor = (props) => {
  const editor = useRef(null)
  return (
    <div>
      <JoditEditor
        ref={editor}
        value={props.value}
        config={{ readonly: false }}
        tabIndex={1}
        onBlur={(newContent) => props.func(newContent)}
        onChange={(newContent) => {}}
      />
    </div>
  )
}

export default class AddContentItem extends Component {
  constructor(props) {
    super(props)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.onChangeImg = this.onChangeImg.bind(this)
    this.onChangeContentData = this.onChangeContentData.bind(this)
    this.onChangeLanguage = this.onChangeLanguage.bind(this)
    this.onChangeContentType = this.onChangeContentType.bind(this)
    this.onChangeMenuItemName = this.onChangeMenuItemName.bind(this)
    this.onChangePageType = this.onChangePageType.bind(this)
    this.onChangeSearchData = this.onChangeSearchData.bind(this)
    this.onChangePosition = this.onChangePosition.bind(this)

    this.saveContentItem = this.saveContentItem.bind(this)
    this.newContentItem = this.newContentItem.bind(this)

    this.state = {
      id: null,
      name: '',
      title: '',
      text: '',
      imageId: -1,
      contentData: '',
      language: '',
      contentType: '',
      menuItemName: '',
      pageType: '',
      searchData: '',
      position: '',
      submitted: false,
      images: null,
    }
  }

  componentDidMount = async (e) => {
    const response = await fetch(
      '/api/test/images?includeUnused=true&type=bild',
    )
    const images = await response.json()
    this.setState({
      images: images.filter(
        (img) => img.viewCategory == 'dynamic' || img.viewCategory == 'static',
      ),
    })
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
  onChangeText(e) {
    this.setState({
      text: e,
    })
  }
  onChangeImg(e) {
    this.setState({ imageId: e.target.value })
  }
  onChangeContentData(e) {
    this.setState({
      contentData: e.target.value,
    })
  }
  onChangeLanguage(e) {
    this.setState({
      language: e.target.value,
    })
  }
  onChangeContentType(e) {
    this.setState({
      contentType: e.target.value,
    })
  }
  onChangeMenuItemName(e) {
    this.setState({
      menuItemName: e.target.value,
    })
  }
  onChangePageType(e) {
    this.setState({
      pageType: e.target.value,
    })
  }
  onChangeSearchData(e) {
    this.setState({
      searchData: e.target.value,
    })
  }
  onChangePosition(e) {
    this.setState({
      position: e.target.value,
    })
  }
  saveContentItem() {
    var data = {
      name: this.state.name,
      title: this.state.title,
      text: this.state.text,
      imageId: this.state.imageId,
      contentData: this.state.contentData,
      language: this.state.language,
      contentType: this.state.contentType,
      menuItemName: this.state.menuItemName,
      pageType: this.state.pageType,
      searchData: this.state.searchData,
      position: this.state.position,
    }

    ContentItemDataService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          title: response.data.title,
          text: response.data.text,
          imageId: response.data.imageId,
          contentData: response.data.contentData,
          language: response.data.language,
          contentType: response.data.contentType,
          menuItemName: response.data.menuItemName,
          pageType: response.data.pageType,
          searchData: response.data.searchData,
          position: response.data.position,
          submitted: true,
        })
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  newContentItem() {
    this.setState({
      id: null,
      name: '',
      title: '',
      text: '',
      imageId: -1,
      contentData: '',
      language: '',
      contentType: '',
      menuItemName: '',
      pageType: '',
      searchData: '',
      position: '',
      submitted: false,
    })
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newContentItem}>
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
              <label htmlFor="text">Text</label>
              <HTMLEditor value={this.state.text} func={this.onChangeText} />
              Plain Text Editor
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={this.state.text}
                onChange={(newContent) =>
                  this.onChangeText(newContent.target.value)
                }
                name="text"
              />
            </div>
            <div className="form-group">
              <label htmlFor="img">Bild</label>
              <select className="form-control" onChange={this.onChangeImg}>
                <option value="-1" selected={this.state.imageId == -1}>
                  - Auswählen -
                </option>
                {this.state.images &&
                  this.state.images.map((img) => (
                    <option
                      value={img.id}
                      selected={this.state.imageId == img.id}
                    >
                      {img.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contentData">Anzuzeigende Daten</label>
              <input
                type="text"
                className="form-control"
                id="contentData"
                required
                value={this.state.contentData}
                onChange={this.onChangeContentData}
                name="contentData"
              />
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
              <label htmlFor="contentType">Inhalts Typ</label>
              <input
                type="text"
                className="form-control"
                id="contentType"
                required
                value={this.state.contentType}
                onChange={this.onChangeContentType}
                name="contentType"
              />
            </div>
            <div className="form-group">
              <label htmlFor="menuItemName">Menu Name</label>
              <input
                type="text"
                className="form-control"
                id="menuItemName"
                required
                value={this.state.menuItemName}
                onChange={this.onChangeMenuItemName}
                name="menuItemName"
              />
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
              <label htmlFor="searchData">Suchdaten</label>
              <input
                type="text"
                className="form-control"
                id="searchData"
                required
                value={this.state.searchData}
                onChange={this.onChangeSearchData}
                name="searchData"
              />
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

            <button onClick={this.saveContentItem} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    )
  }
}

