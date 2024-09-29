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
});
