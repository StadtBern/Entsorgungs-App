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
import { Link, Switch, Route } from 'react-router-dom'
import MenuItemList from './components/menuitem-list.component'
import AddMenuItem from './components/add-menuitem.component'
import MenuItem from './components/menuitem.component'
import ContentItemList from './components/contentitem-list.component'
import AddContentItem from './components/add-contentitem.component'
import ContentItem from './components/contentitem.component'
import PushNotify from './components/pushnotify.component'
import Image from './components/images.component'
import ImagesList from './components/images-list.component'
import ImageStatic from './components/images-static.component'
import ImagesStaticList from './components/images-static-list.component'
import ImageArchiv from './components/images-archiv.component'
import ImagesArchivList from './components/images-archiv-list.component'

import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to="/menuitem" className="navbar-brand">
            Hybrid App ERB Backend
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={'/menuitem'} className="nav-link">
                Menu Items
              </Link>
            </li>
            <li className="nav-item">
              <Link to={'/contentitem'} className="nav-link">
                Content Items
              </Link>
            </li>
            <li className="nav-item">
              <Link to={'/images'} className="nav-link">
                Bilder Slider
              </Link>
            </li>
            <li className="nav-item">
              <Link to={'/images-static'} className="nav-link">
                Bilder statisch
              </Link>
            </li>
            <li className="nav-item">
              <Link to={'/images-archiv'} className="nav-link">
                Bilderarchiv
              </Link>
            </li>
            <li className="nav-item">
              <Link to={'/pushnotify'} className="nav-link">
                Push Benachrichtigung
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={['/', '/menuitem']} component={MenuItemList} />
            <Route exact path="/contentitem" component={ContentItemList} />
            <Route exact path="/add" component={AddMenuItem} />
            <Route exact path="/addcontent" component={AddContentItem} />
            <Route path="/menuitem/:id" component={MenuItem} />
            <Route path="/contentitem/:id" component={ContentItem} />
            <Route exact path="/pushnotify" component={PushNotify} />
            <Route exact path="/images" component={ImagesList} />
            <Route path="/images/:id" component={Image} />
            <Route exact path="/images-static" component={ImagesStaticList} />
            <Route path="/images-static/:id" component={ImageStatic} />
            <Route exact path="/images-archiv" component={ImagesArchivList} />
            <Route path="/images-archiv/:id" component={ImageArchiv} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App

