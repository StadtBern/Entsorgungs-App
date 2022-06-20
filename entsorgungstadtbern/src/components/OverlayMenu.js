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
import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import DotMenuItem from '../components/DotMenuItem';

import DatabaseController from '../controller/database.controller';
import PushController from '../controller/push.controller';
import Settings from '../img/icons/settings.svg';

// This functional component contains the context menu found on most detail views.

const styles = require('../Style');
const OverlayMenu = props => {
  const [favoritenItem, setFavoritenItem] = useState();
  const [notifyItem, setNotifyItem] = useState();
  const [showMsg, setShowMsg] = useState(false);
  var navigation = props.nav;

  var id = props.dataItem.UID;
  useEffect(() => {
    DatabaseController.checkFavorit(
      setFavoritenItem,
      props.menuItemName,
      props.menu_source,
      id,
    );
    DatabaseController.checkNotify(
      setNotifyItem,
      props.menuItemName,
      props.menu_source,
      id,
    );
  }, []);
  let menuItemSeparator = () => {
    return <View />;
  };
  let menuItemView = item => {
    var onClickFunction;
    var buttonActive;

    switch (item.name) {
      case 'addFavorit':
        if (favoritenItem) {
          onClickFunction = () =>
            DatabaseController.deleteFavorit(
              favoritenItem.favoritenID,
              setFavoritenItem,
            );
        } else {
          onClickFunction = () =>
            DatabaseController.setFavorit(
              props.menuItemName,
              props.menu_source,
              id,
              setFavoritenItem,
            );
        }
        buttonActive = favoritenItem ? true : false;
        break;
      case 'addPush':
        if (
          notifyItem &&
          notifyItem.notifyType &&
          notifyItem.notifyType.includes('push')
        ) {
          onClickFunction = () => {
            DatabaseController.deleteNotify(notifyItem.notifyID, setNotifyItem);
            setShowMsg(false);
          };
        } else {
          onClickFunction = () => {
            DatabaseController.setNotify(
              props.menuItemName,
              'push',
              props.menu_source,
              id,
              setNotifyItem,
            );
            PushController.recreatePushNotifications();
            setShowMsg(true);
          };
        }
        buttonActive = notifyItem
          ? notifyItem.notifyType.includes('push')
          : false;

        break;
      case 'addCalender':
        onClickFunction = () => console.log('onClickFuction Kalender');
        buttonActive = notifyItem
          ? notifyItem.notifyType.includes('calendar')
          : false;

        break;
    }
    return (
      <TouchableOpacity
        style={styles.buttonOverlayMenu}
        onPress={onClickFunction}>
        <DotMenuItem
          icon={item.icon}
          style={styles.dotMenuButton}
          function={null}
          buttonActive={buttonActive}
        />
        <View style={styles.buttonOverlayMenuTextView}>
          <Text
            style={
              buttonActive
                ? styles.buttonOverlayMenuTextActive
                : styles.buttonOverlayMenuText
            }>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (props.showOverlay && props.overlayMenuItems) {
    return (
      <View style={styles.overlayMenu}>
        {(() => {
          if (showMsg) {
            return (
              <View style={styles.overlayMenuMsgView}>
                <TouchableOpacity
                  accessibilityLabel="Einstellungen Push Nachrichten"
                  onPress={() => {
                    navigation.replace('Details', {
                      menu_title: 'Push Nachrichten',
                      menu_source: 'settings',
                      id: notifyItem.notifyID,
                      pageType: 'Details',
                      menuItemName: 'Settings',
                      contentItem: {
                        contentType: 'SettingsPushNachrichtenItem',
                        contentData: props.dataItem.abfuhradressenID
                          ? 'SettingsPushNachrichtenItemAbfuhr'
                          : 'SettingsPushNachrichtenItemOIM',
                      },
                    });
                  }}
                  style={styles.overlayMenuMsgTouch}>
                  <View style={{flexDirection: 'column', marginRight: 'auto'}}>
                    <Text style={styles.overlayMenuMsgTitle}>
                      Push Nachrichten für alle Fraktionen 4 Std. vor
                      Bereitstellungszeit aktiviert.
                    </Text>
                    <Text style={styles.overlayMenuMsgText}>
                      Klicken Sie hier um die Benachrichtigungseinstellungen
                      anzupassen.
                    </Text>
                  </View>
                  <View style={styles.settingsIconView}>
                    <Settings
                      width={14}
                      height={14}
                      stroke={styles.settingsIconView.color}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }
        })()}
        <View style={styles.overlayMenuItems}>
          <FlatList
            data={props.overlayMenuItems}
            ItemSeparatorComponent={menuItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => menuItemView(item)}
            horizontal={true}
          />
        </View>
      </View>
    );
  } else {
    return null;
  }
};

export default OverlayMenu;
