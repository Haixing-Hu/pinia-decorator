////////////////////////////////////////////////////////////////////////////////
import { Component } from '@haixing_hu/vue3-class-component';
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createPinia, setActivePinia } from 'pinia';
import { DefineStore } from '../src/index';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('DefineStore', () => {
  it('should create a Pinia store with the correct state', () => {
    @DefineStore('testStore')
    class TestStore {
      constructor() {
        this.value = 42;
      }
    }
    const useTestStore = TestStore;
    const store = useTestStore();
    expect(store.value).toBe(42);
  });

  it('should create a Pinia store with the correct getters', () => {
    @DefineStore('testStore')
    class TestStore {
      constructor() {
        this.value = 42;
      }
      get doubleValue() {
        return this.value * 2;
      }
    }
    const useTestStore = TestStore;
    const store = useTestStore();
    expect(store.doubleValue).toBe(84);
  });

  it('should create a Pinia store with the correct actions', () => {
    @DefineStore('testStore')
    class TestStore {
      value = 42;

      increment() {
        this.value += 1;
      }
    }
    const useTestStore = TestStore;
    const store = useTestStore();
    store.increment();
    expect(store.value).toBe(43);
  });

  it('should throw error if not decorated on a class', () => {
    expect(() => {
      class TestStore {
        @DefineStore('testStore')
        value = 42;

        increment() {
          this.value += 1;
        }
      }
      new TestStore();
    }).toThrow(TypeError, 'The `@DefineStore` can only decorate a class.');
  });

  it('should throw an error if context is not an object', () => {
    class TestStore {}
    expect(() => DefineStore('testStore')(TestStore, null)).toThrow(TypeError);
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
    @DefineStore('test')
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
    const store = TestStore();

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
    @DefineStore('test')
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
    const store = TestStore();

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
});
