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
import ABC from '../img/icons/abc.svg';
import Abfuhr from '../img/icons/abfuhr.svg';
import Entsorgungshof from '../img/icons/entsorgungshof_recycling.svg';
import Home from '../img/icons/home_wappen.svg';
import OekoInfoMobil from '../img/icons/oekoinfomobil_recycling.svg';
import Sammelstellen from '../img/icons/sammelstellen_recycling.svg';
import Settings from '../img/icons/settings.svg';
import Info from '../img/icons/info.svg';

// This functional component is used to display the individual menu icons.

const MenuIcon = props => {
  var iconColor = props.style.color;
  switch (props.icon) {
    case 'ABC':
      return (
        <View
          style={{
            paddingTop: 13.5,
            paddingRight: 11.4,
            paddingBottom: 11.5,
            paddingLeft: 11.5,
          }}>
          <ABC width={25.1} height={24} stroke={iconColor} />
        </View>
      );
    case 'abfuhradressen':
    case 'Abfuhr':
      return (
        <View
          style={{
            paddingTop: 15,
            paddingRight: 7,
            paddingBottom: 12,
            paddingLeft: 2,
          }}>
          <Abfuhr width={39.3} height={21.5} stroke={iconColor} />
        </View>
      );
    case 'entsorgungshoefe':
    case 'Entsorgungshof':
      return (
        <View
          style={{
            paddingTop: 1,
            paddingRight: 1,
            paddingBottom: 10,
            paddingLeft: 10,
          }}>
          <Entsorgungshof width={38} height={38} stroke={iconColor} />
        </View>
      );
    case 'Home':
      return (
        <View
          style={{
            paddingTop: 9.5,
            paddingRight: 14.5,
            paddingBottom: 9.5,
            paddingLeft: 14.5,
          }}>
          <Home width={20} height={30} stroke={iconColor} />
        </View>
      );
    case 'oekoinfomobil':
    case 'OekoInfoMobil':
      return (
        <View
          style={{
            paddingTop: 1,
            paddingRight: 1,
            paddingBottom: 11.8,
            paddingLeft: 9,
          }}>
          <OekoInfoMobil width={39} height={36.2} stroke={iconColor} />
        </View>
      );
    case 'sammelstellen':
    case 'Sammelstellen':
      return (
        <View
          style={{
            paddingTop: 1,
            paddingRight: 1,
            paddingBottom: 11,
            paddingLeft: 12,
          }}>
          <Sammelstellen width={36} height={37} stroke={iconColor} />
        </View>
      );
    case 'Settings':
      return (
        <View
          style={{
            paddingTop: 12,
            paddingRight: 10,
            paddingBottom: 10,
            paddingLeft: 12,
          }}>
          <Settings width={24} height={24} stroke={iconColor} />
        </View>
      );
    case 'Info':
      return (
        <View
          style={{
            paddingTop: 12,
            paddingRight: 10,
            paddingBottom: 18,
            paddingLeft: 12,
          }}>
          <Info width={24} height={24} stroke={iconColor} />
        </View>
      );

    default:
      return <Home width={48} height={48} stroke={iconColor} />;
  }
};

export default MenuIcon;
