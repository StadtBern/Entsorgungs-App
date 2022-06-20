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

import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, FlatList, View, Image} from 'react-native';
import Arrow from '../img/icons/arrow.svg';

const styles = require('../Style');

// This functinal component is used to display all variations of items in the search view.

const ListItem = props => {
  var navigation = props.nav;
  var item = props.item;
  var menuItemName = props.menuItemName;
  var sourceData = props.data;
  var menuItem = props.menuItem;
  var pageType,
    title,
    menu_source,
    id,
    adresse,
    materialien,
    contentItem,
    initSearchInput;

  var vektorpiktogramme = {
    Glas: require('.././img/vektorpiktogramme/ERB_Pikto_Glas.png'),
    PET: require('.././img/vektorpiktogramme/ERB_Pikto_PET.png'),
    Batterien: require('.././img/vektorpiktogramme/ERB_Pikto_Batterien.png'),
    'Büchsen & Alu & Kleinmetall': require('.././img/vektorpiktogramme/ERB_Pikto_Alu.png'),
    'Papier & Karton': require('.././img/vektorpiktogramme/ERB_Pikto_Papier.png'),
  };

  switch (sourceData) {
    case 'abfuhradressen':
      if (item.STRASSENNAME) {
        title = item.STRASSENNAME;
        menu_source = sourceData;
        id = item.key;
        pageType = 'Search';
        initSearchInput = item.STRASSENNAME;
      } else {
        title = item.ADRESSE;
        menu_source = sourceData;
        id = item.UID;
        pageType = 'Details';
      }
      break;
    case 'sammelstellen':
      title = item.PUNKTNAME;
      menu_source = sourceData;
      id = item.UID;
      pageType = 'Details';
      adresse = item.HAUSNUMMER
        ? item.STRASSE + ' ' + item.HAUSNUMMER
        : item.STRASSE;
      materialien = item.MATERIALIEN;
      break;
    case 'quartiere':
      title = item.QUARTIER;
      menu_source = 'oekoinfomobil';
      id = item.QUARTIER;
      pageType = 'Search';
      break;
    case 'oekoinfomobil':
      title = item.PUNKTNAME;
      menu_source = sourceData;
      id = item.UID;
      pageType = 'Details';
      break;
    case 'entsorgungshoefe':
      title = item.PUNKTNAME;
      menu_source = sourceData;
      id = item.UID;
      pageType = 'Details';
      break;
    case 'abc':
    case 'info':
    case 'settings':
      title = item.title;
      menu_source = sourceData;
      id = item.contentID;
      pageType = 'Details';
      contentItem = item;
      break;
  }
  let iconListSeparator = () => {
    return <View />;
  };
  let iconListItem = item => {
    const img = vektorpiktogramme?.[item];
    return (
      <View style={styles.vektorPiktogrammeView}>
        {img && <Image style={styles.vektorPiktogramme} source={img} />}
      </View>
    );
  };

  var customClick = () => {
    item.STRASSENNAME ? props.customFunc(item.STRASSENNAME) : null;
    console.log(
      'customClick:',
      pageType,
      title,
      menu_source,
      id,
      menuItemName,
      contentItem,
      menuItem,
    );
    navigation.navigate(pageType, {
      menu_title: title,
      menu_source: menu_source,
      menu_data: menu_source,
      id: id,
      pageType: pageType,
      menuItemName: menuItemName,
      contentItem: contentItem,
      initSearchInput: initSearchInput ? initSearchInput : null,
      menuItem: menuItem,
    });
  };

  return (
    <TouchableOpacity onPress={customClick} style={styles.listItemViewRow}>
      <View style={styles.listItemViewColumn}>
        <Text style={styles.listItemTitel}>{title}</Text>
        {(() => {
          if (adresse)
            return <Text style={styles.listItemAdresse}>{adresse}</Text>;
        })()}
        {(() => {
          if (materialien)
            return (
              <FlatList
                data={materialien.split(', ')}
                ItemSeparatorComponent={iconListSeparator}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => iconListItem(item)}
                horizontal={true}
              />
            );
        })()}
      </View>
      <View style={styles.listItemArrow}>
        <Arrow
          width={styles.listItemArrow.width}
          height={styles.listItemArrow.height}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
