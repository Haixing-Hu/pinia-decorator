# pinia-decorator

[![npm package](https://img.shields.io/npm/v/@haixing_hu/pinia-decorator.svg)](https://npmjs.com/package/@haixing_hu/pinia-decorator)
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
4. 它支持使用 [`@DefineStore`](#define-store) 装饰器将一个类定义为 Pinia 存储。

## 目录

- [安装](#installation)
- [使用](#usage)
  - [`@State`](#state)
  - [`@WritableState`](#writable-state)
  - [`@Getter`](#getter)
  - [`@Action`](#action)
  - [`@Store`](#store)
  - [`@DefineStore`](#define-store)
- [示例](#example)
- [贡献](#contributing)
- [许可证](#license)

## <span id="installation">安装</span>

你可以通过 npm 或 yarn 安装 [pinia-decorator]：

```bash
npm install @haixing_hu/pinia-decorator
```
或
```
yarn add @haixing_hu/pinia-decorator
```

## <span id="usage">使用</span>

[pinia-decorator] 为 [Vue 3 类风格组件] 提供了以下装饰器：

- `@State`：用于将只读状态从 [Pinia] 存储注入到组件中。
- `@WritableState`：用于将可写状态从 [Pinia] 存储注入到组件中。
- `@Getter`：用于将 getter 从 [Pinia] 存储注入到组件中。
- `@Action`：用于将 action 从 [Pinia] 存储注入到组件中。
- `@Store`：用于将整个 [Pinia] 存储注入到组件中。
- `@DefineStore`：用于将一个类定义为 Pinia 存储。

### <span id="state">`@State`</span>

`@State` 装饰器用于将只读状态从 [Pinia] 存储注入到 [Vue 类风格组件] 中。
它允许你在组件内部访问和使用 [Pinia] 存储的状态。

`@State` 装饰器的语法如下：

```js
@State(store: Object, stateName?: string)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象。
- `stateName`（可选）：待注入的状态在 [Pinia] 存储中的名称。如果未提供，
  装饰器将使用被装饰的字段名作为待注入的状态的名称。

### <span id="writable-state">`@WritableState`</span>

`@WritableState` 装饰器与 `@State` 类似，但它允许你将可写状态从 [Pinia] 存储注入到 
[Vue 类风格组件] 中。这意味着你可以在组件内部既读取又修改 [Pinia] 存储的状态值。

`@WritableState` 装饰器的语法如下：

```javascript
@WritableState(store: Object, stateName?: string)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象。
- `stateName`（可选）：待注入的状态在 [Pinia] 存储中的名称。如果未提供，
  装饰器将使用被装饰的字段名作为待注入的状态的名称。

### <span id="getter">`@Getter`</span>

`@Getter` 装饰器用于将 getter 从 [Pinia] 存储注入到 [Vue 类风格组件] 中。
它允许你在组件内部调用 [Pinia] 存储的 getter 函数。

`@Getter` 装饰器的语法如下：

```javascript
@Getter(store: Object, getterName?: string)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象。
- `getterName`（可选）：待注入的 getter 在 [Pinia] 存储中的名称。如果未提供，
  装饰器将使用被装饰的字段名作为待注入的 getter 的名称。

### <span id="action">`@Action`</span>

`@Action` 装饰器用于将 action 从 [Pinia] 存储注入到 [Vue 类风格组件] 中。
它允许你在组件内部调用存储的 action 函数。

`@Action` 装饰器的语法如下：

```javascript
@Action(store: Object, actionName?: string)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象。
- `actionName`（可选）：待注入的 action 在 [Pinia] 存储中的名称。如果未提供，
  装饰器将使用被装饰的字段名作为待注入的 action 的名称。
- 
### <span id="store">`@Store`</span>

`@Store` 装饰器用于将整个 [Pinia] 存储注入到 Vue 类风格组件中。它允许你访问存储的所有状态、
getter 和 action。

`@Store` 装饰器的语法如下：

```javascript
@Store(store: Object)
```

- `store`（必需）：使用 `Pinia` 的 `defineStore()` 函数定义的待注入的 [Pinia] 存储对象的创建函数。

### <span id="define-store">`@DefineStore`</span>

`@DefineStore` 装饰器用于将一个类定义为 Pinia 存储。它允许你定义一个类，该类的实例将作为 Pinia 存储的实例。

`@DefineStore` 装饰器的语法如下：

```javascript
@DefineStore(storeId: string)
```

- `storeId`（必需）：Pinia 存储的ID。

## <span id="example">示例</span>

以下是如何在 Vue 组件中使用这些装饰器的简单示例：

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

有关更多详细信息，请查看以下演示项目：

- [使用 vite 的演示项目](https://github.com/haixing-hu/pinia-decorator-demo-vite)
- [使用 webpack 的演示项目](https://github.com/haixing-hu/pinia-decorator-demo-webpack)

下面是一个使用 `@DefineStore` 装饰器的示例：

```javascript
import { DefineStore } from '@haixing_hu/pinia-decorators';
import dayjs from 'dayjs';

@DefineStore('user')
class UserStore {
  id = '';

  username = '';

  password = '';

  nickname = '';

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

以上例子定义了一个名为 `user` 的 Pinia 存储，它等价于以下代码：

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

我们可以按如下方式在 Vue 组件中使用 `UserStore`：

```vue
<template>
  <div>
    <div>Username: {{ username }}</div>
    <div>Age: {{ age }}</div>
    <div>Avatar: <img :src="avatar" /></div>
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
  updatePassword;

  @Action(UserStore)
  login;
}

export default toVue(UserPage);
</script>
```

## <span id="contributing">贡献</span>

如果你发现任何问题或有改进建议，请随时在 [GitHub 仓库] 中提出问题或提交请求。

我们欢迎你的贡献和反馈！

## <span id="license">许可证</span>

`pinia-decorator` 遵循 Apache 2.0 许可证分发。

请查看 [LICENSE](LICENSE) 文件以获取更多详细信息。

[pinia-decorator]: https://npmjs.com/package/@haixing_hu/pinia-decorator
[Pinia]: https://pinia.vuejs.org/
[Vue]: https://vuejs.org/
[Vue 3]: https://vuejs.org/
[Vue 类风格组件]: https://npmjs.com/package/@haixing_hu/vue3-class-component
[Vue 类风格组件]: https://npmjs.com/package/@haixing_hu/vue3-class-component
[vue3-class-component]: https://npmjs.com/package/@haixing_hu/vue3-class-component
[JavaScript 装饰器的第三阶段提案]: https://github.com/tc39/proposal-decorators
[vuex-class]: https://github.com/ktsn/vuex-class
[pinia-class]: https://github.com/jquagliatini/pinia-class
[vue-facing-decorator]: https://github.com/facing-dev/vue-facing-decorator
[GitHub 仓库]: https://github.com/Haixing-Hu/pinia-decorator
