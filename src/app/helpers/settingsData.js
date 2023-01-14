import { firebaseDB } from '../firebase-api';
import { eventBus } from './eventBus';

/**
 * @description manages db and session storage connections
 * @exports SettingsData
 * @class SettingsData
 */
class SettingsData {

  /**
   * @description Creates an instance of SettingsData
   * @param {object} base instance of Firebase
   * @memberof SettingsData
   */
  constructor(base) {
    this.db = base;
    eventBus.subscribe('settings-page-loading', () =>
      this.receiveData('settings')
    );

  }

  /**
   * @description receives data from db
   * @param {string} key
   * @return {object} result
   * @memberof SettingsData
   */
  async receiveData(key) {
    try {
      const result = await this.db.getData(key);
      this.setDataToStorage(key, this.db.data);
      eventBus.post('load-page');
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @description sends data to firebase
   * @param {string} key
   * @param {object} data
   * @param {string} id
   * @return {boolean}
   * @memberof SettingsData
   */
  async sendData(key, data, id) {
    return await this.db.sendData(key, data, id);
  }

  async registerUser(email,password) {
    return await this.db.registerUser(email,password);
  }

  async loginUser(email,password) {
    return await this.db.loginUser(email,password);
  }

  /**
   * @description sets data to session storage
   * @param {string} key
   * @param {*} value
   * @memberof SettingsData
   */
  setDataToStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * @description receives data from session storage
   * @param {string} key
   * @return {*} data from storage
   * @memberof SettingsData
   */
  getDataFromStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  /**
   * @description removes items from firebase
   * @param {string} key
   * @param {object} ids ids of tasks' to remove
   * @return {object} promise
   * @memberof SettingsData
   */
  removeItem(key, ids) {
    return this.db.removeItem(key, ids);
  }
}

export const settingsData = new SettingsData(firebaseDB);