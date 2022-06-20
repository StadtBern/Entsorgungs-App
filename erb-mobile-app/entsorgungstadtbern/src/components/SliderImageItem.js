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
import {TouchableOpacity, Text, Image, View} from 'react-native';
import MenuIcon from './MenuIcon';
const styles = require('../Style');

// This functional component is used to display the different elements in the slider on the homescreen.

const SliderImageItem = props => {
  var bilder = props.bilder;
  return (
    <TouchableOpacity style={styles.imageSlider} onPress={props.customClick}>
      <Image
        style={styles.imageSliderImg}
        source={bilder[props.sliderItem.imageId].data}
        accessibilityLabel={bilder[props.sliderItem.imageId].altText}
        accessibilityRole="link"
      />
      <View style={styles.imageSliderViewTop}>
        <Text style={styles.imageSliderTextTop}>
          {props.sliderItem.title.toUpperCase()}
        </Text>
      </View>
      <View style={styles.imageSliderViewBottom}>
        <Text style={styles.imageSliderTextBottom}>
          {props.sliderItem.text}
        </Text>
        {false && props.sliderItem.target.icon ? (
          <MenuIcon
            icon={props.sliderItem.target.icon}
            style={styles.menuItem}
          />
        ) : (
          <View></View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SliderImageItem;
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> cleaning

=======
>>>>>>> cleaning
