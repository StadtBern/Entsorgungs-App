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
import {
  FlatList,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AppMenuBottom from './components/AppMenuBottom';
import PlusMenu from './components/PlusMenu';
import ContentListItem from './components/ContentListItem';

import DatabaseController from './controller/database.controller';
import FullMenu from './components/FullMenu';
import MenuBurger from './img/icons/menu_burger.svg';
const styles = require('./Style');

// The detail view is used to display various content items. If, for example, the collection
// information for an address is to be displayed, this data is queried from the database when
// the view is loaded and is made available to the content items.

const Details = ({
  route,
  navigation,
  bilder,
  fotopiktogramme,
  vektorpiktogramme,
}) => {
  var {
    menu_title,
    menu_source,
    id,
    pageType,
    menuItemName,
    contentItem,
    menuItem,
  } = route.params;
  const [contentItems, setContentItems] = useState([]);
  const [overlayMenuItems, setOverlayMenuItems] = useState([]);
  const [result, setResult] = useState();
  const [menuItems, setMenuItems] = useState();
  useEffect(() => {
    // Load data from local DB
    DatabaseController.getMenu(menuItems, setMenuItems);
    DatabaseController.getContentItems(
      menuItemName,
      pageType,
      contentItem &&
        contentItem.contentType &&
        contentItem.contentType == 'RedaktionelleDaten'
        ? contentItem.contentData
        : menu_source,
      contentItem,
      setContentItems,
    );
    DatabaseController.getDataById(id, menu_source, contentItem, setResult);
    DatabaseController.getOverlayMenu(setOverlayMenuItems, menuItemName);
    navigation.setOptions({title: menu_title});
  }, [menu_source]);

  const [showFullMenu, setShowFullMenu] = useState(false);
  // Add header elements to screen
  React.useLayoutEffect(() => {
    if (!navigation.canGoBack()) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={styles.fullMenuButton}
            onPress={() => setShowFullMenu(!showFullMenu)}
            accessibilityLabel="Vollständiges Menu anzeigen">
            <MenuBurger width={48} height={48} fill="#FFF" />
          </TouchableOpacity>
        ),
        headerLeft: () => <View style={styles.logoHeaderView}></View>,
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={styles.fullMenuButton}
            onPress={() => setShowFullMenu(!showFullMenu)}
            accessibilityLabel="Vollständiges Menu anzeigen">
            <MenuBurger width={48} height={48} fill="#FFF" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  let contentListSeparator = () => {
    return <View style={styles.listItemSeparator} />;
  };
  // prepare all contenItems for this screen
  let contentListItem = item => {
    item.superContentItem = contentItem;
    return (
      <View>
        <ContentListItem
          contentItem={item}
          menuItem={menuItem}
          dataItem={result}
          images={bilder}
          nav={navigation}
          fotopiktogramme={fotopiktogramme}
          vektorpiktogramme={vektorpiktogramme}
        />
      </View>
    );
  };

  // put all elements for this screen together and
  // handle the different cases with different input data
  if (result && contentItems) {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.contentDetails}>
          <View style={{flex: 1}}>
            <FlatList
              data={contentItems}
              ItemSeparatorComponent={contentListSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => contentListItem(item)}
            />
          </View>
        </View>
        <AppMenuBottom
          nav={navigation}
          menuItems={menuItems}
          menuItemName={menuItemName}
        />
        {(() => {
          if (showFullMenu)
            return (
              <FullMenu
                nav={navigation}
                menuItems={menuItems}
                customClick={() => setShowFullMenu(!showFullMenu)}
                menuItemName={menuItemName}
              />
            );
        })()}
        {(() => {
          if (
            menuItemName == 'Sammelstellen' ||
            menuItemName == 'Abfuhrdaten' ||
            menuItemName == 'Entsorgungshöfe' ||
            (menuItemName == 'ÖkoInfoMobil' && menu_source == 'oekoinfomobil')
          )
            return (
              <PlusMenu
                style={styles}
                nav={navigation}
                menu_title={menu_title}
                menu_source={menu_source}
                dataItem={result}
                menuItemName={menuItemName}
                overlayMenuItems={overlayMenuItems}
              />
            );
        })()}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView>
          <View style={styles.detailsElement}></View>
        </ScrollView>
        <AppMenuBottom
          nav={navigation}
          menuItems={menuItems}
          menuItemName={menuItemName}
        />
        {(() => {
          if (showFullMenu)
            return (
              <FullMenu
                nav={navigation}
                menuItems={menuItems}
                customClick={() => setShowFullMenu(!showFullMenu)}
                menuItemName={menuItemName}
              />
            );
        })()}
      </SafeAreaView>
    );
  }
};

export default Details;
