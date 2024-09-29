# pinia-decorator

[![npm package](https://img.shields.io/npm/v/@haixing_hu/pinia-decorator.svg)](https://npmjs.com/package/@haixing_hu/pinia-decorator)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/pinia-decorator/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/pinia-decorator/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/pinia-decorator/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/pinia-decorator?branch=master)

[pinia-decorator] is a JavaScript library that simplifies the integration of 
[Pinia] stores with [Vue class-style components] using the
[stage 3 proposal of JavaScript decorators]. In other words, it provides 
functionality similar to the [vuex-class] and [pinia-class] library. 

This library was inspired by [vuex-class] and [pinia-class] but with a few key differences:

1. It is implemented in pure JavaScript and does not require TypeScript support.
2. It supports the [Vue 3].
3. It supports the JavaScript-based class-style Vue components using [vue3-class-component], 
   while [pinia-class] primarily targets TypeScript-based class-style Vue 
   components using [vue-facing-decorator].
4. It provide the [`@DefineStore`](#define-store) decorator which decorates a class as a Pinia store.

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
  - [`@State`](#state)
  - [`@WritableState`](#writable-state)
  - [`@Getter`](#getter)
  - [`@Action`](#action)
  - [`@Store`](#store)
  - [`@DefineStore`](#define-store)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

## <span id="installation">Installation</span>

You can install [pinia-decorator] via npm or yarn:

```bash
npm install @haixing_hu/pinia-decorator
```
or
```
yarn add @haixing_hu/pinia-decorator
```

## <span id="usage">Usage</span>

[pinia-decorator] provides the following decorators for your [Vue 3 class-style components]:

- `@State`: Used to inject a read-only state from a [Pinia] store.
- `@WritableState`: Used to inject a writable state from a [Pinia] store.
- `@Getter`: Used to inject a getter from a [Pinia] store.
- `@Action`: Used to inject an action from a [Pinia] store.
- `@Store`: Used to inject the entire [Pinia] store.
- `@DefineStore`: Used to decorate a class as a [Pinia] store.

### <span id="state">`@State`</span>

The @State decorator is used to inject read-only state from a [Pinia] store 
into [Vue class-style components]. It allows you to access and use the state 
properties of the [Pinia] store within your component.

The syntax of the `@State` decorator is as follows:
```js
@State(store: object, stateName?: string)
```

- `store` (required): The injected [Pinia] store object defined using the
  `defineStore()` function from [Pinia].
- `stateName` (optional): The name of the injected state of the store. 
  If not provided, the decorator uses the decorated field name as the injected 
  state name.

### <span id="writable-state">`@WritableState`</span>

The `@WritableState` decorator is similar to `@State`, but it allows you to 
inject a writable state from a [Pinia] store into a [Vue class-style component]. 
This means you can both read and modify the state properties.

The syntax of the `@State` decorator is as follows:
```javascript
@WritableState(store: object, stateName?: string)
```

- `store` (required): The injected [Pinia] store object defined using the
  `defineStore()` function from [Pinia].
- `stateName` (optional): The name of the injected state of the store.
  If not provided, the decorator uses the decorated field name as the injected
  state name.

### <span id="getter">`@Getter`</span>

The `@Getter` decorator is used to inject a getter from a [Pinia] store into a 
[Vue class-style component]. It allows you to call getter functions from the 
store within your component.

The syntax of the `@Getter` decorator is as follows:
```javascript
@Getter(store: object, getterName?: string)
```

- `store` (required): The injected [Pinia] store object defined using the
  `defineStore()` function from [Pinia].
- `getterName` (optional): The name of the injected getter of the store.
  If not provided, the decorator uses the decorated field name as the injected
  getter name.

### <span id="action">`@Action`</span>

The `@Action` decorator is used to inject an action from a [Pinia] store into a 
[Vue class-style component]. It allows you to call action functions from the store 
within your component.

The syntax of the `@Action` decorator is as follows:
```javascript
@Action(store: object, actionName?: string)
```

- `store` (required): The injected [Pinia] store object defined using the
  `defineStore()` function from [Pinia].
- `actionName` (optional): The name of the injected action of the store.
  If not provided, the decorator uses the decorated field name as the injected
  action name.

### <span id="store">`@Store`</span>

The `@Store` decorator is used to inject the entire [Pinia] store into a Vue 
class-style component. It allows you to access all the state, getters, and 
actions of the store.

The syntax of the `@Store` decorator is as follows:
```javascript
@Store(store: object)
```

- `store` (required): The function creating a [Pinia] store object defined with 
  the `defineStore()` function from Pinia.

### <span id="define-store">`@DefineStore`</span>

The `@DefineStore` decorator is used to decorate a class as a [Pinia] store.

The syntax of the `@DefineStore` decorator is as follows:
```javascript
@DefineStore(storeId: string)
```

- `storeId` (required): The id of the store.

Note that the `@DefineStore` also support the inheritance of the store class.

## <span id="example">Example</span>

Here's a simple example of how to use these decorators in your Vue component:

```javascript
import { Component, toVue } from '@haixing_hu/vue3-class-component';
import { State, WritableState, Getter, Action, Store } from '@haixing_hu/pinia-decorator';
import { useMyStore } from './my-pinia-store-module';

@Component
export class MyComponent extends Vue {
  @State(useMyStore)
  myValue;
  
  @State(useMyStore, 'message')
  myMessage;

  @Getter(useMyStore) 
  myGetter

  @Getter(useMyStore, 'count')
  myCountGetter
  
  @Action(useMyStore)
  fetchData;
  
  @Action(useMyStore, 'sayMessage')
  mySayMessage;

  @Store(useMyStore) 
  store;
  
  someOtherMessage = 'Hello World!';
  
  callSayMessage() {
    console.log('MyComponent.callSayMessage');
    this.mySayMessage(this.myMessage);
  }
}

export default toVue(MyComponent);
```

For more details, check the following demo projects:
- [The demo project using vite](https://github.com/haixing-hu/pinia-decorator-demo-vite)
- [The demo project using webpack](https://github.com/haixing-hu/pinia-decorator-demo-webpack)

Here is an example to define a Pinia store using the `@DefineStore` decorator.
Note that the `@DefineStore` also support the inheritance of the store class.

```javascript
import { DefineStore } from '@haixing_hu/pinia-decorators';
import dayjs from 'dayjs';

class BaseUserStore {
  id = '';

  username = '';

  password = '';
  
  nickname = '';

  get age() {
    throw new Error('Should be override by subclass');
  }
  
  setNickname(nickname) {
    this.nickname = nickname;
  }

  login() {
    throw new Error('Should be override by subclass');
  }
}

@DefineStore('user')
class UserStore extends BaseUserStore {   // support inheritance of the store class
  avatar = '';

  birthday = '';

  get age() {
    return dayjs().diff(this.birthday, 'year');
  }

  setAvatar(avatar) {
    this.avatar = avatar;
  }

  updatePassword(password) {
    this.password = newPassword;
    return api.updatePassword(this.username, newPassword);
  }

  login() {
    return api.login(this.username, this.password);
  }
}

export default UserStore;
```

The above example defines a Pinia store named `user` which is equivalent to the following code:

```javascript
import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    username: '',
    password: '',
    nickname: '',
    avatar: '',
    birthday: '',
  }),
  
  getters: {
    age: (state) => dayjs().diff(state.birthday, 'year'),
  },
  
  actions: {
    setNickname(nickname) {
      this.nickname = nickname;
    },
    setAvatar(avatar) {
      this.avatar = avatar;
    },
    updatePassword(newPassword) {
      this.password = newPassword;
      return api.updatePassword(this.username, newPassword);
    },
    login() {
      return api.login(this.username, this.password);
    },
  },
});

export default useUserStore;
```

We can use the `user` store in the Vue components as follows:
```vue
<template>
  <div>
    <div>Username: {{ username }}</div>
    <div>Age: {{ age }}</div>
    <div>Avatar: <img :src="avatar" /></div>
    <button @click="setNickname('new-nickname')">Set Nickname</button>
    <button @click="updatePassword('new-password')">Change Password</button>
    <button @click="login()">Login</button>
  </div>
</template>
<script>
import { Component, toVue } from '@haixing_hu/vue3-class-component';
import { State, Getter, Action } from '@haixing_hu/pinia-decorators';
import UserStore from 'src/stores/user';

@Component
class UserPage {
  @State(UserStore)
  username;

  @State(UserStore)
  avatar;

  @Getter(UserStore)
  age;

  @Action(UserStore)
  setNickname;
  
  @Action(UserStore)
  updatePassword;

  @Action(UserStore)
  login;
}

export default toVue(UserPage);
</script>
```

## <span id="contributing">Contributing</span>

If you find any issues or have suggestions for improvements, please feel free
to open an issue or submit a pull request to the [GitHub repository].

We welcome your contributions and feedback!

## <span id="license">License</span>

[pinia-decorator] is distributed under the Apache 2.0 license. 
See the [LICENSE](LICENSE) file for more details.

[pinia-decorator]: https://npmjs.com/package/@haixing_hu/pinia-decorator
[Pinia]: https://pinia.vuejs.org/
[Vue]: https://vuejs.org/
[Vue 3]: https://vuejs.org/
[Vue class-style components]: https://npmjs.com/package/@haixing_hu/vue3-class-component
[Vue class-style component]: https://npmjs.com/package/@haixing_hu/vue3-class-component
[vue3-class-component]: https://npmjs.com/package/@haixing_hu/vue3-class-component
[stage 3 proposal of JavaScript decorators]: https://github.com/tc39/proposal-decorators
[vuex-class]: https://github.com/ktsn/vuex-class
[pinia-class]: https://github.com/jquagliatini/pinia-class
[vue-facing-decorator]: https://github.com/facing-dev/vue-facing-decorator
[GitHub repository]: https://github.com/Haixing-Hu/pinia-decorator
