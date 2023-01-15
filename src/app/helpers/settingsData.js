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

    eventBus.subscribe('settings-page-loading', async () => {
      const userId = await this.getDataFromStorage('userId');

      const userSettins = await this.getSettingsData(userId);
      if (userSettins) {
        this.setDataToStorage('settings', userSettins);
      } else {
        const defualtSettings = await this.getDefaultSettings()
        this.setDataToStorage('settings', defualtSettings);
      }
      eventBus.post('load-page');
    });

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

  async getSettingsData() {
    const userId = this.getDataFromStorage('userId');
    const settings = await this.db.getData("users/" + userId + `/settings`);
    if(!settings){
      return this.setDataToStorage('settings', await this.getDefaultSettings());  
    }
      
    this.setDataToStorage('settings', settings);
  }

  async getTasksData() {
    const userId = this.getDataFromStorage('userId');
    return await this.db.getData("users/" + userId + `/tasks`);
  }

  async getDefaultSettings() {
    return await this.db.getData("defaultSettings/");
  }
  /**
   * @description sends data to firebase
   * @param {string} key
   * @param {object} data
   * @param {string} id
   * @return {boolean}
   * @memberof SettingsData
   */
  async sendData(id, key, data) {
    return await this.db.sendData(id, key, data);
  }

  async sendTask(data) {
    const userId = this.getDataFromStorage('userId');
    const dataSchema = "users/" + userId + "/tasks/";
    return await this.db.writeData(dataSchema, data);
  }

  async registerUser(email, password) {
    return await this.db.registerUser(email, password);
  }

  async loginUser(email, password) {
    return await this.db.loginUser(email, password);
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
  async removeItem(ids) {
    const userId = this.getDataFromStorage('userId');
    const dataSchema = "users/" + userId + "/tasks/" + ids;
    return await this.db.removeItem(dataSchema);
  }

  async getUserData(key) {
    try {
      const userId = this.getDataFromStorage('userId');
      const result = await this.db.getData(userId, key);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

export const settingsData = new SettingsData(firebaseDB);
