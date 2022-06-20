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
 


import DatabaseController from '../controller/database.controller';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

var daysOfWeek = {
  Sonntag: 0,
  Montag: 1,
  Dienstag: 2,
  Mittwoch: 3,
  Donnerstag: 4,
  Freitag: 5,
  Samstag: 6,
};
var weeksToPush = 2;
var today = new Date();
var dateEnd = new Date(Date.now() + weeksToPush * 7 * 24 * 60 * 60 * 1000);

// This class is used to create the local push messages, which the user can personalise to be
// reminded of the different collection dates. In addition, the topic is subscribed to here,
// to which the editorial team can send remote push messages.

class PushController {
  weekdaysToDates(weekdays, notifyDayBefore, timeToSet) {
    var calcDayBefore = notifyDayBefore ? 1 : 0;
    var dates = [];
    weekdays.forEach(day => {
      var daysToAdd =
        (7 + daysOfWeek[day] - today.getDay() - calcDayBefore) % 7;
      for (var i = 0; i <= weeksToPush; i++) {
        var notifyDate = new Date();
        notifyDate.setDate(today.getDate() + daysToAdd + i * 7);
        notifyDate.setHours(timeToSet.slice(0, 2), timeToSet.slice(3, 5), 0);
        if (today < notifyDate) {
          dates.push(notifyDate);
        }
      }
    });
    return dates;
  }

  // funtcion to reset the local notification tokens
  async recreatePushNotifications(date) {
    var push = await DatabaseController.getNotifyAsync('push');
    PushNotification.cancelAllLocalNotifications();
    var titelKehricht,
      textKehricht,
      titelPapier,
      textPapier,
      titelGruengut,
      textGruengut,
      titelOIM,
      textOIM;
    push.msg.forEach(contentItem => {
      if (
        contentItem.contentData == 'Hauskehricht_und_brennbares_Kleinsperrgut'
      ) {
        titelKehricht = contentItem.title;
        textKehricht = contentItem.text;
      } else if (contentItem.contentData == 'Papier_und_Karton') {
        titelPapier = contentItem.title;
        textPapier = contentItem.text;
      } else if (contentItem.contentData == 'Gruengut') {
        titelGruengut = contentItem.title;
        textGruengut = contentItem.text;
      } else if (contentItem.contentData == 'BESCHRIEB') {
        titelOIM = contentItem.title;
        textOIM = contentItem.text;
      }
    });

    push.notify.forEach(dataItem => {
      if (dataItem.RUBRIK && dataItem.RUBRIK == 'ÖkoInfoMobil') {
        if (dataItem.notifyItem.oekoInfoMobilTimer != '') {
          // ÖkoInfoMobil
          var [weekday, timerange] = dataItem['BESCHRIEB'].split(' | ');
          var arrivalTime = timerange.split(' - ')[0].replace('.', ':');
          var oekoInfoMobilTimer =
            dataItem.notifyItem.oekoInfoMobilTimer == null
              ? '06:30'
              : dataItem.notifyItem.oekoInfoMobilTimer;
          var notifyDayBefore = oekoInfoMobilTimer > arrivalTime;

          var oekoInfoMobil = this.weekdaysToDates(
            [weekday],
            notifyDayBefore,
            oekoInfoMobilTimer,
          );
          oekoInfoMobil.forEach(date => {
            createPush(date, dataItem.titel + ': ' + titelOIM, textOIM);
          });
        }
      } else {
        if (dataItem.notifyItem.kehrichtTimer != '') {
          // Hauskehricht_und_brennbares_Kleinsperrgut
          var kehrichtTimer =
            dataItem.notifyItem.kehrichtTimer == null
              ? '06:30'
              : dataItem.notifyItem.kehrichtTimer;
          var notifyDayBefore = kehrichtTimer > '07:00';
          var kehricht = this.weekdaysToDates(
            dataItem['Hauskehricht_und_brennbares_Kleinsperrgut']
              .replace(' und', ',')
              .split(', '),
            notifyDayBefore,
            kehrichtTimer,
          );
          kehricht.forEach(date => {
            createPush(
              date,
              dataItem.titel + ': ' + titelKehricht,
              textKehricht,
            );
          });
        }
        if (dataItem.notifyItem.papierTimer != '') {
          // Papier_und_Karton
          var papierTimer =
            dataItem.notifyItem.papierTimer == null
              ? '06:30'
              : dataItem.notifyItem.papierTimer;
          var notifyDayBefore = papierTimer > '07:00';
          var papier = [];
          dataItem['Papier_und_Karton'].split(', ').forEach(date => {
            var [day, month, year] = date.split('.');
            var tempDate = new Date(
              year,
              month - 1,
              notifyDayBefore ? day - 1 : day,
            );
            tempDate.setHours(
              papierTimer.slice(0, 2),
              papierTimer.slice(3, 5),
              0,
            );
            if (today < tempDate && tempDate < dateEnd) {
              papier.push(tempDate);
            }
          });
          papier.forEach(date => {
            createPush(date, dataItem.titel + ': ' + titelPapier, textPapier);
          });
        }
        if (dataItem.notifyItem.gruengutTimer != '') {
          // Gruengut
          var gruengutTimer =
            dataItem.notifyItem.gruengutTimer == null
              ? '06:30'
              : dataItem.notifyItem.gruengutTimer;
          var notifyDayBefore = gruengutTimer > '07:00';

          var gruengut = this.weekdaysToDates(
            dataItem['Gruengut'].split(', '),
            notifyDayBefore,
            gruengutTimer,
          );
          gruengut.forEach(date => {
            createPush(
              date,
              dataItem.titel + ': ' + titelGruengut,
              textGruengut,
            );
          });
        }
      }
    });

    PushNotification.getScheduledLocalNotifications(n =>
      n.forEach(m => {
        console.log('Print NotifyList: ', m.date, m.title);
      }),
    );
  }
}

function createPush(date, title, message) {
  PushNotification.localNotificationSchedule({
    channelId: 'pushReminder', // required
    title: title, // optional
    message: message, // required
    vibrate: false, // optional, default: true. Creates the default vibration patten if true.
    date: date,
    allowWhileIdle: true, // set notification to work while on doze, nessesary for exact notifications.
  });
}

// Clear badge number at start
PushNotification.getApplicationIconBadgeNumber(function (number) {
  if (number > 0) {
    PushNotification.setApplicationIconBadgeNumber(0);
  }
});

PushNotification.getChannels(function (channels) {
  console.log(channels);
});

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onRemoteNotification: function (notification) {
    console.log('NOTIFICATION REMOTE:', notification);
    const isClicked = notification.getData().userInteraction === 1;
  },

  onAction: function (notification) {
    //console.log('ACTION:', notification.action);
    //console.log('NOTIFICATION:', notification);
  },

  onRegistrationError: function (err) {
    console.log('ERROR: onRegistrationError');
    console.error(err.message, err);
  },

  // Android only
  senderID: '263486148494',
  // iOS only

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,

  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel({
  channelId: 'pushReminder', // required
  channelName: 'My channel', // required
  channelDescription: 'A channel to categorise your notifications', // optional
  playSound: false, // optional, default: true
  soundName: 'default', // optional
  importance: 4, // optional, default: 4
  vibrate: true, // optional, default: true
});

console.log('Subscribe to topic: allDevices');
messaging().subscribeToTopic('allDevices');
//messaging().subscribeToTopic('TestDevices');

messaging().onMessage(async remoteMessage => {
  PushNotification.localNotification({
    channelId: 'pushReminder', // required
    title: remoteMessage.notification.title, // optional
    message: remoteMessage.notification.body, // required
  });
});

const pushcontroller = new PushController();
export default pushcontroller;
