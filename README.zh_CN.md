# pinia-decorator

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/pinia-decorator.svg)](https://npmjs.com/package/@qubit-ltd/pinia-decorator)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![English Document](https://img.shields.io/badge/Document-English-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/pinia-decorator/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/pinia-decorator/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/pinia-decorator/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/pinia-decorator?branch=master)

[pinia-decorator] 是一个 JavaScript 库，它使用了 [JavaScript 装饰器的第三阶段提案]，
简化了将 [Pinia] 存储与 [Vue 类风格组件] 集成的过程。换句话说，它提供了类似于 [vuex-class] 
和 [pinia-class] 库的功能。

该库受 [vuex-class] 和 [pinia-class] 的启发，但存在一些关键区别：

1. 它是用纯 JavaScript 实现的，不需要 TypeScript 支持。
2. 它支持 [Vue 3]。
3. 它支持使用 [vue3-class-component] 实现的 JavaScript 类风格 Vue 组件，
   而 [pinia-class] 主要针对使用 [vue-facing-decorator] 实现的 TypeScript 类风格 Vue 组件。
4. 它提供了 [toStore](#tostore-函数) 函数，用于将一个类转换为 Pinia 存储。

## 目录

- [pinia-decorator](#pinia-decorator)
  - [目录](#目录)
  - [安装](#安装)
  - [使用](#使用)
    - [@State 装饰器](#state-装饰器)
    - [@WritableState 装饰器](#writablestate-装饰器)
    - [@Getter 装饰器](#getter-装饰器)
    - [@Action 装饰器](#action-装饰器)
    - [@Store 装饰器](#store-装饰器)
    - [@RawField 装饰器](#rawfield-装饰器)
    - [toStore 函数](#tostore-函数)
  - [示例](#示例)
  - [贡献](#贡献)
  - [许可证](#许可证)

## <span id="安装">安装</span>

你可以通过 npm 或 yarn 安装 [pinia-decorator]：

```bash
npm install @qubit-ltd/pinia-decorator
```
或
```bash
yarn add @qubit-ltd/pinia-decorator
```

## <span id="使用">使用</span>

[pinia-decorator] 为 [Vue 3 类风格组件] 提供了以下装饰器/函数：

- @State：用于将只读状态从 [Pinia] 存储注入到组件中。
- @WritableState：用于将可写状态从 [Pinia] 存储注入到组件中。
- @Getter：用于将 getter 从 [Pinia] 存储注入到组件中。
- @Action：用于将 action 从 [Pinia] 存储注入到组件中。
- @Store：用于将整个 [Pinia] 存储注入到组件中。
- @RawField：用于将一个类的字段标记为原始字段（非响应式字段）。
- toStore：用于将一个类转换为 [Pinia] 存储。

### <span id="state-装饰器">@State 装饰器</span>

`@State` 装饰器用于将只读状态从 [Pinia] 存储注入到 [Vue 类风格组件] 中。
它允许你在组件内部访问和使用 [Pinia] 存储的状态。

`@State` 装饰器的语法如下：

```js
@State(store: Object, stateName?: string)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象。
- `stateName`（可选）：待注入的状态在 [Pinia] 存储中的名称。如果未提供，
  装饰器将使用被装饰的字段名作为待注入的状态的名称。

示例：
```js
@State(useUserStore)
username;  // 注入用户存储中的 'username' 状态

@State(useUserStore, 'avatar')
userAvatar;  // 将用户存储中的 'avatar' 状态注入为 'userAvatar'
```

### <span id="writablestate-装饰器">@WritableState 装饰器</span>

`@WritableState` 装饰器与 `@State` 类似，但它允许你将可写状态从 [Pinia] 存储注入到 
[Vue 类风格组件] 中。这意味着你可以在组件内部既读取又修改 [Pinia] 存储的状态值。

`@WritableState` 装饰器的语法如下：

```javascript
@WritableState(store: Object, stateName?: string)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象。
- `stateName`（可选）：待注入的状态在 [Pinia] 存储中的名称。如果未提供，
  装饰器将使用被装饰的字段名作为待注入的状态的名称。

示例：
```js
@WritableState(useUserStore)
nickname;  // 注入用户存储中的 'nickname' 状态，允许读取和修改

@WritableState(useUserStore, 'avatar')
userAvatar;  // 将用户存储中的 'avatar' 状态注入为 'userAvatar'，允许读取和修改
```

### <span id="getter-装饰器">@Getter 装饰器</span>

`@Getter` 装饰器用于将 getter 从 [Pinia] 存储注入到 [Vue 类风格组件] 中。
它允许你在组件内部调用 [Pinia] 存储的 getter 函数。

`@Getter` 装饰器的语法如下：

```javascript
@Getter(store: Object, getterName?: string)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象。
- `getterName`（可选）：待注入的 getter 在 [Pinia] 存储中的名称。如果未提供，
  装饰器将使用被装饰的字段名作为待注入的 getter 的名称。

示例：
```js
@Getter(useUserStore)
isLoggedIn;  // 注入用户存储中的 'isLoggedIn' getter

@Getter(useUserStore, 'fullName')
userName;  // 将用户存储中的 'fullName' getter 注入为 'userName'
```

### <span id="action-装饰器">@Action 装饰器</span>

`@Action` 装饰器用于将 action 从 [Pinia] 存储注入到 [Vue 类风格组件] 中。
它允许你在组件内部调用存储的 action 函数。

`@Action` 装饰器的语法如下：

```javascript
@Action(store: Object, actionName?: string)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象。
- `actionName`（可选）：待注入的 action 在 [Pinia] 存储中的名称。如果未提供，
  装饰器将使用被装饰的字段名作为待注入的 action 的名称。

示例：
```js
@Action(useUserStore)
login;  // 注入用户存储中的 'login' action

@Action(useUserStore, 'updateProfile')
updateUserProfile;  // 将用户存储中的 'updateProfile' action 注入为 'updateUserProfile'
```

### <span id="store-装饰器">@Store 装饰器</span>

`@Store` 装饰器用于将整个 [Pinia] 存储注入到 Vue 类风格组件中。它允许你访问存储的所有状态、
getter 和 action。

`@Store` 装饰器的语法如下：

```javascript
@Store(store: Object)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象的创建函数。

示例：
```js
@Store(useUserStore)
userStore;  // 将整个用户存储注入为 'userStore'
```

### <span id="rawfield-装饰器">@RawField 装饰器</span>

`@RawField` 装饰器用于将一个类的字段标记为原始字段，这样该类被转换为 Pinia store 后，该
字段表示的状态不会被转换为响应式状态。

`@RawField` 装饰器的语法如下：
```javascript
@RawField
fieldName;
```

示例：
```js
class UserStore {
  username = '';
  
  @RawField
  logger = createLogger('UserStore');  // 这个字段不会成为响应式的
  
  login(username, password) {
    this.logger.info(`用户 ${username} 尝试登录`);
    // 登录逻辑
  }
}

export default toStore('user', UserStore);
```

### <span id="tostore-函数">toStore 函数</span>

`toStore()` 函数用于将一个类转换为 [Pinia] 存储。它允许你定义一个类，该类的实例将作为 Pinia 存储的实例。

`toStore()` 函数的语法如下：

```javascript
toStore(storeId: string, Class: function)
```

- `storeId`（必需）：Pinia 存储的ID。
- `Class`（必需）：待转换为 Pinia 存储的类。

注意：
- `toStore` 函数支持类的继承。
- 类中定义的属性将成为 Pinia 存储中的状态。
- 类中定义的 getter 方法将成为 Pinia 存储中的 getter。
- 类中定义的普通方法将成为 Pinia 存储中的 action。

示例：
```js
import { toStore } from '@qubit-ltd/pinia-decorator';

class UserStore {
  username = '';
  token = null;
  
  get isLoggedIn() {
    return !!this.token;
  }
  
  async login(username, password) {
    // 登录逻辑
    this.username = username;
    this.token = await api.getToken(username, password);
  }
  
  logout() {
    this.username = '';
    this.token = null;
  }
}

export default toStore('user', UserStore);
```

## <span id="示例">示例</span>

以下是如何在 Vue 组件中使用这些装饰器的简单示例：

```javascript
import { Component, toVue } from '@qubit-ltd/vue3-class-component';
import { State, WritableState, Getter, Action, Store } from '@qubit-ltd/pinia-decorator';
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

下面是一个使用 `toStore()` 函数的示例，注意该函数支持类的继承：

```javascript
import { toStore, RawField } from '@qubit-ltd/pinia-decorator';
import { Logger } from '@qubit-ltd/logging';
import dayjs from 'dayjs';

class BaseUserStore {
  id = '';

  username = '';

  password = '';

  nickname = '';

  token = {
    value: 'token-value',
    expired: 1000,
  };

  get age() {
    throw new Error('This getter will be overridden by subclass');
  }

  setNickname(nickname) {
    this.nickname = nickname;
  }

  login() {
    throw new Error('This function will be overridden by subclass');
  }
}

class UserStore extends BaseUserStore {     // 支持类的继承 
  avatar = '';

  birthday = '';

  @RawField
  logger = Logger.getLogger('store.user'); // 这个字段被标记为原始字段

  get age() { // 覆盖父类的 getter
    return dayjs().diff(this.birthday, 'year');
  }

  setAvatar(avatar) {
    this.avatar = avatar;
  }

  updatePassword(newPassword) {
    this.password = newPassword;
    return api.updatePassword(this.username, newPassword);
  }

  login() {   // 覆盖父类的方法
    this.logger.info('Logging in as:', this.username);
    return api.login(this.username, this.password);
  }
}

export default toStore('user', UserStore);
```

以上例子定义了一个名为 `user` 的 Pinia 存储，它等价于以下代码：

```javascript
import { defineStore } from 'pinia';
import { markRaw } from 'vue';

const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    username: '',
    password: '',
    nickname: '',
    token: {
      value: 'token-value',
      expired: 1000,
    },
    avatar: '',
    birthday: '',
    logger: markRaw(Logger.getLogger('store.user')),
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
      this.logger.info('Logging in as:', this.username);
      return api.login(this.username, this.password);
    },
  },
});

export default useUserStore;
```

我们可以按如下方式在 Vue 组件中使用 `user` 存储：

```vue
<template>
  <div>
    <div>用户名: {{ username }}</div>
    <div>昵称: {{ nickname }}</div>
    <div>年龄: {{ age }}</div>
    <div>头像: <img :src="avatar" /></div>
    <button @click="setNickname('新昵称')">设置昵称</button>
    <button @click="avatar = '新头像.png'">设置头像</button>
    <button @click="updatePassword('新密码')">修改密码</button>
    <button @click="login()">登录</button>
  </div>
</template>
<script>
import { Component, toVue } from '@qubit-ltd/vue3-class-component';
import { State, WritableState, Getter, Action } from '@qubit-ltd/pinia-decorator';
import UserStore from 'src/stores/user';

@Component
class UserPage {
  @State(UserStore)
  username;

  @State(UserStore)
  nickname;

  @WritableState(UserStore)
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

有关更多详细信息，请查看以下演示项目：

- [使用 vite 的演示项目](https://github.com/haixing-hu/pinia-decorator-demo-vite)
- [使用 webpack 的演示项目](https://github.com/haixing-hu/pinia-decorator-demo-webpack)

## <span id="贡献">贡献</span>

如果你发现任何问题或有改进建议，请随时在 [GitHub 仓库] 中提出问题或提交请求。

我们欢迎你的贡献和反馈！

## <span id="许可证">许可证</span>

`pinia-decorator` 遵循 Apache 2.0 许可证分发。

请查看 [LICENSE](LICENSE) 文件以获取更多详细信息。

[pinia-decorator]: https://npmjs.com/package/@qubit-ltd/pinia-decorator
[Pinia]: https://pinia.vuejs.org/
[Vue]: https://vuejs.org/
[Vue 3]: https://vuejs.org/
[Vue 类风格组件]: https://npmjs.com/package/@qubit-ltd/vue3-class-component
[vue3-class-component]: https://npmjs.com/package/@qubit-ltd/vue3-class-component
[JavaScript 装饰器的第三阶段提案]: https://github.com/tc39/proposal-decorators
[vuex-class]: https://github.com/ktsn/vuex-class
[pinia-class]: https://github.com/jquagliatini/pinia-class
[vue-facing-decorator]: https://github.com/facing-dev/vue-facing-decorator
[GitHub 仓库]: https://github.com/Haixing-Hu/pinia-decorator
