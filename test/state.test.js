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
import { State } from '../src/index';

beforeEach(() => {
  const pinia = createPinia();
  setActivePinia(pinia);
  config.global.plugins = [pinia];
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Test @State', () => {
  it('should map state with field name', () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎']);
    const fruits = wrapper.get('#fruits');
    expect(fruits.text()).toBe('🍍,🍎,🍇,🍋,🍎');
  });
  it('should map state with the specified name', () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.allFruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎']);
    const allFruits = wrapper.get('#all-fruits');
    expect(allFruits.text()).toBe('🍍,🍎,🍇,🍋,🍎');
  });
  it('should throw error if not decorated on a class field', () => {
    expect(() => {
      @Component
      class TestComponent {
        @State(useBasketStore)
        foo() {
          console.log('hello');
        }
      }
      new TestComponent();
    }).toThrow('The @State decorator can only be used to decorate a class field.');
  });
});
