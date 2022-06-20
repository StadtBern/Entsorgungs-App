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
import {TouchableOpacity, Text, View} from 'react-native';
import Delete from '../img/icons/delete.svg';
import Settings from '../img/icons/settings.svg';

import DatabaseController from '../controller/database.controller';

const styles = require('../Style');

// This functional component is used to display the menu in which
// the notification objects can be deleted or personalized.

const NotifyItem = props => {
  var pageType = 'Details';
  var deleteNotify = id => {
    DatabaseController.deleteNotify(id);
    props.nav.replace(pageType, {
      menu_title: 'Push Nachrichten',
      menu_source: 'settings',
      id: null,
      pageType: pageType,
      menuItemName: 'Settings',
      contentItem: props.contentItem.superContentItem,
    });
  };
  return (
    <View style={styles.favItem}>
      <TouchableOpacity
        style={styles.settingsItemLeft}
        onPress={props.customClick}>
        <Text style={styles.settingsListItemText}>{props.title}</Text>
        <Text style={styles.settingsListItemSubText}>{props.icon}</Text>
      </TouchableOpacity>
      <View style={styles.favControlles}>
        <TouchableOpacity
          accessibilityLabel={props.title + ' entfernen'}
          style={styles.favControlleItems}
          onPress={() => deleteNotify(props.notifyData.notifyItem.notifyID)}>
          <Delete width={'100%'} height={'100%'} fill="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel={props.title + ' Einstellungen'}
          style={styles.favControlleItems}
          onPress={() => {
            props.nav.replace(pageType, {
              menu_title: 'Push Nachrichten',
              menu_source: 'settings',
              id: props.notifyData.notifyItem.notifyID,
              pageType: pageType,
              menuItemName: 'Settings',
              contentItem: {
                contentType: 'SettingsPushNachrichtenItem',
                contentData:
                  props.notifyData.notifyItem.dataType == 'abfuhradressen'
                    ? 'SettingsPushNachrichtenItemAbfuhr'
                    : 'SettingsPushNachrichtenItemOIM',
              },
            });
          }}>
          <Settings width={'100%'} height={'100%'} stroke="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotifyItem;
