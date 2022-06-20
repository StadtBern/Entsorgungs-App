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
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import DatabaseController from './controller/database.controller';
import AppMenuBottom from './components/AppMenuBottom';
import ContentListItem from './components/ContentListItem';

import FullMenu from './components/FullMenu';
import MenuBurger from './img/icons/menu_burger.svg';
import Logo from './img/icons/Logo.svg';
const styles = require('./Style');

// Like the detail view, the home view serves to display various content items. However,
// it differs from the detail view in that it has a different design and also contains the
// slideshow in which the editorial team can place the latest information prominently.

const Home = ({navigation, bilder, fotopiktogramme, vektorpiktogramme}) => {
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [contentItems, setContentItems] = useState();
  const [menuItems, setMenuItems] = useState();
  var menuItemName = 'HomeScreen';

  useEffect(() => {
    // Load data from local DB
    DatabaseController.checkAndGetMenu(
      menuItems,
      setMenuItems,
      menuItemName,
      'Home',
      'Home',
      setContentItems,
    );
  }, []);
  // Add header elements to screen
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.fullMenuButton}
          onPress={() => setShowFullMenu(!showFullMenu)}
          accessibilityLabel="Vollständiges Menu anzeigen">
          <MenuBurger width={48} height={48} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <View style={styles.logoHeaderView}>
          <Logo width={171} height={49} />
        </View>
      ),
      title: '',
    });
  }, [navigation]);

  // prepare all the contenItems for this screen
  let contentListSeparator = () => {
    return <View style={styles.listItemSeparator} />;
  };
  let contentListItem = item => {
    if (!item) return <View></View>;
    if (item.MenuOffset) return <View style={styles.menuOffset}></View>;
    return (
      <View>
        <ContentListItem
          contentItem={item}
          dataItem={null}
          nav={navigation}
          images={bilder}
          fotopiktogramme={fotopiktogramme}
          vektorpiktogramme={vektorpiktogramme}
        />
      </View>
    );
  };
  console.log('HomeScreen:Loaded', Date());
  // put all elements for this screen together
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Image
        style={styles.homeBackgroundImage}
        source={require('./img/fotos/home_rampe.jpg')}
      />
      <View style={styles.homeBackgroundView} />
      <View style={styles.homeContent}>
        <View style={styles.homeContentItemView}>
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
    </SafeAreaView>
  );
};

export default Home;
