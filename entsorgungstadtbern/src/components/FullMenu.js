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

import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Modal, FlatList} from 'react-native';
import DatabaseController from '../controller/database.controller';

import MenuClose from '../img/icons/menu_close.svg';

import MenuItem from './MenuItem';

const styles = require('../Style');

// This functional component is used for the full menu which can be opened via the burger icon.

const FullMenu = props => {
  var navigation = props.nav;
  const [menuItems, setMenuItems] = useState();

  useEffect(() => {
    DatabaseController.getMenu(menuItems, setMenuItems, 'Menu');
  }, []);

  let menuItemSeparator = () => {
    return <View />;
  };
  let menuItemView = item => {
    return (
      <View key={item.menu_id}>
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
          fullMenu={true}
          style={styles.fullMenuRow}
          activeMenuItem={item.name == props.menuItemName}
        />
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.fullMenuView}>
        <TouchableOpacity
          accessibilityLabel="Menu schliessen"
          style={styles.closeButton}
          onPress={props.customClick}>
          <MenuClose width={48} height={48} stroke="#FFF" />
        </TouchableOpacity>
        <FlatList
          data={menuItems}
          ItemSeparatorComponent={menuItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => menuItemView(item)}
        />
      </View>
    </Modal>
  );
};

export default FullMenu;
