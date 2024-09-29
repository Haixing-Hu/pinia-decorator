////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { defineStore } from 'pinia';

/**
 * This decorator is used to decorate a class as a Pinia store.
 *
 * This decorator should be used to decorate a class field.
 *
 * For example, the following code defines a Pinia store named `user`.
 * Note that the `@DefineStore` also support the inheritance of the store class.
 *
 * ```js
 * import { DefineStore } from '@haixing_hu/pinia-decorators';
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
 * &#064;DefineStore('user')
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
 * export default UserStore;
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
 * import UserStore from 'src/stores/user';
 *
 * &#064;Component
 * class UserPage {
 *   &#064;State(UserStore)
 *   username;
 *
 *   &#064;State(UserStore)
 *   avatar;
 *
 *   &#064;Getter(UserStore)
 *   age;
 *
 *   &#064;Action(UserStore)
 *   setNickname;
 *
 *   &#064;Action(UserStore)
 *   updatePassword;
 *
 *   &#064;Action(UserStore)
 *   login;
 * }
 *
 * export default toVue(UserPage);
 * </script>
 * ```
 *
 * @param {string} storeId
 *     The ID of the Pinia store.
 * @return {function}
 *     A class decorator function, which decorates a class as a Pinia store.
 */
function DefineStore(storeId) {
  return function decorate(Class, context) {
    if (context === null || typeof context !== 'object') {
      throw new TypeError('The context must be an object.');
    }
    if (typeof Class !== 'function' || context.kind !== 'class') {
      throw new TypeError('The `@DefineStore` can only decorate a class.');
    }
    const state = () => {
      const instance = new Class();
      // Gets all fields of the instance as the state object of the store.
      const stateObj = {};
      Object.getOwnPropertyNames(instance).forEach((key) => {
        stateObj[key] = instance[key];
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
  };
}

export default DefineStore;
