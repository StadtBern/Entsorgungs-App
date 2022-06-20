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
import {TouchableOpacity, Text, View, Switch, Platform} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import DatabaseController from '../controller/database.controller';

const styles = require('../Style');

// This functional component contains the user interface to personalize the times of notifications in the settings.

const NotifyItemSettings = props => {
  var toTwoDigits = n => ('0' + n).slice(-2);
  var toDigitalClock = d =>
    toTwoDigits(d.getHours()) + ':' + toTwoDigits(d.getMinutes());

  var notifyItem = props.dataItem.notifyItem;
  var contentData = props.contentItem.contentData;
  var defaultReminder = new Date(2021, 0, 0, 6, 30);
  var abfuhrDate;
  if (props.dataItem.Bereitstellung) {
    abfuhrDate =
      toTwoDigits(/\d/.exec(props.dataItem.Bereitstellung)) + ':00' || '07:00';
  } else {
    abfuhrDate = /\d{2}.\d{2}/
      .exec(props.dataItem.BESCHRIEB)[0]
      .replace('.', ':');
  }
  const [isEnabled, setIsEnabled] = useState(notifyItem[contentData] != '');

  const [date, setDate] = useState(
    notifyItem[contentData]
      ? new Date(
          2021,
          0,
          0,
          notifyItem[contentData].slice(0, 2),
          notifyItem[contentData].slice(3, 5),
        )
      : defaultReminder,
  );
  const [show, setShow] = useState(Platform.OS === 'ios');
  const [remindDayBefore, setRemindDayBefore] = useState(
    notifyItem[contentData] > abfuhrDate,
  );

  var [buttonLable, setButtonLable] = useState(toDigitalClock(date));

  const toggleSwitch = () => {
    onChange(null, isEnabled ? '' : defaultReminder);
    setIsEnabled(previousState => !previousState);
  };

  const onChange = (event, selectedDate) => {
    var dateString;
    setShow(Platform.OS === 'ios');
    if (selectedDate != '') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      dateString = toDigitalClock(currentDate);
      setButtonLable(dateString);
      setRemindDayBefore(dateString > abfuhrDate);
    } else {
      dateString = '';
      setButtonLable('00:00');
      setRemindDayBefore(false);
    }
    DatabaseController.updateNotify(
      notifyItem.menuItemName,
      notifyItem.notifyType,
      notifyItem.dataType,
      notifyItem.dataID,
      contentData,
      dateString,
    );
  };

  const showTimepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.notifySettingsView}>
      <View style={styles.notifySettingsViewRowTop}>
        <Text style={styles.notifySettingsText}>{props.contentItem.title}</Text>
        <View style={styles.notifySettingsViewSwitch}>
          <Switch
            trackColor={{
              false: styles.switchTracker.color,
              true: styles.switchTrackerActive.color,
            }}
            thumbColor={
              isEnabled
                ? styles.switchThumbActive.color
                : styles.switchThumb.color
            }
            ios_backgroundColor={
              isEnabled
                ? styles.switchTrackerActive.color
                : styles.switchTracker.color
            }
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        </View>
      </View>
      {(() => {
        if (isEnabled)
          return (
            <View style={styles.notifySettingsViewRowBottom}>
              <Text style={styles.notifySettingsSubTextLeft}>
                {props.contentItem.text} ({abfuhrDate})
              </Text>
              {(() => {
                if (remindDayBefore) {
                  return (
                    <Text style={styles.notifySettingsSubTextRight}>
                      Vortag
                    </Text>
                  );
                } else {
                  return (
                    <Text style={styles.notifySettingsSubTextRight}>
                      Abfuhrtag
                    </Text>
                  );
                }
              })()}
              {!(Platform.OS === 'ios') ? (
                <View>
                  <TouchableOpacity
                    accessibilityLabel={buttonLable}
                    style={styles.timerButtonTouch}
                    onPress={showTimepicker}>
                    <Text style={styles.timerButtonText}>{buttonLable}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.timerButtonTouchIOS}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'time'}
                    is24Hour={true}
                    display="compact"
                    onChange={onChange}
                    textColor="red"
                  />
                </View>
              )}

              {show && !(Platform.OS === 'ios') && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'time'}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  textColor="red"
                />
              )}
            </View>
          );
      })()}
    </View>
  );
};

export default NotifyItemSettings;
