////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import { RAW_PROPERTY_KEY } from './raw-field';

/**
 * This function is used to convert a class into a Pinia store.
 *
 * For example, the following code defines a Pinia store named `user`.
 * Note that this function also support the inheritance of the store class.
 *
 * ```js
 * import { toStore } from '@haixing_hu/pinia-decorators';
 * import dayjs from 'dayjs';
 *
 * class BaseUserStore {
 *   id = '';
 *
 *   username = '';
 *
 *   password = '';
 *
 *   nickname = '';
 *
 *   get age() {
 *     throw new Error('Should be override by subclass');
 *   }
 *
 *   setNickname(nickname) {
 *     this.nickname = nickname;
 *   }
 *
 *   login() {
 *     throw new Error('Should be override by subclass');
 *   }
 * }
 *
 * class UserStore extends BaseUserStore {   // support inheritance of the store class
 *  avatar = '';
 *
 *  birthday = '';
 *
 *  get age() {
 *    return dayjs().diff(this.birthday, 'year');
 *  }
 *
 *  setAvatar(avatar) {
 *    this.avatar = avatar;
 *  }
 *
 *  updatePassword(password) {
 *    this.password = newPassword;
 *    return api.updatePassword(this.username, newPassword);
 *  }
 *
 *  login() {
 *    return api.login(this.username, this.password);
 *  }
 * }
 *
 * export default toStore('user', UserStore);
 * ```
 *
 * The above example is equivalent to the following code:
 *
 * ```javascript
 * import { defineStore } from 'pinia';
 *
 * const useUserStore = defineStore('user', {
 *   state: () => ({
 *     id: '',
 *     username: '',
 *     password: '',
 *     nickname: '',
 *     avatar: '',
 *     birthday: '',
 *   }),
 *
 *   getters: {
 *     age: (state) => dayjs().diff(state.birthday, 'year'),
 *   },
 *
 *   actions: {
 *     setNickname(nickname) {
 *       this.nickname = nickname;
 *     },
 *     setAvatar(avatar) {
 *       this.avatar = avatar;
 *     },
 *     updatePassword(newPassword) {
 *       this.password = newPassword;
 *       return api.updatePassword(this.username, newPassword);
 *     },
 *     login() {
 *       return api.login(this.username, this.password);
 *     },
 *   },
 * });
 *
 * export default useUserStore;
 * ```
 *
 * We can use the `user` store in the Vue components as follows:
 * ```vue
 * <template>
 *   <div>
 *     <div>Username: {{ username }}</div>
 *     <div>Age: {{ age }}</div>
 *     <div>Avatar: <img :src="avatar" /></div>
 *     <button @click="setNickname('new-nickname')">Set Nickname</button>
 *     <button @click="updatePassword('new-password')">Change Password</button>
 *     <button @click="login()">Login</button>
 *   </div>
 * </template>
 * <script>
 * import { Component, toVue } from '@haixing_hu/vue3-class-component';
 * import { State, Getter, Action } from '@haixing_hu/pinia-decorators';
 * import useUserStore from 'src/stores/user';
 *
 * &#064;Component
 * class UserPage {
 *   &#064;State(useUserStore)
 *   username;
 *
 *   &#064;State(useUserStore)
 *   avatar;
 *
 *   &#064;Getter(useUserStore)
 *   age;
 *
 *   &#064;Action(useUserStore)
 *   setNickname;
 *
 *   &#064;Action(useUserStore)
 *   updatePassword;
 *
 *   &#064;Action(useUserStore)
 *   login;
 * }
 *
 * export default toVue(UserPage);
 * </script>
 * ```
 *
 * @param {string} storeId
 *     The ID of the Pinia store.
 * @param {function} Class
 *     The class to be converted into a Pinia store.
 * @return {function}
 *     A class decorator function, which decorates a class as a Pinia store.
 */
function toStore(storeId, Class) {
  if (typeof Class !== 'function') {
    throw new TypeError('The second argument must be a class.');
  }
  const state = () => {
    const instance = new Class();
    const metadata = Class[Symbol.metadata] ?? {};
    const rawFields = metadata[RAW_PROPERTY_KEY] ?? [];
    // Gets all fields of the instance as the state object of the store.
    const stateObj = {};
    Object.getOwnPropertyNames(instance).forEach((key) => {
      if (rawFields.includes(key)) {
        stateObj[key] = markRaw(instance[key]);
      } else {
        stateObj[key] = instance[key];
      }
    });
    return stateObj;
  };
  const getters = {};
  const actions = {};
  // Traverses the prototype chain to get all getters and methods.
  let proto = Class.prototype;
  while (proto !== Object.prototype) {
    const currentProto = proto;
    Object.getOwnPropertyNames(currentProto).forEach((key) => {
      if (key === 'constructor') {
        return;
      }
      const descriptor = Object.getOwnPropertyDescriptor(currentProto, key);
      if (descriptor.get) {
        if (!Object.prototype.hasOwnProperty.call(getters, key)) {
          // the getter of the class is treated as a getter of the store
          getters[key] = (state) => descriptor.get.call(state);
        }
      } else if (typeof descriptor.value === 'function') {
        if (!Object.prototype.hasOwnProperty.call(actions, key)) {
          // the method of the class is treated as an action of the store
          actions[key] = descriptor.value;
        }
      }
    });
    proto = Object.getPrototypeOf(currentProto);
  }
  // Creates a store using the `defineStore` function of Pinia.
  return defineStore(storeId, { state, getters, actions });
}

export default toStore;
