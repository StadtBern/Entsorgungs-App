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

// View to edit one content item

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

export default class ContentItem extends Component {
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

    this.getContentItem = this.getContentItem.bind(this)
    this.updateContentItem = this.updateContentItem.bind(this)
    this.deleteContentItem = this.deleteContentItem.bind(this)

    this.state = {
      currentContentItem: {
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
      },
      htmlEditor: true,
      message: '',
      images: null,
    }
  }

  async componentDidMount() {
    this.getContentItem(this.props.match.params.id)

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
    const name = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        name: name,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangeTitle(e) {
    const title = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        title: title,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangeText(e) {
    const text = e

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        text: text,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangeImg(e) {
    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        imageId: e.target.value,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangeContentData(e) {
    const contentData = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        contentData: contentData,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangeLanguage(e) {
    const language = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        language: language,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangeContentType(e) {
    const contentType = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        contentType: contentType,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangeMenuItemName(e) {
    const menuItemName = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        menuItemName: menuItemName,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangePageType(e) {
    const pageType = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        pageType: pageType,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangeSearchData(e) {
    const searchData = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        searchData: searchData,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }
  onChangePosition(e) {
    const position = e.target.value

    this.setState((prevState) => ({
      currentContentItem: {
        ...prevState.currentContentItem,
        position: position,
      },
      htmlEditor: prevState.htmlEditor,
    }))
  }

  onChangeHtmlEditor(e) {
    this.setState((prevState) => {
      console.log(prevState)
      return {
        currentContentItem: {
          ...prevState.currentContentItem,
        },
        htmlEditor: !prevState.htmlEditor,
      }
    })
  }

  getContentItem(id) {
    ContentItemDataService.get(id)
      .then((response) => {
        this.setState({
          currentContentItem: response.data,
          htmlEditor: true,
        })
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  updateContentItem() {
    ContentItemDataService.update(
      this.state.currentContentItem.id,
      this.state.currentContentItem,
    )
      .then((response) => {
        console.log(response.data)
        this.setState({
          message: 'The content item was updated successfully!',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  deleteContentItem() {
    ContentItemDataService.delete(this.state.currentContentItem.id)
      .then((response) => {
        console.log(response.data)
        this.props.history.push('/contentitem')
      })
      .catch((e) => {
        console.log(e)
      })
  }

  render() {
    const { currentContentItem, htmlEditor } = this.state
    return (
      <div>
        {currentContentItem ? (
          <div className="edit-form">
            <h4>Content Item</h4>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={currentContentItem.name}
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
                  value={currentContentItem.title}
                  onChange={this.onChangeTitle}
                  name="title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="text">Text</label>
                <HTMLEditor
                  value={currentContentItem.text}
                  func={this.onChangeText}
                  htmlEditor={htmlEditor}
                />

                <div>
                  <input
                    type="checkbox"
                    defaultChecked={htmlEditor}
                    name="htmlEditor"
                    onChange={this.onChangeHtmlEditor}
                  />
                  Plain Text Editor
                </div>
                {htmlEditor == true ? (
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      id="textPlain"
                      value={currentContentItem.text}
                      onChange={(newContent) =>
                        this.onChangeText(newContent.target.value)
                      }
                      name="text"
                    />
                  </div>
                ) : (
                  <p />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="img">Bild</label>
                <select className="form-control" onChange={this.onChangeImg}>
                  <option
                    value="-1"
                    selected={currentContentItem.imageId == -1}
                  >
                    - Auswählen -
                  </option>
                  {this.state.images &&
                    this.state.images.map((img) => (
                      <option
                        value={img.id}
                        selected={currentContentItem.imageId == img.id}
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
                  value={currentContentItem.contentData}
                  onChange={this.onChangeContentData}
                  name="contentData"
                />
              </div>
              <div className="form-group">
                <label htmlFor="language">Sprache</label>
                <select
                  className="form-control"
                  id="language"
                  value={currentContentItem.language}
                  onChange={this.onChangeLanguage}
                >
                  <option
                    value="DE"
                    selected={currentContentItem.language == 'DE'}
                  >
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
                  value={currentContentItem.contentType}
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
                  value={currentContentItem.menuItemName}
                  onChange={this.onChangeMenuItemName}
                  name="menuItemName"
                />
              </div>
              <div className="form-group">
                <label htmlFor="pageType">Seiten Typ</label>
                <select
                  className="form-control"
                  id="pageType"
                  value={currentContentItem.pageType}
                  onChange={this.onChangePageType}
                >
                  <option value="">- Auswählen -</option>
                  <option
                    value="Home"
                    selected={currentContentItem.pageType == 'Home'}
                  >
                    Home
                  </option>
                  <option
                    value="Search"
                    selected={currentContentItem.pageType == 'Search'}
                  >
                    Search
                  </option>
                  <option
                    value="Details"
                    selected={currentContentItem.pageType == 'Details'}
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
                  value={currentContentItem.searchData}
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
                  value={currentContentItem.position}
                  onChange={this.onChangePosition}
                  name="position"
                />
              </div>
            </form>

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteContentItem}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateContentItem}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a ContentItem...</p>
          </div>
        )}
      </div>
    )
  }
}

