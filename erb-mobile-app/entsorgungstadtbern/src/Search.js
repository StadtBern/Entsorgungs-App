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
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import ListItem from './components/ListItem';
import AppMenuBottom from './components/AppMenuBottom';
import SearchInput from './components/SearchInput';
import FullMenu from './components/FullMenu';
import MenuBurger from './img/icons/menu_burger.svg';
import DatabaseController from './controller/database.controller';
import AlphabetList from 'react-native-flatlist-alphabet';
const styles = require('./Style');

// View to list items form DB which can be filtered with a text input field

const Search = ({
  route,
  navigation,
  bilder,
  fotopiktogramme,
  vektorpiktogramme,
}) => {
  var {
    menu_title,
    menu_data,
    menuItemName,
    initSearchInput,
    menuItem,
  } = route.params;
  const [searchListItems, setSearchListItems] = useState([]);
  const [menuItems, setMenuItems] = useState();
  const minNumOfSections = 5;

  // get and refresh data
  var searchInput;
  let searchData = searchInputLocal => {
    route.params.initSearchInput = null;
    searchInput = searchInputLocal;
    DatabaseController.getData(
      setSearchListItems,
      searchInputLocal,
      menu_data,
      menuItemName,
      'Search',
      menu_title,
      menuItem,
    );
  };

  if (route.params.initSearchInput) {
    searchInput = initSearchInput;
  }

  useEffect(() => {
    // Load data from local DB
    DatabaseController.getMenu(menuItems, setMenuItems);
    DatabaseController.getData(
      setSearchListItems,
      searchInput,
      menu_data,
      menuItemName,
      'Search',
      menu_title,
      menuItem,
    );
    navigation.setOptions({title: menu_title});
  }, [menu_data]);

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

  var showSearchInput =
    menu_data == 'abfuhradressen' ||
    menu_data == 'sammelstellen' ||
    menu_data == 'oekoinfomobil';

  // Count the number of section and hide the Alphabeth if there are less than n. Numbers do not count as Section to enable manually positioning of items.
  console.log('Count the number of section and hide the Alphabeth', menuItem);
  var hideAlphabet =
    searchListItems
      .map(item => item.value[0])
      .filter((v, i, a) => !/^\+?(0|[1-9]\d*)$/.test(v) && a.indexOf(v) === i)
      .length < minNumOfSections;

  var hideStyle = {
    display: 'none',
  };
  // Put all elements for this screen together
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.content}>
        {(() => {
          if (showSearchInput)
            return (
              <SearchInput
                placeholder={menuItem.inputPlaceHolder}
                value={searchInput}
                style={styles.inputField}
                onChangeText={n => searchData(n)}
                stylePlaceholder={styles.inputFieldPlaceholder}
              />
            );
        })()}

        <View style={styles.abcListView}>
          <AlphabetList
            data={searchListItems}
            renderItem={item => (
              <View
                style={
                  hideAlphabet
                    ? styles.listItemViewHideAlphabet
                    : styles.listItemView
                }>
                <ListItem
                  item={item}
                  nav={navigation}
                  data={menu_data}
                  menuItemName={menuItemName}
                  vektorpiktogramme={vektorpiktogramme}
                  customFunc={searchInput => searchData(searchInput)}
                  menuItem={menuItem}
                />
              </View>
            )}
            renderSectionHeader={section => (
              <View>
                <Text
                  style={
                    hideAlphabet ? hideStyle : styles.listItemTextFirstLetter
                  }>
                  {section.title}
                </Text>
              </View>
            )}
            indexLetterColor={styles.abcLetterItemStyle.color}
            indexLetterSize={styles.abcLetterItemStyle.fontSize}
            letterIndexWidth={styles.abcLetterItemStyle.width}
            sectionHeaderHeight={50}
            getItemHeight={() => 50}
            letterItemStyle={
              hideAlphabet ? hideStyle : styles.abcLetterItemStyle
            }
            containerStyle={styles.abcContainerStyle}
            alphabetContainer={
              hideAlphabet ? hideStyle : styles.abcAlphabetContainer
            }
            style={
              showSearchInput ? styles.abcStyleShowSearchInput : styles.abcStyle
            }
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
    </SafeAreaView>
  );
};

export default Search;
