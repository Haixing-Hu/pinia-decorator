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
 * For example, the following code defines a Pinia store named `user`:
 * ```js
 * import { DefineStore } from '@haixing_hu/pinia-decorators';
 * import dayjs from 'dayjs';
 *
 * &#064;DefineStore('user')
 * class UserStore {
 *  id = '';
 *
 *  username = '';
 *
 *  password = '';
 *
 *  nickname = '';
 *
 *  avatar = '';
 *
 *  birthday = '';
 *
 *  getter age() {
 *    return dayjs().diff(this.birthday, 'year');
 *  }
 *
 *  setAvatar(avatar) {
 *    this.avatar = avatar;
 *  }
 *
 *  updatePassword(password) {
 *    ...
 *  }
 *
 *  login() {
 *    ...
 *  }
 * }
 *
 * export default UserStore;
 * ```
 * We can use the `user` store in the Vue components as follows:
 * ```vue
 * <template>
 *   <div>
 *     <div>Username: {{ username }}</div>
 *     <div>Age: {{ age }}</div>
 *     <div>Avatar: <img :src="avatar" /></div>
 *     <button @click="updatePassword('new-password')">Change Password</button>
 *     <button @click="login()">Login</button>
 *   </div>
 * </template>
 * <script>
 * import { Component, toVue } from '@haixing_hu/vue3-class-component';
 * import { State, Getter, Action } from '@haixing_hu/pinia-decorators';
 * import useUserStore from 'src/stores/user';
 *
 * @Component
 * class UserPage {
 *   @State(useUserStore)
 *   username;
 *
 *   @State(useUserStore)
 *   avatar;
 *
 *   @Getter(useUserStore)
 *   age;
 *
 *   @Action(useUserStore)
 *   updatePassword;
 *
 *   @Action(useUserStore)
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
      for (const key of Object.getOwnPropertyNames(instance)) {
        stateObj[key] = instance[key];
      }
      return stateObj;
    };
    const getters = {};
    const actions = {};
    // Gets the prototype of the class.
    const proto = Class.prototype;
    const propertyNames = Object.getOwnPropertyNames(proto);
    // Traverses the prototype object of the class, and processes the getters
    // and methods respectively.
    propertyNames.forEach((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(proto, key);
      if (descriptor.get) {
        // Adds the getter to the `getters` object of the store.
        getters[key] = (state) => descriptor.get.call(state);
      } else if ((typeof descriptor.value === 'function') && (key !== 'constructor')) {
        // Adds the method to the `methods` object of the store.
        actions[key] = descriptor.value;
      }
    });
    // Creates a store using the `defineStore` function of Pinia.
    return defineStore(storeId, { state, getters, actions });
  };
}

export default DefineStore;
