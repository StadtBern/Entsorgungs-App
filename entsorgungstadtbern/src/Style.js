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

import {StyleSheet, Dimensions} from 'react-native';
// Central style sheet to manage the design

// Translation from the exact design colors to the variables
var hellgruen = '#DAEB0F';
var dunkelblau = '#2B475E';
var dunkelblauRGB = {r: 43, g: 71, b: 94};
var hellblau = '#83A3BE';
var hellblauRGB = {r: 131, g: 163, b: 190};
var blau = '#52718B';
var blauRGB = {r: 82, g: 113, b: 139};
var schriftHell = '#fff';
var schriftDunkel = '#2B475E';

var ios = Platform.OS === 'ios';
var iosTextOffset = ios ? 3 : 0;

module.exports = StyleSheet.create({
  headerStyle: {
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
    borderBottomWidth: 0,
    elevation: 0,
    backgroundColor: dunkelblau,
  },
  headerTitleStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'UniversLTPro-65Bold',
    color: schriftHell,
    fontSize: 16,
    lineHeight: 19.2,
    paddingTop: 3 + iosTextOffset,
    width: 250,
  },
  headerStyleHome: {
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
    borderBottomWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  logoHeaderView: {
    paddingLeft: 16,
    paddingTop: 6,
    width: ios ? 100 : 50,
  },
  arrowBack: {
    width: 18,
    height: 18,
    color: schriftHell,
    marginLeft: ios ? 16 : 5,
  },
  homeBackgroundImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: dunkelblau,
  },
  homeBackgroundView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor:
      'rgba(' +
      dunkelblauRGB.r +
      ', ' +
      dunkelblauRGB.g +
      ', ' +
      dunkelblauRGB.b +
      ', 0.75)',
  },
  homeContent: {
    paddingTop: ios ? 55 : 85,
    height: Dimensions.get('window').height - 84,
  },
  content: {
    backgroundColor: dunkelblau,
    paddingBottom: 0,
    padding: 0,
    margin: 0,
    height: Dimensions.get('window').height - 178,
  },
  contentDetails: {
    backgroundColor: dunkelblau,
    paddingBottom: 0,
    padding: 0,
    margin: 0,
    height: Dimensions.get('window').height - 178,
    borderTopWidth: 1,
    borderTopColor: blau,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: dunkelblau,
    padding: 0,
    margin: 0,
  },
  plusMenuView: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    height: 0,
  },
  plusMenuButtonView: {flex: 1, position: 'absolute', bottom: 120, right: 16},
  plusMenuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width: 44,
  },
  dotMenuButton: {
    flex: 1,
    position: 'absolute',
    bottom: 30,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    width: 74,
    color: hellgruen,
  },
  dotMenuButtonActive: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
    color: hellblau,
  },
  dotMenuButtonActiveCheck: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
  },
  topMenuIcon: {position: 'absolute'},
  overlayMenu: {
    flex: 1,
    position: 'absolute',
    bottom: 99,
    alignItems: 'center',
    height: ios
      ? Dimensions.get('window').height
      : Dimensions.get('window').height - 179,
    width: '100%',
    backgroundColor:
      'rgba(' +
      dunkelblauRGB.r +
      ', ' +
      dunkelblauRGB.g +
      ', ' +
      dunkelblauRGB.b +
      ', 0.95)',
  },
  overlayMenuItems: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 50,
    height: 150,
  },
  buttonOverlayMenu: {
    height: 100,
    width: 100,
    marginHorizontal: 16,
  },
  buttonOverlayMenuTextView: {
    paddingTop: ios ? 95 : 85,
    height: 150,
  },
  buttonOverlayMenuText: {
    color: schriftHell,
    textAlign: 'center',
    fontFamily: 'UniversLTPro-55Roman',
    fontSize: 14,
    lineHeight: 16.8,
  },
  buttonOverlayMenuTextActive: {
    color: hellblau,
    textAlign: 'center',
    fontFamily: 'UniversLTPro-55Roman',
    fontSize: 14,
    lineHeight: 16.8,
  },
  overlayMenuMsgView: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 230,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 0,
    paddingVertical: 10,
  },
  overlayMenuMsgTouch: {
    flexDirection: 'row',
  },
  overlayMenuMsgTitle: {
    fontFamily: 'UniversLTPro-55Roman',
    color: dunkelblau,
    fontSize: 16,
    paddingRight: 25,
  },
  overlayMenuMsgText: {
    fontFamily: 'UniversLTPro-55Roman',
    color: dunkelblau,
    fontSize: 14,
  },
  fullMenuButton: {
    paddingRight: ios ? 4 : 4,
  },
  fullMenuView: {
    backgroundColor: dunkelblau,
    paddingTop: ios ? 30 : 0,
    height: '100%',
    width: '100%',
  },
  closeButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    color: schriftHell,
    borderBottomWidth: 0.2,
    borderBottomColor: hellblau,
    paddingTop: 4,
  },
  fullMenuRow: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    padding: 5,
    paddingLeft: 16,
    borderBottomWidth: 0.2,
    borderBottomColor: hellblau,
    color: schriftHell,
  },
  fullMenuRowActive: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    padding: 5,
    paddingLeft: 16,
    borderBottomWidth: 0.2,
    borderBottomColor: hellblau,
    color: hellgruen,
  },
  fullMenuText: {
    fontFamily: 'UniversLTPro-45Light',
    textAlignVertical: 'center', // (Android)
    borderWidth: 0,
    color: schriftHell,
    fontSize: 20,
    position: 'absolute',
    left: 76,
    paddingTop: ios ? 23 : 15,
  },
  fullMenuTextActive: {
    fontFamily: 'UniversLTPro-45Light',
    textAlignVertical: 'center', // (Android)
    borderWidth: 0,
    color: hellgruen,
    fontSize: 20,
    position: 'absolute',
    left: 76,
    paddingTop: ios ? 23 : 15,
  },
  menuItemView: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    height: 99,
    paddingTop: 16,
    paddingBottom: 34,
    backgroundColor: dunkelblau,
    borderTopColor: blau,
    borderTopWidth: 1,
  },
  menuItem: {
    alignItems: 'center',
    color: schriftHell,
    paddingLeft: 5,
    paddingRight: 5,
  },
  menuItemActive: {
    alignItems: 'center',
    color: hellgruen,
    paddingLeft: 5,
    paddingRight: 5,
  },
  menuItemIcon: {
    borderColor: 'black',
    borderWidth: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    height: 300,
  },
  imageSlider: {
    flex: 1,
    width: Dimensions.get('window').width - 30,
    padding: 0,
  },
  imageSliderImg: {
    flex: 1,
    width: Dimensions.get('window').width - 30,
    height: 200,
    resizeMode: 'cover',
    padding: 0,
  },
  imageSliderView: {},
  imageSliderViewTop: {
    position: 'absolute',
    top: 0,
    backgroundColor: hellgruen,
    width: '100%',
  },
  imageSliderTextTop: {
    fontSize: 14,
    fontFamily: 'UniversLTPro-Condensed',
    color: schriftDunkel,
    paddingTop: 3 + iosTextOffset,
    paddingBottom: 3,
    paddingLeft: 16,
  },
  imageSliderViewBottom: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor:
      'rgba(' +
      dunkelblauRGB.r +
      ', ' +
      dunkelblauRGB.g +
      ', ' +
      dunkelblauRGB.b +
      ', 0.7)',
    width: '100%',
  },
  imageSliderTextBottom: {
    width: Dimensions.get('window').width - 30 - 60,
    fontSize: 16,
    fontFamily: 'UniversLTPro-55Roman',
    color: schriftHell,
    paddingTop: 10 + iosTextOffset,
    paddingBottom: 10,
    paddingLeft: 16,
  },

  homeContentItemView: {
    paddingVertical: 15,
  },
  contentItemView: {
    padding: 15,
  },
  vektorPiktogrammeView: {
    paddingTop: 12,
    paddingEnd: 8,
  },
  vektorPiktogramme: {
    flex: 1,
    resizeMode: 'contain',
    width: 32,
    height: 32,
    tintColor: hellblau,
  },
  contentItemTitelView: {
    backgroundColor: hellgruen,
    paddingLeft: 16,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
  },
  contentItemTitel: {
    marginRight: 'auto',
    fontSize: 14,
    fontFamily: 'UniversLTPro-Condensed',
    color: schriftDunkel,
    paddingTop: 0 + iosTextOffset,
  },
  contentItemSpace: {
    height: 32,
  },
  contentListSeparatorView: {
    borderBottomColor: blau,
    borderBottomWidth: 1,
  },
  contentListItemView: {
    flex: 1,
    padding: 16,
    borderBottomColor: blau,
    borderBottomWidth: 1,
  },
  contentListItemViewLast: {
    flex: 1,
    padding: 16,
  },
  contentDataItemView: {
    flex: 1,
    padding: 16,
  },
  contentListItemText: {
    fontSize: 16,
    lineHeight: 19.2,
    fontFamily: 'UniversLTPro-55Roman',
    color: schriftHell,
    paddingTop: 0 + iosTextOffset,
  },
  contentListItemTextLink: {
    fontSize: 16,
    lineHeight: 19.2,
    fontFamily: 'UniversLTPro-55Roman',
    color: hellgruen,
    paddingTop: 0 + iosTextOffset,
    fontWeight: 'bold',
  },
  contentListItemImgMaterialien: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  contentListItemTextMaterialien: {
    fontSize: 14,
    lineHeight: 16.8,
    fontFamily: 'UniversLTPro-55Roman',
    textAlign: 'center',
    color: schriftHell,
    paddingTop: 0 + iosTextOffset,
  },
  homeDetailsElement: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
  detailsElement: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inputField: {
    padding: 10,
    backgroundColor: blau,
    color: schriftHell,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  inputFieldPlaceholder: {
    color: hellblau,
  },
  listItemView: {
    borderBottomColor: blau,
    borderBottomWidth: 1,
    paddingRight: 16,
  },
  listItemViewHideAlphabet: {
    borderBottomColor: blau,
    borderBottomWidth: 1,
  },
  listItemViewRow: {flexDirection: 'row', padding: 16},
  listItemViewColumn: {marginRight: 'auto'},
  listItemText: {
    fontSize: 16,
    fontFamily: 'UniversLTPro-55Roman',
    lineHeight: 19.2,
    color: schriftHell,
  },
  listItemTitel: {
    fontSize: 16,
    lineHeight: 19.2,
    fontFamily: 'UniversLTPro-55Roman',
    color: schriftHell,
  },
  listItemAdresse: {
    fontSize: 12,
    lineHeight: 14.4,
    fontFamily: 'UniversLTPro-55Roman',
    color: schriftHell,
    paddingTop: 4,
  },
  listItemTextFirstLetter: {
    backgroundColor: hellgruen,
    paddingLeft: 16,
    paddingTop: ios ? iosTextOffset : 0,
    fontSize: 12,
    fontFamily: 'UniversLTPro-65Bold',
    color: schriftDunkel,
  },
  listItemViewFirstLetter: {},
  listItemArrow: {
    paddingRight: 0,
    width: 14,
    height: 14,
  },
  menuOffset: {
    height: 100,
  },

  favItemHome: {
    height: 66,
    flexDirection: 'row',
    marginTop: 1,
    backgroundColor:
      'rgba(' +
      hellblauRGB.r +
      ', ' +
      hellblauRGB.g +
      ', ' +
      hellblauRGB.b +
      ', 0.2)',
  },

  favItem: {
    height: 66,
    flexDirection: 'row',
    marginTop: 1,
    backgroundColor:
      'rgba(' +
      dunkelblauRGB.r +
      ', ' +
      dunkelblauRGB.g +
      ', ' +
      dunkelblauRGB.b +
      ', 0.7)',
    borderBottomWidth: 1,
    borderColor: blau,
  },
  favItemLeft: {
    flexDirection: 'row',
    marginRight: 'auto',
  },

  favControlles: {
    flexDirection: 'row-reverse',
    width: 116,
  },
  favControlleItems: {
    borderLeftWidth: 1,
    borderLeftColor: blau,
    width: 58,
    padding: 19,
  },
  favListItem: {
    justifyContent: 'center',
  },
  favListItemIcon: {
    padding: 5,
    paddingTop: 10,
    paddingLeft: 16,
  },
  favListItemText: {
    fontFamily: 'UniversLTPro-55Roman',
    color: schriftHell,
    fontSize: 16,
    lineHeight: 19.2,
  },
  favListItemSubText: {
    fontFamily: 'UniversLTPro-55Roman',
    color: schriftHell,
    fontSize: 12,
    lineHeight: 16.8,
  },
  arrowView: {
    paddingTop: 16,
    paddingRight: 15,
  },
  settingsIconView: {
    paddingTop: 3,
    paddingRight: 16,
    paddingBottom: 3,
    color: dunkelblau,
  },
  settingsItemLeft: {
    flexDirection: 'column',
    marginRight: 'auto',
    padding: 16,
    justifyContent: 'center',
  },

  settingsListItemText: {
    fontFamily: 'UniversLTPro-55Roman',
    color: schriftHell,
    fontSize: 16,
    lineHeight: 19.2,
    paddingBottom: 4,
  },
  settingsListItemSubText: {
    fontFamily: 'UniversLTPro-55Roman',
    color: schriftHell,
    fontSize: 12,
    lineHeight: 14.4,
  },

  // Alphabet List:
  abcListView: {
    margin: 0,
    padding: 0,
    paddingRight: 0,
    borderTopColor: blau,
    borderTopWidth: 0.25,
  },

  abcStyle: {
    margin: 0,
    padding: 0,
    paddingRight: 0,
    height: Dimensions.get('window').height - 178,
    borderTopColor: blau,
    borderTopWidth: 0.25,
  },
  abcStyleShowSearchInput: {
    margin: 0,
    padding: 0,
    paddingRight: 0,
    height: Dimensions.get('window').height - 247,
    borderTopColor: blau,
    borderTopWidth: 0.25,
  },
  abcContainerStyle: {
    margin: 0,
    padding: 0,
    width: 16,
    position: 'absolute',
    right: 0,
  },
  abcAlphabetContainer: {
    backgroundColor:
      'rgba(' + blauRGB.r + ', ' + blauRGB.g + ', ' + blauRGB.b + ', 1)',
    margin: 0,
    padding: 0,
    width: 16,
  },
  abcLetterItemStyle: {
    width: 16,
    fontSize: 10,
    color: 'white',
    margin: 0,
    padding: 0,
  },
  notifySettingsView: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 5,
    borderBottomColor: blau,
    borderBottomWidth: 1,
  },
  notifySettingsViewRowTop: {flexDirection: 'row', width: '100%'},
  notifySettingsViewRowBottom: {
    marginTop: 10,
    flexDirection: 'row',
    width: '100%',
  },
  notifySettingsViewSwitch: {
    alignItems: 'center',
    backgroundColor: blau,
    width: 46,
    marginRight: 10,
    height: 25,
    borderRadius: 13,
  },
  switch: {marginTop: -1, transform: [{scale: 1}]},
  switchTracker: {color: blau},
  switchTrackerActive: {color: blau},
  switchThumb: {color: 'lightblue'},
  switchThumbActive: {color: 'white'},
  timerButtonTouch: {
    backgroundColor: blau,
    color: schriftHell,
    width: 60,
    marginHorizontal: 10,
    alignItems: 'center',
    borderRadius: 2,
  },
  timerButtonTouchIOS: {
    backgroundColor: '#fff',
    width: 68,
    height: 36,
    borderRadius: 2,
  },
  timerButtonText: {
    backgroundColor: blau,
    color: schriftHell,
    margin: 5,
  },
  notifySettingsText: {
    marginRight: 'auto',
    fontFamily: 'UniversLTPro-55Roman',
    color: 'white',
    fontSize: 16,
  },
  notifySettingsSubTextLeft: {
    marginRight: 'auto',
    width: 200,
    fontFamily: 'UniversLTPro-55Roman',
    color: 'white',
    fontSize: 12,
  },
  notifySettingsSubTextRight: {
    fontFamily: 'UniversLTPro-55Roman',
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    marginRight: 5,
    textAlign: 'right',
  },
  progressBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: dunkelblau,
  },
  progressText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '5%',
    fontSize: 18,
    color: hellgruen,
  },
  progress: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  progressSpinner: {
    color: hellgruen,
  },
  messageScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: dunkelblau,
  },
  messageScreenText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 18,
    color: hellgruen,
  },
  messageScreenButton: {
    height: 50,
    backgroundColor: hellblau,
  },
  messageScreenButtonText: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 18,
    color: dunkelblau,
  },
});
