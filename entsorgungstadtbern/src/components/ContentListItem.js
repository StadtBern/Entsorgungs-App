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

import React, {useEffect} from 'react';
import {
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Renderhtml from 'react-native-render-html';

import DatabaseController from '../controller/database.controller';
import {useState} from 'react';
import FavoritenItem from '../components/FavoritenItem';
import ListItem from '../components/ListItem';
import NotifyItemSettings from '../components/NotifyItemSettings';
import NotifyItem from '../components/NotifyItem';
import SliderImageItem from './SliderImageItem';
import Settings from '../img/icons/cog_small_stroke.svg';

const styles = require('../Style');

// This functional component handles all the different kinds of content which can be displayed.

const ContentListItem = props => {
  var contentItem = props.contentItem;
  var dataItem = props.dataItem;
  var navigation = props.nav;
  var menuItem = props.menuItem;

  const bilder = props.images;
  const vektorpiktogramme = props.vektorpiktogramme;

  var fotopiktogramme = {
    'Glas braun': require('.././img/fotopiktogramme/GlasBraun.png'),
    'Glas farbig': require('.././img/fotopiktogramme/GlasFarbig.png'),
    'Glas weiss': require('.././img/fotopiktogramme/GlasWeiss.png'),
    PET: require('.././img/fotopiktogramme/PET.png'),
    Kunststoffflaschen: require('.././img/fotopiktogramme/Kunststoffflaschen.png'),
    Batterien: require('.././img/fotopiktogramme/Batterien.png'),
    'Büchsen & Alu & Kleinmetall': require('.././img/fotopiktogramme/Büchsen&Alu&Kleinmetall.png'),
    'Papier & Karton': require('.././img/fotopiktogramme/Papier&Karton.png'),
  };

  var imageId = contentItem.imageId;
  const [bild, setBild] = useState();

  if (bild == null && imageId)
    DatabaseController.getImageByID('bild', imageId, setBild);
  var text = contentItem.text;
  var contentDataType = contentItem.contentData;
  var title =
    contentDataType == 'SettingsPushNachrichtenItem' ||
    contentDataType == 'SettingsPushNachrichtenItemAbfuhr' ||
    contentDataType == 'SettingsPushNachrichtenItemOIM'
      ? dataItem[0].titel
      : contentItem.title;
  const [slideshowItems, setSlideshowItems] = useState();

  var numColumns = 1;

  var noSpace =
    contentItem.menuItemName == 'HomeScreen' ||
    contentItem.menuItemName == 'Abfuhrdaten'
      ? false
      : true;

  var numsOfMonthToShow = 2;
  var maxNumsOfAbfuhrenToShow = 3;

  var dateNow = new Date();
  var dateEnd = new Date();
  dateEnd.setMonth(dateEnd.getMonth() + numsOfMonthToShow);

  var toTwoDigits = n => ('0' + n).slice(-2);
  var toWeekDays = data => data.replace(' und', ',').split(', ');

  var getDataList = () => {
    switch (contentDataType) {
      case 'Hauskehricht_und_brennbares_Kleinsperrgut':
        var temp = toWeekDays(dataItem[contentDataType]);
        !temp[0].includes('Sammelstelle')
          ? temp.push(dataItem.Bereitstellung)
          : null;
        return temp;
      case 'Papier_und_Karton':
        try {
          var dateList = [];
          dataItem[contentDataType].split(', ').forEach(date => {
            if (dateList.length < maxNumsOfAbfuhrenToShow) {
              var [day, month, year] = date.split('.');
              var tempDate = new Date(year, month - 1, day, 16);
              if (dateNow < tempDate && dateEnd > tempDate) {
                date = toTwoDigits(day) + '.' + toTwoDigits(month) + '.' + year;
                dateList.push(date);
              }
            }
          });
          !dataItem[contentDataType].includes('Sammelstelle')
            ? dateList.push(dataItem.Bereitstellung)
            : dateList.push(dataItem[contentDataType]);
          return dateList;
        } catch (e) {
          console.log(e);
          return null;
        }
      case 'Gruengut':
        var temp = toWeekDays(dataItem[contentDataType]);
        !temp[0].includes('Sammelstelle')
          ? temp.push(dataItem.Bereitstellung)
          : null;
        return temp;
      case 'Adresse':
        var adresse =
          dataItem.STRASSE && dataItem.HAUSNUMMER
            ? dataItem.STRASSE + ' ' + dataItem.HAUSNUMMER
            : dataItem.STRASSE
            ? dataItem.STRASSE
            : '';
        return [
          (adresse == '' ? dataItem.PUNKTNAME : adresse) + '\n' + dataItem.ORT,
        ];

      case 'BESCHRIEB':
        return dataItem.BESCHRIEB
          ? [dataItem.BESCHRIEB.replace(' |', ',')]
          : null;

      case 'Materialien':
        numColumns = 2;
        return dataItem.MATERIALIEN
          ? dataItem.MATERIALIEN.replace(
              'Glas',
              'Glas weiss, Glas braun, Glas farbig',
            ).split(', ')
          : null;
      case 'Slideshow':
        var everyItemChecked = true;

        !slideshowItems || !everyItemChecked
          ? DatabaseController.getSlideshowItems(
              contentItem.menuItemName,
              contentItem.pageType,
              contentItem.searchData,
              setSlideshowItems,
            )
          : null;
        var everyItemChecked = true;
        slideshowItems
          ? slideshowItems.forEach(item => {
              return !item.target ? (everyItemChecked = false) : null;
            })
          : null;

        return everyItemChecked ? slideshowItems : null;

      case 'favoriten':
        const [favoriten, setFavoriten] = useState();
        !favoriten ? DatabaseController.getFavoriten(setFavoriten) : null;
        return favoriten ? favoriten : null;

      case 'SettingsPushNachrichtenItem':
      case 'SettingsPushNachrichtenItemAbfuhr':
      case 'SettingsPushNachrichtenItemOIM':
        const [pushSettings, setPushSettings] = useState();
        !pushSettings
          ? DatabaseController.getContentItems(
              'Settings',
              'Details',
              contentItem.superContentItem.contentData,
              null,
              setPushSettings,
            )
          : null;

        return pushSettings ? pushSettings : null;
      case 'push':
        const [push, setPush] = useState();
        !push ? DatabaseController.getNotify(setPush, 'push') : null;
        return push ? push : null;
      case 'quartiere':
        return dataItem;
    }
  };

  let dataListSeparator = () => {
    return (
      <View
        style={
          contentItem.menuItemName != 'HomeScreen'
            ? styles.contentListSeparatorView
            : {}
        }
      />
    );
  };
  let sliderListSeparator = () => {
    return <View />;
  };

  let dataListItem = item => {
    switch (contentDataType) {
      case 'Materialien':
        console.log('fotopiktogramme', item);
        return (
          <View style={styles.contentDataItemView}>
            {fotopiktogramme?.[item] && (
              <Image
                style={styles.contentListItemImgMaterialien}
                source={fotopiktogramme[item]}
              />
            )}
            <Text style={styles.contentListItemTextMaterialien}>
              {item.replace(/ &/g, ',')}
            </Text>
          </View>
        );
      case 'favoriten':
        return (
          <View style={styles.favListItem}>
            <FavoritenItem
              favData={item}
              title={item.titel}
              customClick={() =>
                navigation.replace('Details', {
                  menu_title: item.titel,
                  menu_source: item.favItem.favType,
                  id: item.favItem.dataID,
                  pageType: 'Details',
                  menuItemName: item.favItem.menuItemName,
                })
              }
              nav={navigation}
              icon={item.icon}
              style={null}
              contentItem={contentItem}
            />
          </View>
        );

      case 'push':
        return (
          <View>
            <NotifyItem
              notifyData={item}
              title={item.titel}
              customClick={() =>
                navigation.replace('Details', {
                  menu_title: item.titel,
                  menu_source: item.notifyItem.dataType,
                  id: item.notifyItem.dataID,
                  pageType: 'Details',
                  menuItemName: item.notifyItem.menuItemName,
                })
              }
              nav={navigation}
              icon={item.icon}
              style={styles.favItem}
              contentItem={contentItem}
            />
          </View>
        );
      case 'SettingsPushNachrichtenItem':
      case 'SettingsPushNachrichtenItemAbfuhr':
      case 'SettingsPushNachrichtenItemOIM':
        return <NotifyItemSettings contentItem={item} dataItem={dataItem[0]} />;
      case 'Slideshow':
        var customClick;
        if (
          true &&
          item.target.link &&
          item.target.link.slice(0, 6) == 'https:'
        ) {
          customClick = async () => {
            const supported = await Linking.canOpenURL(item.target.link);
            if (supported) {
              await Linking.openURL(item.target.link);
            } else {
              Alert.alert(
                `Don't know how to open this URL: ${item.target.link}`,
              );
            }
          };
        } else {
          if (item.target.slideshowItemType == 'content') {
            customClick = () => {
              navigation.navigate('Details', {
                menu_title: item.target.title,
                menu_source: item.target.searchData,
                menu_data: item.target.searchData,
                id: null,
                pageType: 'Details',
                menuItemName: item.target.menuItemName,
                contentItem: item.target,
              });
            };
          } else {
            customClick = () =>
              navigation.replace(item.target.pageType, {
                menu_title: item.target.title,
                menu_data: item.target.data,
                menu_name: item.target.name,
                menuItemName: item.target.name,
                menuItem: item.target,
              });
          }
        }
        return (
          <View>
            <SliderImageItem
              sliderItem={item}
              bilder={bilder}
              customClick={customClick}
            />
          </View>
        );
      case 'Papier_und_Karton':
        return (
          <View style={styles.contentDataItemView}>
            <Text style={styles.contentListItemText}>{item}</Text>
          </View>
        );
      case 'quartiere':
        return (
          <View style={styles.listItemView}>
            <ListItem
              item={item}
              nav={navigation}
              data={contentItem.contentData}
              menuItemName={contentItem.menuItemName}
              vektorpiktogramme={vektorpiktogramme}
              menuItem={menuItem}
            />
          </View>
        );

      default:
        return (
          <View style={styles.contentDataItemView}>
            <Text style={styles.contentListItemText}>{item}</Text>
          </View>
        );
    }
  };
  getDataList();
  const img = bild ? bild : null;

  return (
    <View>
      <View
        style={
          contentItem.menuItemName == 'HomeScreen'
            ? styles.homeDetailsElement
            : styles.detailsElement
        }
        accessible={true}>
        {imageId && (
          <Image
            style={styles.image}
            source={img ? img.data : img}
            accessibilityLabel={img ? img.altText : img}
          />
        )}
        {(() => {
          if (
            contentDataType != 'Slideshow' &&
            contentItem.contentType != 'SettingsFavoriten' &&
            contentItem.contentType != 'SettingsPushNachrichten'
          )
            return (
              <View style={styles.contentItemTitelView}>
                <Text name={title} style={styles.contentItemTitel}>
                  {title.toUpperCase()}
                </Text>

                {(() => {
                  if (contentItem.contentType == 'Favoriten') {
                    return (
                      <TouchableOpacity
                        accessibilityLabel="Einstellungen Favoriten"
                        onPress={() => {
                          navigation.navigate('Details', {
                            menu_title: 'Favoriten',
                            menu_source: 'settings',
                            pageType: 'Details',
                            menuItemName: 'Settings',
                            contentItem: {
                              contentType: 'SettingsFavoriten',
                              contentData: 'SettingsFavoriten',
                            },
                          });
                        }}>
                        <View style={styles.settingsIconView}>
                          <Settings
                            width={14}
                            height={14}
                            stroke={styles.settingsIconView.color}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })()}
              </View>
            );
        })()}
        {(() => {
          if (text)
            return (
              <View
                style={
                  contentDataType != '' &&
                  contentDataType != 'Slideshow' &&
                  contentDataType != 'favoriten'
                    ? styles.contentListItemView
                    : styles.contentListItemViewLast
                }>
                <Renderhtml
                  systemFonts={[
                    'UniversLTPro-Condensed',
                    'UniversLTPro-55Roman',
                  ]}
                  tagsStyles={{
                    body: {
                      fontSize: styles.contentListItemText.fontSize,
                      color: styles.contentListItemText.color,
                      fontFamily: styles.contentListItemText.fontFamily,
                      lineHeight: styles.contentListItemText.lineHeight,
                    },
                    a: {
                      fontSize: styles.contentListItemTextLink.fontSize,
                      fontWeight: styles.contentListItemTextLink.fontWeight,
                      color: styles.contentListItemTextLink.color,
                      lineHeight: styles.contentListItemTextLink.lineHeight,
                      textDecorationColor: styles.contentListItemTextLink.color,
                    },
                    ul: {
                      padding: 0,
                      marginLeft: 8,
                    },
                    li: {
                      margin: 0,
                      paddingLeft: 12,
                    },
                  }}
                  source={{html: text}}
                  contentWidth={2000}
                  renderersProps={{
                    a: {
                      onPress(evt, href) {
                        Linking.openURL(href);
                      },
                    },
                  }}
                />
              </View>
            );
        })()}
        {(() => {
          if (contentDataType != '' && contentDataType != 'Slideshow')
            return (
              <FlatList
                data={getDataList()}
                ItemSeparatorComponent={dataListSeparator}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => dataListItem(item)}
                numColumns={numColumns}
              />
            );
        })()}
        {(() => {
          if (contentDataType == 'Slideshow')
            return (
              <View style={styles.imageSliderView}>
                <FlatList
                  data={getDataList()}
                  ItemSeparatorComponent={sliderListSeparator}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => dataListItem(item)}
                  horizontal
                  pagingEnabled
                />
              </View>
            );
        })()}
        {(() => {
          if (!noSpace) return <View style={styles.contentItemSpace}></View>;
        })()}
      </View>
    </View>
  );
};

export default ContentListItem;
