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
import MenuIcon from './MenuIcon';
import Arrow from '../img/icons/arrow.svg';

import DatabaseController from '../controller/database.controller';

const styles = require('../Style');

// This functional component is used to display the menu in which
// the favorite objects can be deleted.

const FavoritenItem = props => {
  var menuItemName = props.contentItem.menuItemName;
  var inSettings = menuItemName == 'Settings';
  var deleteFavorit = id => {
    DatabaseController.deleteFavorit(id);

    var pageType = 'Details';
    props.nav.replace(pageType, {
      menu_title: 'Favoriten',
      menu_source: 'settings',
      id: null,
      pageType: pageType,
      menuItemName: 'Settings',
      contentItem: props.contentItem.superContentItem,
    });
  };
  return (
    <View style={!inSettings ? styles.favItemHome : styles.favItem}>
      <TouchableOpacity style={styles.favItemLeft} onPress={props.customClick}>
        {(() => {
          if (!inSettings) {
            return (
              <View style={styles.favListItemIcon}>
                <MenuIcon icon={props.icon} style={styles.menuItem} />
              </View>
            );
          }
        })()}
        <View style={styles.settingsItemLeft}>
          <Text
            style={
              inSettings ? styles.settingsListItemText : styles.favListItemText
            }>
            {props.title}
          </Text>
          {(() => {
            if (inSettings) {
              return (
                <Text style={styles.settingsListItemSubText}>{props.icon}</Text>
              );
            }
          })()}
        </View>
      </TouchableOpacity>
      {(() => {
        if (!inSettings) {
          return (
            <TouchableOpacity onPress={props.customClick}>
              <View style={styles.arrowView}>
                <Arrow width={14} height={14} />
              </View>
            </TouchableOpacity>
          );
        }
      })()}
      {(() => {
        if (inSettings) {
          return (
            <View style={styles.favControlles}>
              <TouchableOpacity
                accessibilityLabel={props.title + ' entfernen'}
                style={styles.favControlleItems}
                onPress={() =>
                  deleteFavorit(props.favData.favItem.favoritenID)
                }>
                <Delete width={'100%'} height={'100%'} fill="#FFF" />
              </TouchableOpacity>
            </View>
          );
        }
      })()}
    </View>
  );
};

export default FavoritenItem;
