////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createPinia, setActivePinia } from 'pinia';
import { isReactive } from 'vue';
import { Logger } from '@haixing_hu/logging';
import { toStore, RawField } from '../src/index';
import CustomizedAppender from './data/customized-appender';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('DefineStore', () => {
  it('should create a Pinia store with the correct state', () => {
    class TestStore {
      constructor() {
        this.value = 42;
      }
    }
    const useTestStore = toStore('test', TestStore);
    const store = useTestStore();
    expect(store.value).toBe(42);
  });

  it('should create a Pinia store with the correct getters', () => {
    class TestStore {
      constructor() {
        this.value = 42;
      }
      get doubleValue() {
        return this.value * 2;
      }
    }
    const useTestStore = toStore('test', TestStore);
    const store = useTestStore();
    expect(store.doubleValue).toBe(84);
  });

  it('should create a Pinia store with the correct actions', () => {
    class TestStore {
      value = 42;

      increment() {
        this.value += 1;
      }
    }
    const useTestStore = toStore('test', TestStore);
    const store = useTestStore();
    store.increment();
    expect(store.value).toBe(43);
  });

  it('should support class inheritance', () => {
    class BaseStore {
      value = 42;

      get doubleValue() {
        return this.value * 2;
      }

      get fullName() {
        throw new Error('should be overwrite by sub-classes');
      }

      increment() {
        this.value += 1;
      }

      decrement() {
        throw new Error('should be overwrite by sub-classes');
      }
    }

    class TestStore extends BaseStore {
      name = 'Test';

      get fullName() {
        return `${this.name} Store`;
      }

      set foo(value) {
        this.name += value;
      }

      decrement() {
        this.value -= 1;
      }
    }
    const useTestStore = toStore('test', TestStore);
    const store = useTestStore();

    expect(store.value).toBe(42);
    expect(store.name).toBe('Test');
    expect(store.doubleValue).toBe(84);
    expect(store.fullName).toBe('Test Store');
    store.increment();
    expect(store.value).toBe(43);
    store.decrement();
    expect(store.value).toBe(42);
    expect(store.foo).toBeUndefined();

    expect(store.$state.value).toBe(42);
    expect(store.$state.name).toBe('Test');
    expect(Object.getOwnPropertyNames(store.$state)).toEqual(['value', 'name']);
  });

  it('should support initialization of properties in the constructor', () => {
    class BaseStore {
      value = 42;

      code = 'base';

      constructor(value) {
        this.value = value;
      }

      get doubleValue() {
        return this.value * 2;
      }

      get fullName() {
        throw new Error('should be overwrite by sub-classes');
      }

      increment() {
        this.value += 1;
      }

      decrement() {
        throw new Error('should be overwrite by sub-classes');
      }
    }

    class TestStore extends BaseStore {
      name = 'Test';

      code = 'sub';  // overwrite

      constructor() {
        super(100);
        this.name = 'Hello';
      }

      get fullName() {
        return `${this.name} Store`;
      }

      set foo(value) {
        this.name += value;
      }

      decrement() {
        this.value -= 1;
      }
    }
    const useTestStore = toStore('test', TestStore);
    const store = useTestStore();

    expect(store.value).toBe(100);
    expect(store.name).toBe('Hello');
    expect(store.code).toBe('sub');
    expect(store.doubleValue).toBe(200);
    expect(store.fullName).toBe('Hello Store');
    store.increment();
    expect(store.value).toBe(101);
    store.decrement();
    expect(store.value).toBe(100);
    expect(store.foo).toBeUndefined();

    expect(store.$state.value).toBe(100);
    expect(store.$state.name).toBe('Hello');
    expect(store.$state.code).toBe('sub');
    expect(Object.getOwnPropertyNames(store.$state)).toEqual(['value', 'code', 'name']);
  });

  it('should support dynamic super class', () => {
    function getBaseClass(logger) {
      return class {
        value = 42;

        code = 'base';

        constructor(value) {
          this.value = value;
        }

        get doubleValue() {
          return this.value * 2;
        }

        get fullName() {
          throw new Error('should be overwrite by sub-classes');
        }

        increment() {
          this.value += 1;
        }

        decrement() {
          throw new Error('should be overwrite by sub-classes');
        }

        hello() {
          logger.info('Hello World!');
        }
      };
    }
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('TestLogger', { appender, level: 'TRACE' });

    class TestStore extends getBaseClass(logger) {
      name = 'Test';

      code = 'sub';  // overwrite

      constructor() {
        super(100);
        this.name = 'Hello';
      }

      get fullName() {
        return `${this.name} Store`;
      }

      set foo(value) {
        this.name += value;
      }

      decrement() {
        this.value -= 1;
      }
    }

    const useTestStore = toStore('test', TestStore);
    const store = useTestStore();

    expect(store.value).toBe(100);
    expect(store.name).toBe('Hello');
    expect(store.code).toBe('sub');
    expect(store.doubleValue).toBe(200);
    expect(store.fullName).toBe('Hello Store');
    store.increment();
    expect(store.value).toBe(101);
    store.decrement();
    expect(store.value).toBe(100);
    expect(store.foo).toBeUndefined();

    expect(store.$state.value).toBe(100);
    expect(store.$state.name).toBe('Hello');
    expect(store.$state.code).toBe('sub');
    expect(Object.getOwnPropertyNames(store.$state)).toEqual(['value', 'code', 'name']);

    expect(typeof store.hello).toBe('function');
    store.hello();
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0].type).toBe('INFO');
    expect(appender.logs[0].args).toEqual([
      '[INFO] TestLogger - Hello World!',
    ]);
  });

  it('should support @RawField', () => {
    class BaseClass {
      value = 42;

      code = 'base';

      base = {
        id: 1,
        name: 'Base',
      };

      @RawField
      logger = null;

      constructor(value, logger) {
        this.value = value;
        this.logger = logger;
      }

      get doubleValue() {
        return this.value * 2;
      }

      get fullName() {
        throw new Error('should be overwrite by sub-classes');
      }

      increment() {
        this.value += 1;
      }

      decrement() {
        throw new Error('should be overwrite by sub-classes');
      }

      hello() {
        this.logger.info('Hello World!');
      }
    }

    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('TestLogger', { appender, level: 'TRACE' });

    class TestStore extends BaseClass {
      name = 'Test';

      code = 'sub';  // overwrite

      obj = {
        id: 123,
        code: 'abc',
      };

      constructor() {
        super(100, logger);
        this.name = 'Hello';
      }

      get fullName() {
        return `${this.name} Store`;
      }

      set foo(value) {
        this.name += value;
      }

      decrement() {
        this.value -= 1;
      }
    }

    const useTestStore = toStore('test', TestStore);
    const store = useTestStore();
    expect(store.value).toBe(100);
    expect(store.name).toBe('Hello');
    expect(store.code).toBe('sub');
    expect(store.base).toEqual({ id: 1, name: 'Base' });
    expect(store.obj).toEqual({ id: 123, code: 'abc' });
    expect(store.logger).toBe(logger);
    expect(store.doubleValue).toBe(200);
    expect(store.fullName).toBe('Hello Store');
    store.increment();
    expect(store.value).toBe(101);
    store.decrement();
    expect(store.value).toBe(100);
    expect(store.foo).toBeUndefined();

    expect(store.$state.value).toBe(100);
    expect(store.$state.name).toBe('Hello');
    expect(store.$state.code).toBe('sub');
    expect(store.$state.base).toEqual({ id: 1, name: 'Base' });
    expect(store.$state.obj).toEqual({ id: 123, code: 'abc' });
    expect(store.$state.logger).toBe(logger);
    expect(Object.getOwnPropertyNames(store.$state))
      .toEqual(['value', 'code', 'base', 'logger', 'name', 'obj']);

    expect(typeof store.hello).toBe('function');
    store.hello();
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0].type).toBe('INFO');
    expect(appender.logs[0].args).toEqual([
      '[INFO] TestLogger - Hello World!',
    ]);

    expect(isReactive(store.$state.obj)).toBe(true);
    expect(isReactive(store.$state.base)).toBe(true);
    expect(isReactive(store.$state.logger)).toBe(false);
  });

  it('should throw error if the first argument is not a string', () => {
    class Foo {}
    expect(() => {
      toStore(123, Foo);
    }).toThrow(TypeError, 'The first argument must be a string.');
  });

  it('should throw error if the second argument is not a class', () => {
    expect(() => {
      toStore('test', 'xxx');
    }).toThrow(TypeError, 'The second argument must be a class.');
  });
});
