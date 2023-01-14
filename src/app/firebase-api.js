import 'firebase/database';
import 'firebase/firestore';

import firebase from 'firebase/app';
import {
  firebaseConfig
} from './firebase-config';
require('firebase/auth');
import { eventBus } from './helpers/eventBus';
/**
 * @description manages db connections
 * @class DataBase
 */
class DataBase {

  constructor(db) {
    this.db = db.database();
  }

  /**
   * @description recieves data from firebase
   * @param {string} key for db
   * @return {object} promise which resolves with result
   * @memberof DataBase
   */
  getData(key) {
    return new Promise((resolve, reject) => {
      const ref = this.db.ref(key).orderByKey();
      ref.once(
        'value',
        snapshot => {
          let result = [];
          this.data = snapshot.val();

          snapshot.forEach(childSnapshot => {
            if (childSnapshot.exists()) {
              result.push(childSnapshot.val());
            }
          });
          resolve(result);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  /**
   * @description removes data from firebase
   * @param {string} key removes data by this key
   * @param {object} ids to remove
   * @memberof DataBase
   */
  removeItem(key, ids) {
    return new Promise((resolve, reject) => {
      const ref = this.db.ref(key);
      ref
        .once('value')
        .then(() => {
          ids.forEach(id => {
            this.db.ref(`${key}/${id}`).remove();
          });
          resolve(true);
        })
        .catch(error => reject(error));
    });
  }

  /**
   * @description sends data to firebase
   * @param {string} key sets data by this key
   * @param {object} data to send
   * @param {string} id
   * @memberof DataBase
   */
  async sendData(userId,typeData,data) {
    try {
      
      const userRef = this.db.ref("users/" + userId);
      await userRef.update({typeData: data});
    } catch (err) {
      console.error(err);
    }
  }

  async registerUser(email,password){
    try{
      const user= await  firebase.auth().createUserWithEmailAndPassword(email, password);
      const userId = user.user.uid;
      const userRef = await this.db.ref('users/' + userId);
      eventBus.post('user-regestration-result',{
        result: true,
        userData :user
      })
    }catch(error){
      eventBus.post('user-regestration-result',{
        result: false,
        message :error.message
      })
    }
  }

async loginUser(email,password){
  try{
    const user= await  firebase.auth().signInWithEmailAndPassword(email, password);
    eventBus.post('user-login-result',{
      result: true,
      userData :user
    })
  }catch(error){
    eventBus.post('user-login-result',{
      result: false,
      message :error.message
    })
  }
}
}
export const firebaseDB = new DataBase(firebase.initializeApp(firebaseConfig));