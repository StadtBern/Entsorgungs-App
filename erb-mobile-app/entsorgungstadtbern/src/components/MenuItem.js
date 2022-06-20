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
import {TouchableOpacity, Text} from 'react-native';
import MenuIcon from './MenuIcon';
const styles = require('../Style');

// This functional component is used to display the individual menu items.

const MenuItem = props => {
  return (
    <TouchableOpacity
      style={props.style}
      onPress={props.customClick}
      accessibilityLabel={props.title}
      activeOpacity={0.2}
      underlayColor="red">
      <MenuIcon
        icon={props.icon}
        style={
          props.activeMenuItem ? styles.fullMenuTextActive : styles.fullMenuText
        }
      />
      {(() => {
        if (props.fullMenu) {
          return (
            <Text
              style={
                props.activeMenuItem
                  ? styles.fullMenuTextActive
                  : styles.fullMenuText
              }>
              {props.title}
            </Text>
          );
        }
      })()}
    </TouchableOpacity>
  );
};

export default MenuItem;
