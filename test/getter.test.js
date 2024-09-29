////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { Component } from '@haixing_hu/vue3-class-component';
import { useBasketStore } from './data/basket';
import MyComponent from './data/MyComponent.vue';
import { Getter } from '../src/index';

beforeEach(() => {
  setActivePinia(createPinia());
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Test @Getter', () => {
  it('should map getter with field name', () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    const appleCount = vm.fruitCount('🍎');
    expect(appleCount).toBe(2);
    const selectedCount = wrapper.get('#selected-count');
    expect(selectedCount.text()).toBe('2');
    const pineappleCount = vm.fruitCount('🍍');
    expect(pineappleCount).toBe(1);
    vm.selected = '🍍';
    expect(selectedCount.text()).toBe('2');
  });
  it('should map getter with the specific name', () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.totalCount).toBe(5);
    const totalCount = wrapper.get('#total-count');
    expect(totalCount.text()).toBe('5');
  });
  it('should throw error if not decorated on a class field', () => {
    expect(() => {
      @Component
      class TestComponent {
        @Getter(useBasketStore)
        foo() {
          console.log('hello');
        }
      }
      new TestComponent();
    }).toThrow('The @Getter decorator can only be used to decorate a class field.');
  });
});
