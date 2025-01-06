////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createPinia, setActivePinia } from 'pinia';
import { config, mount } from '@vue/test-utils';
import { Component } from '@qubit-ltd/vue3-class-component';
import { useBasketStore } from './data/basket';
import MyComponent from './data/MyComponent.vue';
import { Store } from '../src/index';

beforeEach(() => {
  const pinia = createPinia();
  setActivePinia(pinia);
  config.global.plugins = [pinia];
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Test @Store', () => {
  it('should map store', () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.store).toBe(useBasketStore());
  });
  it('should throw error if not decorated on a class field', () => {
    expect(() => {
      @Component
      class TestComponent {
        @Store(useBasketStore)
        foo() {
          console.log('hello');
        }
      }
      new TestComponent();
    }).toThrow('The @Store decorator can only be used to decorate a class field.');
  });
});
