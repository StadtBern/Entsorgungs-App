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

import React from 'react';
import {FlatList, View, StatusBar} from 'react-native';

import MenuItem from './MenuItem';

const styles = require('../Style');

// This functional component contains the menu found at the bottom of every screen.

const AppMenuBottom = props => {
  var navigation = props.nav;
  var menuItems = props.menuItems;
  var menuItemName = props.menuItemName;

  let menuItemSeparator = () => {
    return <View />;
  };

  let menuItemView = item => {
    return (
      <View>
        <MenuItem
          title={item.title}
          customClick={() =>
            navigation.replace(item.pageType, {
              menu_title: item.title,
              menu_data: item.data,
              menu_source: item.data,
              menuItemName: item.name,
              pageType: item.pageType,
              menuItem: item,
            })
          }
          icon={item.icon}
          style={styles.menuItem}
          activeMenuItem={item.name == menuItemName}
        />
      </View>
    );
  };

  if (menuItems) {
    return (
      <View style={styles.menuItemView}>
        <StatusBar translucent backgroundColor="transparent" />
        <FlatList
          data={menuItems}
          ItemSeparatorComponent={menuItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => menuItemView(item)}
          horizontal={true}
        />
      </View>
    );
  } else {
    return <View style={styles.menuItemView}></View>;
  }
};

export default AppMenuBottom;
