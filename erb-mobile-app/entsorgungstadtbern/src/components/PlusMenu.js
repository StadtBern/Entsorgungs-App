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

import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import DotMenuItem from '../components/DotMenuItem';

import OverlayMenu from './OverlayMenu';
const styles = require('../Style');

// This functional component is used to open the context menu found on most detail views.

const PlusMenu = props => {
  const [showOverlay, setShowOverlay] = useState(false);
  var overlayToggle = () => {
    setShowOverlay(!showOverlay);
    if (!showOverlay) {
      props.nav.setOptions({title: ''});
    } else {
      props.nav.setOptions({title: props.menu_title});
    }
  };

  return (
    <View style={props.style.plusMenuView}>
      <OverlayMenu
        showOverlay={showOverlay}
        style={props.style.overlayMore}
        menu_source={props.menu_source}
        dataItem={props.dataItem}
        menuItemName={props.menuItemName}
        overlayMenuItems={props.overlayMenuItems}
        nav={props.nav}
      />
      <TouchableOpacity
        accessibilityLabel={
          showOverlay ? 'Kontextmenu ausblenden' : 'Kontextmenu einblenden'
        }
        style={styles.plusMenuButtonView}
        onPress={() => overlayToggle()}>
        <DotMenuItem
          icon={'plus'}
          style={styles.plusMenuButton}
          function={null}
          buttonActive={showOverlay}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlusMenu;
