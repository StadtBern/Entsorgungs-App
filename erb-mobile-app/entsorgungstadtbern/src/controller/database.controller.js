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

import SQLite from 'react-native-sqlite-storage';
import PushController from '../controller/push.controller';
import fs from 'react-native-fs';
import {Image} from 'react-native';

// To save time when starting the app and to have the address data available
// right from the start, a complete data set is already downloaded with the app.
// This only needs to be updated later.
var firstData = {
  abfuhradressen: require('../Abfallsammeladressen.sql.json'),
};

var db = SQLite.openDatabase({name: 'Database.db'});
var api_version = 'v1'; // test, v1, etc..
var dbserver = `https://erbapp.bern.ch/api/${api_version}`;
var SEARCHLIMIT = 100;

SQLite.enablePromise(true);

// class to handle all connections to the local and the server DB
class DatabaseController {
  check_api_status = async () => {
    let response;
    try {
      response = await fetch(`${dbserver}/status`);
    } catch (err) {
      // HTTP Request failed -> API not available
      console.log(err);
      return [false, null];
    }

    switch (response.status) {
      case 200:
        const {message} = await response.json();
        return [true, message];

      case 410: // Gone -> API no longer available
        return [false, 'Pls update app...'];

      default:
        return [false, null];
    }
  };

  localDBRequest(query, variables, callbackFunction, callbackError) {
    db.transaction(function (txn) {
      txn.executeSql(
        query,
        variables,
        callbackFunction,
        callbackError
          ? callbackError
          : e => {
              console.log('Error', e);
            },
      );
    });
  }

  async externalDBRequest(
    tableName,
    createQuery,
    insertQuery,
    variables,
    resolve,
    reject,
  ) {
    console.log('load ', tableName);
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        [tableName],
        function (txn, res) {
          console.log('load', tableName, ': length', res.rows.length);
          if (res.rows.length == 0) {
            console.log('load', tableName, ': create');
            db.executeSql(
              createQuery,
              [],
              () => {
                console.log('Created', tableName);
                firstData[tableName]
                  ? db.executeSql(
                      firstData[tableName].query,
                      [],
                      console.log('firstData loaded', tableName),
                      e => {
                        console.log('Error', e);
                      },
                    )
                  : null;
              },
              e => {
                console.log('Error', e);
              },
            );
          }
        },
        e => {
          console.log('Error', e);
        },
      );
    });

    var page = 0;
    var limit = 100;
    var totalCount = 1;
    var jsonData = [];
    while (page * limit <= totalCount) {
      await fetch(`${dbserver}/${tableName}?page=${page}`)
        .then(response => response.json())
        .then(responseJson => {
          totalCount = responseJson.count || -1;
          console.log(
            'load ' + tableName + ': data requested',
            responseJson.length || totalCount,
            page,
          );
          jsonData = jsonData.concat(
            responseJson.rows ? responseJson.rows : responseJson,
          );
        })
        .catch(error => {
          console.log('Could not connect to the server:', dbserver, error);
          resolve(true);
        });

      page++;
    }
    if (jsonData.length > 0) {
      db.transaction(function (txn) {
        txn.executeSql(
          'DROP TABLE IF EXISTS ' + tableName,
          [],
          (txn, res) => {
            txn.executeSql(
              createQuery, //'CREATE TABLE IF NOT EXISTS menuitem(menuItemID INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), title VARCHAR(255), data VARCHAR(255), icon VARCHAR(255), category VARCHAR(255), pageType VARCHAR(255), language VARCHAR(255), position INTEGER)',
              [],
              async (txn, res) => {
                await db.transaction(function (txn) {
                  for (let i = 0; i < jsonData.length; ++i) {
                    txn.executeSql(
                      insertQuery, //'INSERT INTO menuitem (name, title, data, icon, category, pageType, language, position) VALUES (?,?,?,?,?,?,?,?)',
                      variables.map(n => {
                        if (Array.isArray(n)) {
                          return n.map(m => jsonData[i][m]).join(' ');
                        } else {
                          return jsonData[i][n];
                        }
                      }),
                      (tx, results) => {},
                      e => {
                        console.log('Error', e);
                      },
                    );
                  }
                });
                resolve(true);
              },
              e => {
                console.log('Error', e);
              },
            );
          },
          e => {
            console.log('Error', e);
          },
        );
      });
    }
  }

  // compare the local and the server version. Returns TRUE if the local DB should be updated
  checkDBVersion = () =>
    new Promise((resolve, reject) => {
      db.transaction(function (txn) {
        txn.executeSql(
          "SELECT * FROM menuitem WHERE name='Version'",
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              fetch(`${dbserver}/menuitem?name=Version`)
                .then(response => response.json())
                .then(responseJson => {
                  parseInt(results.rows.item(0).data) <
                    parseInt(responseJson[0].data) ||
                  parseInt(responseJson[0].data) == 0
                    ? resolve(true)
                    : resolve(false);
                })
                .catch(error => {
                  console.log(error);
                  resolve(false);
                });
            } else {
              resolve(true);
            }
          },
          e => {
            console.log('Error', e);
            resolve(true);
            reject(e);
          },
        );
      });
    });

  // load all tables from the server
  async reloadAllDBs() {
    this.loadFavoriten();
    this.loadNotify();
    this.loadPOI();
    this.loadZonen();
    this.loadAbfuhradressen();
    return true;
  }
  // get menu from local DB
  getMenu(menuItems, setMenuItems, menu_category) {
    menu_category = menu_category ? menu_category : 'MenuBottom';
    if (menuItems == null) {
      db.transaction(function (txn) {
        txn.executeSql(
          "SELECT * FROM menuitem WHERE name IS NOT 'Version' AND category LIKE ? ORDER BY position ASC",
          [`${menu_category}%`],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));

            console.log('getMenu!');
            setMenuItems(temp);
          },
          e => {
            console.log('Error', e);
          },
        );
      });
    }
  }
  // check and update menu data. if there are new data on the server reload all tables
  async checkAndGetMenu(
    menuItems,
    setMenuItems,
    menu_name,
    pageType,
    sourceData,
    setContentItems,
  ) {
    this.getMenu(menuItems, setMenuItems);
    await this.loadContent();
    this.getContentItems(
      menu_name,
      pageType,
      sourceData,
      null,
      setContentItems,
      null,
    );

    await this.loadMenu();
    this.getMenu(menuItems, setMenuItems);
  }
  // get the menu Items for the overlay menu
  getOverlayMenu(setFunction, menuItemName) {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM menuitem WHERE name IS NOT 'Version' AND category LIKE 'OverlayMenu' ORDER BY position ASC",
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            results.rows.item(i).data.includes(menuItemName)
              ? temp.push(results.rows.item(i))
              : null;
          setFunction(temp);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // load menu data from server
  loadMenu = async () =>
    new Promise(async (resolve, reject) => {
      this.externalDBRequest(
        'menuitem',
        'CREATE TABLE IF NOT EXISTS menuitem(menuItemID INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), title VARCHAR(255), data VARCHAR(255), icon VARCHAR(255), category VARCHAR(255), pageType VARCHAR(255), language VARCHAR(255), position INTEGER, inputPlaceHolder VARCHAR(255), sortByAbc INTEGER)',
        'INSERT INTO menuitem (name, title, data, icon, category, pageType, language, position, inputPlaceHolder, sortByAbc) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [
          'name',
          'title',
          'data',
          'icon',
          'category',
          'pageType',
          'language',
          'position',
          'inputPlaceHolder',
          'sortByAbc',
        ],
        resolve,
        reject,
      );
    });

  // load content data from server
  loadContent = async () =>
    new Promise(async (resolve, reject) => {
      this.externalDBRequest(
        'contentitem',
        'CREATE TABLE IF NOT EXISTS contentitem(contentID INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), title VARCHAR(255), text TEXT, imageId INTEGER, contentData VARCHAR(255), language VARCHAR(255), contentType VARCHAR(255), menuItemName VARCHAR(255), pageType VARCHAR(255), searchData VARCHAR(255), position INTEGER)',
        'INSERT INTO contentitem (name, title, text, imageId, contentData, language, contentType, menuItemName, pageType, searchData, position) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [
          'name',
          'title',
          'text',
          'imageId',
          'contentData',
          'language',
          'contentType',
          'menuItemName',
          'pageType',
          'searchData',
          'position',
        ],
        resolve,
        reject,
      );
    });

  // load abfuhradressen from server
  loadAbfuhradressen = async () =>
    new Promise(async (resolve, reject) => {
      if (false) {
      } else {
        this.externalDBRequest(
          'abfuhradressen',
          'CREATE TABLE IF NOT EXISTS abfuhradressen(abfuhradressenID INTEGER PRIMARY KEY AUTOINCREMENT, UID VARCHAR(255), STRASSENNAME VARCHAR(255), HAUSNUMMER VARCHAR(255), FLAECHENAME VARCHAR(255), H_COORD DOUBLE PRECISION, V_COORD DOUBLE PRECISION, Zone VARCHAR(255), coordinates VARCHAR(255), ADRESSE VARCHAR(255))',
          'INSERT INTO abfuhradressen (UID, STRASSENNAME, HAUSNUMMER, FLAECHENAME, H_COORD, V_COORD, Zone, coordinates, ADRESSE) VALUES (?,?,?,?,?,?,?,?,?)',
          [
            'UID',
            'STRASSENNAME',
            'HAUSNUMMER',
            'FLAECHENAME',
            'H_COORD',
            'V_COORD',
            'Zone',
            'coordinates',
            ['STRASSENNAME', 'HAUSNUMMER'],
          ],
          resolve,
          reject,
        );
      }
    });

  // load zonen data from server
  loadZonen = async () => {
    new Promise(async (resolve, reject) => {
      this.externalDBRequest(
        'zonen',
        'CREATE TABLE IF NOT EXISTS zonen(zonenID INTEGER PRIMARY KEY AUTOINCREMENT, Zone VARCHAR(255), Bereitstellung VARCHAR(255), Hauskehricht_und_brennbares_Kleinsperrgut VARCHAR(255), Papier_und_Karton TEXT, Gruengut VARCHAR(255))',
        'INSERT INTO zonen (Zone, Bereitstellung, Hauskehricht_und_brennbares_Kleinsperrgut, Papier_und_Karton, Gruengut) VALUES (?,?,?,?,?)',
        [
          'Zone',
          'Bereitstellung',
          'Hauskehricht_und_brennbares_Kleinsperrgut',
          'Papier_und_Karton',
          'Gruengut',
        ],
        resolve,
        reject,
      );
    });
  };

  getImages = async type => {
    console.log('getImages');
    var resultset;
    var img_list;
    if (type == 'slider') {
      console.log('getImages, type == slider');
      const [resultsettmp] = await db.executeSql(
        "SELECT * FROM contentitem WHERE contentType LIKE 'SlideshowItem'",
      );

      resultset = await Promise.all(
        resultsettmp.rows.raw().map(async contentItem => {
          console.log(contentItem.imageId);
          var [
            resultSetTmpitem,
          ] = await db.executeSql(
            'SELECT id, name, altText FROM images WHERE id = ?',
            [contentItem.imageId],
          );
          console.log('resultSetTmpitem:', resultSetTmpitem.rows.raw()[0]);
          return resultSetTmpitem.rows.raw()[0];
        }),
      );
      console.log('resultset', resultset);
      img_list = resultset;
    } else {
      [
        resultset,
      ] = await db.executeSql(
        'SELECT id, name, altText FROM images WHERE type = ?',
        ['bild'],
      );
      img_list = resultset.rows.raw();
    }

    const data_list = await Promise.all(
      img_list.map(img =>
        fs.readFile(fs.DocumentDirectoryPath + `/${img.id}`, 'utf8'),
      ),
    );

    fs.readDir(fs.DocumentDirectoryPath).then(result => {
      result.map(n => n.path).forEach(item => console.log('->', item));
    });

    const images = {};
    img_list.forEach((img, idx) => {
      console.log(img);

      if (type == 'slider' || type == 'bild') {
        images[img.id] = {
          data: {uri: data_list[idx]},
          altText: img_list[idx].altText,
        };
      } else {
        images[img.name] = {
          data: {uri: data_list[idx]},
          altText: img_list[idx].altText,
        };
      }
    });

    return images;
  };

  getImageByID = async (type, id, setFunction) => {
    console.log('getImageByID', type, id);
    const [
      resultset,
    ] = await db.executeSql(
      'SELECT id, name, altText FROM images WHERE type = ? AND id = ?',
      [type, id],
    );

    if (resultset.rows.item(0)) {
      console.log(
        'getImageByID',
        resultset.rows.item(0).name,
        resultset.rows.item(0).id,
      );
    }
    img_list = resultset.rows.raw();

    const data_list = await Promise.all(
      img_list.map(img => {
        console.log('getImages: fs read', type, img.name);
        return fs.readFile(fs.DocumentDirectoryPath + `/${img.id}`, 'utf8');
      }),
    );
    if (setFunction)
      setFunction({
        data: {uri: data_list[0]},
        altText: resultset.rows.item(0).altText,
      });

    return {data: {uri: data_list[0]}, altText: resultset.rows.item(0).altText};
  };

  loadImages = async () => {
    console.log('load images');

    let images;
    try {
      const response = await fetch(`${dbserver}/images`);
      if (!response.ok) throw new Error(response.statusText);
      images = await response.json();
    } catch (err) {
      // api not reachable -> cannot update local db
      console.log(err);
      return;
    }

    await db.executeSql(
      'CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY, name VARCHAR(255), altText VARCHAR(255), checksum VARCHAR(255), type VARCHAR(255))',
    );

    const [resultsettmp] = await db.executeSql(
      "SELECT * FROM contentitem WHERE contentType LIKE 'SlideshowItem'",
    );

    const sliderImageIDList = await Promise.all(
      resultsettmp.rows.raw().map(async contentItem => {
        return contentItem.imageId;
      }),
    );

    const [resultset] = await db.executeSql('SELECT * FROM images');
    const local_images = resultset.rows.raw();

    for (let img of images) {
      const local_img = local_images.find(image => image.id == img.id);

      if (
        !local_img ||
        (local_img.checksum != null && img.checksum != local_img.checksum)
      ) {
        console.log('loadImages:', img.id, 'full');
        // new image or img data changed -> get full record (incl. img bytes) (only slider images)

        var data;

        if (sliderImageIDList.includes(img.id)) {
          data = await fetch(`${dbserver}/images/${img.id}`).then(res =>
            res.json(),
          );
          await fs.writeFile(
            fs.DocumentDirectoryPath + `/${data.id}`,
            data.data,
            'utf8',
          );
        } else {
          data = img;
          data.checksum = null;
        }

        // replace db entry
        await db.executeSql(
          'INSERT OR REPLACE INTO images(id, name, altText, checksum, type) VALUES (?,?,?,?,?)',
          [data.id, data.name, data.altText, data.checksum, data.type],
        );
      } else {
        console.log('loadImages:', img.id, 'meta');
        // no new image -> update existing metadata
        await db.executeSql(
          'UPDATE images SET name=?, altText=?, type=? WHERE id = ?',
          [img.name, img.altText, img.type, img.id],
        );
      }
    }

    console.log('done loading images');
  };

  loadLocalImages = async () => {
    console.log('loadLocalImages');

    var localImages = {
      20: require('.././img/bilder/Kehrichtabfuhr.jpg'),
      27: require('.././img/bilder/Papierabfuhr_Container-min.jpg'),
      28: require('.././img/bilder/OekoInfoMobil-min.jpg'),
      29: require('.././img/bilder/Entsorgungshof_App.jpg'),
      38: require('.././img/bilder/Schulangebote.jpg'),
      69: require('.././img/bilder/X_Altmetall.png'),
      70: require('.././img/bilder/X_Alu.png'),
      71: require('.././img/bilder/X_Autobatterie.png'),
      72: require('.././img/bilder/X_elektrogeraete_akku_batterie.png'),
      73: require('.././img/bilder/X_Fensterglas.png'),
      74: require('.././img/bilder/X_Glas-nach-Farben.png'),
      76: require('.././img/bilder/X_holz.png'),
      77: require('.././img/bilder/X_Kehrichtsack.png'),
      78: require('.././img/bilder/X_Kleinsperrgut.png'),
      79: require('.././img/bilder/X_korkzapfen.png'),
      80: require('.././img/bilder/X_kuehlschraenke.png'),
      81: require('.././img/bilder/X_Leuchtmittel.png'),
      82: require('.././img/bilder/X_Mehrkomponentenabfall.png'),
      83: require('.././img/bilder/X_Oelige-Abfaelle.png'),
      84: require('.././img/bilder/X_PET.png'),
      91: require('.././img/bilder/X_Sonderabfaelle.png'),
      95: require('.././img/bilder/X_Buechsen-Alu.png'),
      96: require('.././img/bilder/X_Batterien.png'),
      98: require('.././img/bilder/Sammelstellen.jpg'),
      99: require('.././img/bilder/Y_Papier_Kartongebuendelt.png'),
      100: require('.././img/bilder/Y_Kunststoffflaschen.png'),
      102: require('.././img/bilder/Y_Sperrgut-brennbar.png'),
      103: require('.././img/bilder/Y_Textilien.png'),
      104: require('.././img/bilder/Y_Velo.png'),
      105: require('.././img/bilder/Z_Pneus.png'),
      106: require('.././img/bilder/Y_Nespresso-Kapseln.png'),
      107: require('.././img/bilder/Y_Sperrgut-ubrennbar.png'),
    };

    const [resultset] = await db.executeSql(
      'SELECT * FROM images WHERE type=?',
      ['bild'],
    );
    const local_images_metadata = resultset.rows.raw();

    for (let img of local_images_metadata) {
      if (localImages?.[img.id]) {
        console.log('loadLocalImages: imgID', img.id);

        await fs.writeFile(
          fs.DocumentDirectoryPath + `/${img.id}`,
          Image.resolveAssetSource(localImages[img.id]).uri,
          'utf8',
        );
      }
    }

    console.log('done loadLocalImages', Date());
  };

  // load poi data from server
  loadPOI = async () =>
    new Promise(async (resolve, reject) => {
      this.externalDBRequest(
        'poi',
        'CREATE TABLE IF NOT EXISTS poi(poiID INTEGER PRIMARY KEY AUTOINCREMENT, RUBRIK VARCHAR(255), TELEFON VARCHAR(255), BESCHRIEB VARCHAR(255), H_COORD DOUBLE PRECISION, V_COORD DOUBLE PRECISION, HAUSNUMMER VARCHAR(255), PUNKTNAME VARCHAR(255), URL VARCHAR(255), EMAIL VARCHAR(255), STRASSE VARCHAR(255), TYP VARCHAR(255), ORT VARCHAR(255), PLZ VARCHAR(255), MATERIALIEN VARCHAR(255), UID VARCHAR(255), QUARTIER VARCHAR(255), coordinates VARCHAR(255))',
        'INSERT INTO poi (RUBRIK, TELEFON, BESCHRIEB, H_COORD, V_COORD, HAUSNUMMER, PUNKTNAME, URL, EMAIL, STRASSE, TYP, ORT, PLZ, MATERIALIEN, UID, QUARTIER, coordinates) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          'RUBRIK',
          'TELEFON',
          'BESCHRIEB',
          'H_COORD',
          'V_COORD',
          'HAUSNUMMER',
          'PUNKTNAME',
          'URL',
          'EMAIL',
          'STRASSE',
          'TYP',
          'ORT',
          'PLZ',
          'MATERIALIEN',
          'UID',
          'QUARTIER',
          'coordinates',
        ],
        resolve,
        reject,
      );
    });

  // create table favoriten
  loadFavoriten() {
    console.log('loadFavoriten');
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='favoriten'",
        [],
        function (txn, res) {
          console.log('loadFavoriten: length', res.rows.length);
          if (res.rows.length == 0) {
            console.log('loadFavoriten: drop table');

            txn.executeSql(
              'DROP TABLE IF EXISTS favoriten',
              [],
              (txn, res) => {
                console.log('loadFavoriten: table droped');
                txn.executeSql(
                  'CREATE TABLE IF NOT EXISTS favoriten(favoritenID INTEGER PRIMARY KEY AUTOINCREMENT, menuItemName VARCHAR(255), favType VARCHAR(255), dataID VARCHAR(255), position INTEGER)',
                  [],
                  (txn, res) => {
                    console.log('loadFavoriten: table created');
                  },
                  e => {
                    console.log('Error', e);
                  },
                );
              },
              e => {
                console.log('Error', e);
              },
            );
          } else {
            txn.executeSql(
              'SELECT * FROM favoriten',
              [],
              (txn, res) => {
                console.log(
                  'loadFavoriten: table exist. Check if dataID is int',
                  Number.isInteger(res.rows.item(0).dataID),
                );
                if (Number.isInteger(res.rows.item(0).dataID)) {
                  console.log('loadFavoriten: drop table');

                  txn.executeSql(
                    'DROP TABLE IF EXISTS favoriten',
                    [],
                    (txn, res) => {
                      console.log('loadFavoriten: table droped');
                      txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS favoriten(favoritenID INTEGER PRIMARY KEY AUTOINCREMENT, menuItemName VARCHAR(255), favType VARCHAR(255), dataID VARCHAR(255), position INTEGER)',
                        [],
                        (txn, res) => {
                          console.log('loadFavoriten: table created');
                        },
                        e => {
                          console.log('Error', e);
                        },
                      );
                    },
                    e => {
                      console.log('Error', e);
                    },
                  );
                }
              },
              e => {
                console.log('Error', e);
              },
            );
          }
        },
      );
    });
  }

  // save a favoriten
  setFavorit(menuItemName, favType, id, setFavoritenItem) {
    console.log('setFavorit:', favType + ' ' + id);
    db.transaction(function (txn) {
      txn.executeSql(
        'INSERT INTO favoriten (menuItemName, favType, dataID) VALUES (?,?,?)',
        [menuItemName, favType, id],
        (tx, results) => {
          console.log('setFavorit: Wrote ', results);
          setFavoritenItem({favoritenID: results.insertId});
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // check if an item is in table favoriten
  checkFavorit(setFavoritenItem, menuItemName, favType, id) {
    db.transaction(function (txn) {
      txn.executeSql(
        'SELECT * FROM favoriten WHERE menuItemName=? AND favType=? AND dataID=?',
        [menuItemName, favType, id],
        (tx, results) => {
          setFavoritenItem(results.rows.item(0));
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get all favorites
  getFavoriten(setFunction) {
    const that = this;
    db.transaction(function (txn) {
      txn.executeSql(
        'SELECT * FROM favoriten',
        [],
        async (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            var favItem = await that.getFavoritById(
              results.rows.item(i).favType,
              results.rows.item(i).dataID,
            );
            favItem.favItem = results.rows.item(i);
            favItem ? temp.push(favItem) : null;
          }
          setFunction(temp);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get the data from a favoritItem
  async getFavoritById(favType, id) {
    var favItem;
    switch (favType) {
      case 'abfuhradressen':
        favItem = await this.getAbfuhradresseById(id);
        favItem.titel = favItem.ADRESSE;
        favItem.details = favItem.ORT;
        favItem.icon = favType;
        break;

      case 'entsorgungshoefe':
      case 'oekoinfomobil':
      case 'sammelstellen':
        favItem = await this.getPOIById(id);
        favItem.titel = favItem.PUNKTNAME;
        favItem.details = favItem.STRASSE
          ? favItem.HAUSNUMMER
            ? favItem.STRASSE + ' ' + favItem.HAUSNUMMER + ', ' + favItem.ORT
            : favItem.STRASSE + ', ' + favItem.ORT
          : favItem.ORT;
        favItem.icon = favType;
        break;
    }
    return favItem;
  }

  // delete a favoriteItem
  deleteFavorit(id, setCheckFavoritenItem) {
    console.log('deleteFavorit:', id);
    db.transaction(function (txn) {
      txn.executeSql(
        'DELETE FROM favoriten WHERE favoritenID=?',
        [id],
        (tx, results) => {
          console.log('deleteFavorit: Deleted ', id);
          setCheckFavoritenItem(false);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // create table notify
  loadNotify() {
    console.log('loadNotify');
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='notify'",
        [],
        function (txn, res) {
          console.log('loadNotify: length', res.rows.length);
          if (res.rows.length == 0) {
            console.log('loadNotify: drop table');
            txn.executeSql(
              'DROP TABLE IF EXISTS notify',
              [],
              (txn, res) => {
                console.log('loadNotify: table droped');
                txn.executeSql(
                  'CREATE TABLE IF NOT EXISTS notify(notifyID INTEGER PRIMARY KEY AUTOINCREMENT, menuItemName VARCHAR(255), notifyType VARCHAR(255), dataType VARCHAR(255), dataID VARCHAR(255), kehrichtTimer VARCHAR(255), papierTimer VARCHAR(255), gruengutTimer VARCHAR(255), oekoInfoMobilTimer VARCHAR(255))',
                  [],
                  (txn, res) => {
                    console.log('loadNotify: table created');
                  },
                  e => {
                    console.log('Error', e);
                  },
                );
              },
              e => {
                console.log('Error', e);
              },
            );
          } else {
            txn.executeSql('SELECT * FROM notify', [], (txn, res) => {
              console.log(
                'loadNotify: table exist. Check if dataID is int',
                Number.isInteger(res.rows.item(0).dataID),
              );
              if (Number.isInteger(res.rows.item(0).dataID)) {
                console.log('loadNotify: drop table');
                txn.executeSql(
                  'DROP TABLE IF EXISTS notify',
                  [],
                  (txn, res) => {
                    console.log('loadNotify: table droped');
                    txn.executeSql(
                      'CREATE TABLE IF NOT EXISTS notify(notifyID INTEGER PRIMARY KEY AUTOINCREMENT, menuItemName VARCHAR(255), notifyType VARCHAR(255), dataType VARCHAR(255), dataID VARCHAR(255), kehrichtTimer VARCHAR(255), papierTimer VARCHAR(255), gruengutTimer VARCHAR(255), oekoInfoMobilTimer VARCHAR(255))',
                      [],
                      (txn, res) => {
                        console.log('loadNotify: table created');
                      },
                      e => {
                        console.log('Error', e);
                      },
                    );
                  },
                  e => {
                    console.log('Error', e);
                  },
                );
              }
            });
          }
        },
      );
    });
  }

  // save a notifyItem
  setNotify(menuItemName, notifyType, dataType, id, setFunction) {
    db.transaction(function (txn) {
      txn.executeSql(
        'SELECT * FROM notify WHERE menuItemName= ? AND notifyType= ? AND dataType= ? AND dataID= ?',
        [menuItemName, notifyType, dataType, id],
        (txn, results) => {
          if (results.rows.length > 0) {
            console.log(
              'setNotify: Notify already exists ',
              dataType + ' ' + id,
            );
          } else {
            txn.executeSql(
              'INSERT INTO notify (menuItemName, notifyType, dataType, dataID) VALUES (?,?,?,?)',
              [menuItemName, notifyType, dataType, id],
              (tx, results) => {
                console.log('setNotify: Wrote ', dataType + ' ' + id);
                setFunction({
                  notifyID: results.insertId,
                  notifyType: notifyType,
                });
              },
              e => {
                console.log('Error', e);
              },
            );
          }
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // check if an item is in table notify
  checkNotify(setFunction, menuItemName, dataType, id) {
    db.transaction(function (txn) {
      txn.executeSql(
        'SELECT * FROM notify WHERE menuItemName= ? AND dataType= ? AND dataID= ?',
        [menuItemName, dataType, id],
        (txn, results) => {
          setFunction(results.rows.item(0));
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // update a notifyItem
  updateNotify(menuItemName, notifyType, dataType, id, key, value) {
    db.transaction(function (txn) {
      txn.executeSql(
        'SELECT * FROM notify WHERE menuItemName= ? AND notifyType= ? AND dataType= ? AND dataID= ?',
        [menuItemName, notifyType, dataType, id],
        (txn, results) => {
          if (results.rows.length == 0) {
            console.log(
              'setNotify: Notify does not exist',
              dataType + ' ' + id,
            );
          } else {
            txn.executeSql(
              'UPDATE notify SET ' +
                key +
                '= ? WHERE menuItemName= ? AND notifyType= ? AND dataType= ? AND dataID= ?',
              [value, menuItemName, notifyType, dataType, id],
              (tx, results) => {
                console.log('setNotify: Updated ', dataType + ' ' + id);
                PushController.recreatePushNotifications(new Date());
              },
              e => {
                console.log('Error', e);
              },
            );
          }
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get all notifyItems
  getNotifyAsync = notifyType =>
    new Promise((resolve, reject) => {
      const that = this;
      db.transaction(function (txn) {
        txn.executeSql(
          'SELECT * FROM notify WHERE notifyType = ?',
          [notifyType],
          async (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              var notifyItem = await that.getNotifyById(
                results.rows.item(i).dataType,
                results.rows.item(i).dataID,
              );
              notifyItem.notifyItem = results.rows.item(i);
              notifyItem ? temp.push(notifyItem) : null;
            }
            db.transaction(function (txn) {
              txn.executeSql(
                'SELECT * FROM contentItem WHERE contentType = ?',
                ['Push-Benachrichtigung'],
                async (tx, results) => {
                  var msg = [];
                  for (let i = 0; i < results.rows.length; ++i) {
                    msg.push(results.rows.item(i));
                  }
                  resolve({notify: temp, msg: msg});
                },
                e => {
                  console.log('Error', e);
                  reject(e);
                },
              );
            });
          },
          e => {
            console.log('Error', e);
            reject(e);
          },
        );
      });
    });

  // get all notifyItems
  getNotify(setFunction, notifyType, id) {
    const that = this;
    var callbackFunc = async (tx, results) => {
      var temp = [];
      for (let i = 0; i < results.rows.length; ++i) {
        var notifyItem = await that.getNotifyById(
          results.rows.item(i).dataType,
          results.rows.item(i).dataID,
        );
        notifyItem.notifyItem = results.rows.item(i);
        notifyItem ? temp.push(notifyItem) : null;
      }
      setFunction ? setFunction(temp) : null;
      return temp;
    };

    db.transaction(function (txn) {
      txn.executeSql(
        'SELECT * FROM notify WHERE notifyType = ? OR notifyID = ?',
        [notifyType, id],
        callbackFunc,
        e => {
          console.log('Error', e);
        },
      );
    });
  }
  // get the data from a notifyItem
  async getNotifyById(dataType, id) {
    var notifyItem;
    console.log('getNotifyById', dataType, id);
    switch (dataType) {
      case 'abfuhradressen':
        notifyItem = await this.getAbfuhradresseById(id);
        notifyItem.titel = notifyItem.ADRESSE;
        notifyItem.details = notifyItem.ORT;
        notifyItem.icon = 'Abfuhr';
        break;
      case 'sammelstellen':
      case 'oekoinfomobil':
        notifyItem = await this.getPOIById(id);
        notifyItem.titel = notifyItem.PUNKTNAME;
        notifyItem.details =
          notifyItem.STRASSE +
          ' ' +
          notifyItem.HAUSNUMMER +
          ', ' +
          notifyItem.ORT;
        notifyItem.icon = 'Sammelstellen';
        break;
    }
    notifyItem.menu_source = dataType;
    notifyItem.id = id;
    return notifyItem;
  }

  // delete a notifyItem
  deleteNotify(id, setFunction) {
    console.log('deleteNotify:', id);
    db.transaction(function (txn) {
      txn.executeSql(
        'DELETE FROM notify WHERE notifyID=?',
        [id],
        (tx, results) => {
          console.log('deleteNotify: res', results);
          setFunction(false);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get the data form a poi item
  getPOIById = id =>
    new Promise((resolve, reject) => {
      var query;
      parseInt(id).toString().length == id.toString().length || id.includes('.')
        ? (query = 'SELECT * FROM poi WHERE poiID= ?')
        : (query = 'SELECT * FROM poi WHERE UID= ?');

      db.transaction(function (txn) {
        txn.executeSql(
          query,
          [id],
          (tx, results) => {
            resolve(results.rows.item(0));
          },
          e => {
            console.log('Error', e);
          },
        );
      });
    });

  // get the data for the search screen with handling for the different data requested
  getData(
    setFunction,
    searchInput,
    sourceData,
    menu_name,
    pageType,
    menu_title,
    menuItem,
  ) {
    switch (sourceData) {
      case 'abfuhradressen':
        return this.getAbfuhradressen(setFunction, searchInput);
      case 'sammelstellen':
        return this.getSammelstellen(setFunction, searchInput);
      case 'entsorgungshoefe':
        return this.getEntsorgungshoefe(setFunction, searchInput);
      case 'quartiere':
        return this.getQuartiere(setFunction, searchInput, menu_name);
      case 'oekoinfomobil':
        return this.getOekoinfomobil(setFunction, searchInput, menu_title);
      case 'abc':
      case 'info':
      case 'settings':
        return this.getContentItems(
          menu_name,
          pageType,
          sourceData,
          null,
          setFunction,
          menuItem,
        );
    }
  }
  // get the data from one item for the detail screen with handling for the different data requested
  async getDataById(id, sourceData, contentItem, setFunction) {
    switch (sourceData) {
      case 'abfuhradressen':
        return setFunction(await this.getAbfuhradresseById(id));
      case 'entsorgungshoefe':
      case 'sammelstellen':
      case 'oekoinfomobil':
        return setFunction(await this.getPOIById(id));
      case 'quartiere':
        return this.getQuartiere(setFunction);
      case 'abc':
      case 'info':
        return setFunction(true);
      case 'settings':
        switch (contentItem.contentData) {
          case 'SettingsFavoriten':
            return this.getFavoriten(setFunction);
          case 'SettingsPushNachrichten':
            return this.getNotify(setFunction);
          case 'SettingsPushNachrichtenItem':
          case 'SettingsPushNachrichtenItemAbfuhr':
          case 'SettingsPushNachrichtenItemOIM':
            return this.getNotify(setFunction, null, id);
          case 'SettingsKalendereinträge':
            return this.getNotify(setFunction);
        }
    }
  }

  // get the contentitems for a specific screen from the local DB
  getContentItems(
    menuItemName,
    pageType,
    menu_source,
    contentItem,
    setContentItems,
    menuItem,
  ) {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM contentitem WHERE menuItemName LIKE ? AND pageType LIKE ? AND searchData LIKE ? AND contentType NOT LIKE 'SlideshowItem' ORDER BY position ASC",
        [menuItemName, pageType, menu_source],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            results.rows.item(i).key = results.rows.item(i).contentID;
            results.rows.item(i).value =
              menuItem && menuItem.sortByAbc == '0'
                ? results.rows.item(i).position.toString()
                : results.rows
                    .item(i)
                    .title.replace('Ä', 'A')
                    .replace('Ö', 'O')
                    .replace('Ü', 'U');
            if (menu_source != 'settings') {
              temp.push(results.rows.item(i));
            } else {
              pageType == 'Details'
                ? contentItem.contentType == results.rows.item(i).contentType
                  ? temp.push(results.rows.item(i))
                  : null
                : temp.push(results.rows.item(i));
            }
          }
          setContentItems(temp);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get the slideshowitems
  getSlideshowItems(menuItemName, pageType, menu_source, setSlideshowItems) {
    var temp = [];
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM contentitem WHERE menuItemName LIKE ? AND pageType LIKE ? AND searchData LIKE ? AND contentType LIKE 'SlideshowItem' ORDER BY position ASC",
        [menuItemName, pageType, menu_source],
        async (txn, results) => {
          for (let i = 0; i < results.rows.length; ++i) {
            if (
              results.rows.item(i).contentData &&
              results.rows.item(i).contentData.slice(0, 6) == 'https:'
            ) {
              results.rows.item(i).target = {
                link: results.rows.item(i).contentData,
              };
            } else {
              results.rows.item(i).target = await new Promise(
                (resolve, reject) => {
                  db.transaction(function (txn) {
                    txn.executeSql(
                      'SELECT * FROM menuitem WHERE name LIKE ?',
                      [results.rows.item(i).contentData],
                      async (tx, resultsMenuItem) => {
                        if (resultsMenuItem.rows.length == 0) {
                          var contentItem = await new Promise(
                            (resolve, reject) => {
                              db.transaction(function (txn) {
                                txn.executeSql(
                                  'SELECT * FROM contentitem WHERE name LIKE ?',
                                  [results.rows.item(i).contentData],
                                  (tx, resultsContentItem) => {
                                    if (results.rows.item(i).contentData) {
                                      resolve(resultsContentItem.rows.item(0));
                                    } else {
                                      console.log('Error', e);
                                      reject(e);
                                    }
                                  },
                                  e => {
                                    console.log('Error', e);
                                    reject(e);
                                  },
                                );
                              });
                            },
                          );
                          contentItem
                            ? (contentItem.slideshowItemType = 'content')
                            : null;
                          resolve(contentItem);
                        } else {
                          resultsMenuItem.rows.item(0).slideshowItemType =
                            'menu';
                          resolve(resultsMenuItem.rows.item(0));
                        }
                      },
                      e => {
                        console.log('Error', e);
                        reject(e);
                      },
                    );
                  });
                },
              );
            }

            temp.push(results.rows.item(i));
          }
          setSlideshowItems(temp);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get the abfuhradressen from the local DB
  getAbfuhradressen(setFunction, searchInput) {
    if (searchInput != '' && searchInput != null) {
      db.transaction(function (txn) {
        console.log('inputvalue:', searchInput);
        txn.executeSql(
          'SELECT abfuhradressenID, STRASSENNAME, HAUSNUMMER, ADRESSE, UID FROM abfuhradressen WHERE ADRESSE LIKE ? ORDER BY ADRESSE ASC LIMIT ?',
          [
            `${searchInput}%`,
            searchInput.length % 2 == 0 ? SEARCHLIMIT : SEARCHLIMIT + 1,
          ],
          async (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              console.log('getAbfuhradressen!');
              var value =
                results.rows.item(i).STRASSENNAME +
                ('00000' + /\d*/g.exec(results.rows.item(i).HAUSNUMMER)).slice(
                  -5,
                ) +
                /\D*/g.exec(results.rows.item(i).HAUSNUMMER);
              console.log('getAbfuhradressen!', value);
              results.rows.item(i).key = results.rows.item(i).UID;
              results.rows.item(i).value = value;
              results.rows.item(i).STRASSENNAME = null;
              temp.push(results.rows.item(i));
            }
            setFunction(temp);
          },
          e => {
            console.log('Error', e);
          },
        );
      });
    } else {
      db.transaction(function (txn) {
        console.log('inputvalue:!', searchInput);
        txn.executeSql(
          'SELECT STRASSENNAME, COUNT(ADRESSE) FROM abfuhradressen GROUP BY STRASSENNAME', // ORDER BY STRASSENNAME ASC LIMIT ?',
          [], //searchInput.length % 2 == 0 ? SEARCHLIMIT : SEARCHLIMIT + 1],
          async (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              results.rows.item(i).key = i;
              results.rows.item(i).value = results.rows.item(i).STRASSENNAME;
              temp.push(results.rows.item(i));
            }
            setFunction(temp);
          },
          e => {
            console.log('Error', e);
          },
        );
      });
    }
  }

  // get the data from an abfuhradressen from the local DB
  getAbfuhradresseById = abfuhr_id =>
    new Promise((resolve, reject) => {
      var temp, query;
      console.log(
        'getAbfuhradresseById',
        abfuhr_id,
        parseInt(abfuhr_id).toString().length,
        abfuhr_id.toString().length,
        abfuhr_id.includes('.'),
      );
      parseInt(abfuhr_id).toString().length == abfuhr_id.toString().length ||
      abfuhr_id.includes('.')
        ? (query = 'SELECT * FROM abfuhradressen WHERE abfuhradressenID= ?')
        : (query = 'SELECT * FROM abfuhradressen WHERE UID= ?');

      db.transaction(function (txn) {
        txn.executeSql(
          query,
          [abfuhr_id],
          (tx, results) => {
            temp = results.rows.item(0);
            console.log('getAbfuhradresseById', results.rows.item(0));
            if (temp.Zone) {
              txn.executeSql(
                'SELECT * FROM zonen WHERE Zone= ?',
                [temp.Zone],
                (tx, resultZone) => {
                  temp.Bereitstellung = resultZone.rows.item(0).Bereitstellung;
                  temp.Hauskehricht_und_brennbares_Kleinsperrgut = resultZone.rows.item(
                    0,
                  ).Hauskehricht_und_brennbares_Kleinsperrgut;
                  temp.Papier_und_Karton = resultZone.rows.item(
                    0,
                  ).Papier_und_Karton;
                  temp.Gruengut = resultZone.rows.item(0).Gruengut;
                  resolve(temp);
                },
                e => {
                  console.log('Error', e);
                },
              );
            }
          },
          e => {
            console.log('Error', e);
          },
        );
      });
    });

  // get the sammelstellen from the local DB
  getSammelstellen(setFunction, searchInput) {
    db.transaction(function (txn) {
      searchInput = searchInput ? searchInput : '';
      txn.executeSql(
        "SELECT poiID, PUNKTNAME, STRASSE, HAUSNUMMER, MATERIALIEN, UID FROM poi WHERE RUBRIK = 'Abfall-Sammelstellen' AND PUNKTNAME LIKE ? ORDER BY PUNKTNAME ASC LIMIT ?",
        [`${searchInput}%`, SEARCHLIMIT],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            results.rows.item(i).key = results.rows.item(i).UID;
            results.rows.item(i).value = results.rows.item(i).PUNKTNAME;
            temp.push(results.rows.item(i));
          }
          setFunction(temp);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get the entsorgungshoefe from the local DB
  getEntsorgungshoefe(setFunction, searchInput) {
    db.transaction(function (txn) {
      searchInput = searchInput ? searchInput : '';
      txn.executeSql(
        "SELECT * FROM poi WHERE TYP = 'Entsorgungshof' AND PUNKTNAME LIKE ? ORDER BY PUNKTNAME ASC LIMIT ?",
        [`${searchInput}%`, SEARCHLIMIT],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            results.rows.item(i).key = results.rows.item(i).UID;
            results.rows.item(i).value = results.rows.item(i).PUNKTNAME;
            temp.push(results.rows.item(i));
          }

          temp.sort((a, b) =>
            a.PUNKTNAME > b.PUNKTNAME ? 1 : a.PUNKTNAME < b.PUNKTNAME ? -1 : 0,
          );
          setFunction(temp);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get the quartiere from the local DB
  getQuartiere(setFunction, searchInput) {
    db.transaction(function (txn) {
      searchInput = searchInput ? searchInput : '';
      txn.executeSql(
        "SELECT QUARTIER, UID FROM poi WHERE TYP = 'ÖkoInfoMobil' GROUP BY QUARTIER ORDER BY QUARTIER ASC",
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            console.log('getQuartiere', results.rows.item(i));
            results.rows.item(i).key = results.rows.item(i).UID;
            results.rows.item(i).value = results.rows.item(i).QUARTIER;
            temp.push(results.rows.item(i));
          }
          console.log('getQuartiere', temp);
          setFunction(temp);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }

  // get the oekoInfoMobilStandorte from the local DB
  getOekoinfomobil(setFunction, searchInput, quartier) {
    console.log('getOekoinfomobil', searchInput, quartier);
    db.transaction(function (txn) {
      searchInput = searchInput ? searchInput : '';
      txn.executeSql(
        "SELECT * FROM poi WHERE TYP = 'ÖkoInfoMobil' AND QUARTIER = ? AND PUNKTNAME LIKE ? ORDER BY PUNKTNAME ASC LIMIT ?",
        [quartier, `${searchInput}%`, SEARCHLIMIT],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            results.rows.item(i).key = results.rows.item(i).UID;
            results.rows.item(i).value = results.rows.item(i).PUNKTNAME;
            temp.push(results.rows.item(i));
          }
          setFunction(temp);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  }
}

const databasecontroller = new DatabaseController();
export default databasecontroller;
