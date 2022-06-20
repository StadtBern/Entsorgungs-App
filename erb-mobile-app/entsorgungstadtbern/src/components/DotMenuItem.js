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
import {View} from 'react-native';

import ButtonMore from '../img/icons/buttonMore.svg';
import Plus from '../img/icons/plus.svg';
import Heart from '../img/icons/heart.svg';
import Calendar from '../img/icons/calendar.svg';
import Push from '../img/icons/bell.svg';
import Check from '../img/icons/check.svg';
import MenuClose from '../img/icons/menu_close.svg';

const styles = require('../Style');

// This functional component is used to display the context menu items.

const DotMenuItem = props => {
  var topIconWidth = props.style.width / 2;
  var topIconHeight = props.style.height / 2;
  var buttonColor = props.buttonActive
    ? props.icon == 'plus'
      ? '#fff'
      : styles.dotMenuButtonActive.color
    : styles.dotMenuButton.color;
  var iconColor = '#2b475e';

  var topMenuIcon = icon => {
    switch (icon) {
      case 'plus':
        if (props.buttonActive) {
          return (
            <MenuClose
              style={styles.topMenuIcon}
              width={topIconWidth * 2}
              height={topIconHeight * 2}
              stroke={iconColor}
            />
          );
        } else {
          return (
            <Plus
              style={styles.topMenuIcon}
              width={topIconWidth}
              height={topIconHeight}
              stroke={iconColor}
            />
          );
        }
      case 'heart':
        return (
          <Heart
            style={styles.topMenuIcon}
            width={topIconWidth}
            height={topIconHeight}
          />
        );
      case 'calendar':
        return (
          <Calendar
            style={styles.topMenuIcon}
            width={topIconWidth}
            height={topIconHeight}
          />
        );
      case 'push':
        return (
          <Push
            style={styles.topMenuIcon}
            width={topIconWidth}
            height={topIconHeight}
          />
        );
      case 'check':
        return (
          <Check
            style={styles.topMenuIcon}
            width={topIconWidth}
            height={topIconHeight}
          />
        );
      default:
        return (
          <Plus
            style={styles.topMenuIcon}
            width={topIconWidth}
            height={topIconHeight}
          />
        );
    }
  };

  return (
    <View style={props.style}>
      <ButtonMore
        width={props.style.width}
        height={props.style.height}
        fill={buttonColor}
      />

      {(() => {
        if (props.buttonActive && props.icon != 'plus')
          return (
            <View style={styles.dotMenuButtonActive}>
              <DotMenuItem
                icon="check"
                style={styles.dotMenuButtonActiveCheck}
                function={null}
                buttonActive={false}
              />
            </View>
          );
      })()}

      {topMenuIcon(props.icon)}
    </View>
  );
};

export default DotMenuItem;
