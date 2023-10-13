/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { vi, describe, it, afterEach, beforeEach, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { Component } from '@haixing_hu/vue3-class-component';
import { addFruitSpy, addFruitsSpy, selectFruitSpy, useBasketStore } from './data/basket';
import MyComponent from './data/MyComponent.vue';
import { Store } from '../src/index';

beforeEach(() => {
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.mocked(addFruitSpy).mockClear();
  vi.mocked(addFruitsSpy).mockClear();
  vi.mocked(selectFruitSpy).mockClear();
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
