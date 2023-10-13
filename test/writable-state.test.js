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
import { nextTick } from 'vue';
import { Component } from '@haixing_hu/vue3-class-component';
import { addFruitSpy, addFruitsSpy, selectFruitSpy, useBasketStore } from './data/basket';
import MyComponent from './data/MyComponent.vue';
import { WritableState } from '../src/index';

beforeEach(() => {
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.mocked(addFruitSpy).mockClear();
  vi.mocked(addFruitsSpy).mockClear();
  vi.mocked(selectFruitSpy).mockClear();
});

describe('Test @WritableState', () => {
  it('should map state with field name', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.selected).toStrictEqual('🍎');
    const selected = wrapper.get('#selected-fruit');
    expect(selected.text()).toBe('🍎');
  });
  it('map state with field name should be writable', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.selected).toStrictEqual('🍎');
    vm.selected = '🍍';
    await nextTick();
    const selected = wrapper.get('#selected-fruit');
    expect(selected.text()).toBe('🍍');
  });
  it('should map state with the specified name', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.writableFruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎']);
  });
  it('map state with the specified name should be writable', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.writableFruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎']);
    vm.writableFruits.push('🍍');
    await nextTick();
    const allFruits = wrapper.get('#all-fruits');
    expect(allFruits.text()).toBe('🍍,🍎,🍇,🍋,🍎,🍍');
  });
  it('should throw error if not decorated on a class field', () => {
    expect(() => {
      @Component
      class TestComponent {
        @WritableState(useBasketStore)
        foo() {
          console.log('hello');
        }
      }
      new TestComponent();
    }).toThrow('The @WritableState decorator can only be used to decorate a class field.');
  });
});
