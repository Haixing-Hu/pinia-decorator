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
import { Action } from '../src/index';

beforeEach(() => {
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.mocked(addFruitSpy).mockClear();
  vi.mocked(addFruitsSpy).mockClear();
  vi.mocked(selectFruitSpy).mockClear();
});

describe('Test @Action', () => {
  it('should map action with field name: addFruit', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎']);
    vm.addFruit('🍎');
    expect(addFruitSpy).toHaveBeenCalledWith('🍎');
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎', '🍎']);
    expect(vm.fruitCount('🍎')).toBe(3);
    expect(vm.totalCount).toBe(6);
    await nextTick();
    const fruits = wrapper.get('#fruits');
    expect(fruits.text()).toBe('🍍,🍎,🍇,🍋,🍎,🍎');
  });

  it('should map action with field name: selectFruit', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    const selected = wrapper.get('#selected-fruit');
    expect(vm.selected).toBe('🍎');
    expect(selected.text()).toBe('🍎');
    vm.selectFruit('🍇');
    expect(selectFruitSpy).toHaveBeenCalledWith('🍇');
    expect(vm.selected).toBe('🍇');
    await nextTick();
    expect(selected.text()).toBe('🍇');
  });

  it('should map action with the specific name: addFruits', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎']);
    vm.batchAddFruits(['🍎', '🍎']);
    expect(addFruitsSpy).toHaveBeenCalledWith(['🍎', '🍎']);
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎', '🍎', '🍎']);
    expect(vm.fruitCount('🍎')).toBe(4);
    expect(vm.totalCount).toBe(7);
    await nextTick();
    const fruits = wrapper.get('#fruits');
    expect(fruits.text()).toBe('🍍,🍎,🍇,🍋,🍎,🍎,🍎');
  });

  it('map action with field name, should triggered by button: addFruit', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎']);
    expect(vm.fruit).toBe('');
    const input = wrapper.get('#fruit');
    await input.setValue('🍇');
    await nextTick();
    expect(vm.fruit).toBe('🍇');
    const button = wrapper.get('#add-fruit');
    await button.trigger('click');
    expect(addFruitSpy).toHaveBeenCalledWith('🍇');
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎', '🍇']);
    await nextTick();
    const fruits = wrapper.get('#fruits');
    expect(fruits.text()).toBe('🍍,🍎,🍇,🍋,🍎,🍇');
  });

  it('map action with field name, should triggered by button: selectFruit', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    const selected = wrapper.get('#selected-fruit');
    expect(vm.selected).toBe('🍎');
    expect(selected.text()).toBe('🍎');
    const input = wrapper.get('#fruit');
    await input.setValue('🍇');
    await nextTick();
    expect(vm.fruit).toBe('🍇');
    const button = wrapper.get('#select-fruit');
    await button.trigger('click');
    expect(selectFruitSpy).toHaveBeenCalledWith('🍇');
    expect(vm.selected).toBe('🍇');
    await nextTick();
    expect(selected.text()).toBe('🍇');
  });

  it('map action with the specific name, should triggered by button: addFruits', async () => {
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎']);
    expect(vm.fruit).toBe('');
    const input = wrapper.get('#fruit');
    await input.setValue('🍇,🍋,🍎');
    await nextTick();
    expect(vm.fruit).toBe('🍇,🍋,🍎');
    const button = wrapper.get('#batch-add-fruits');
    await button.trigger('click');
    expect(addFruitsSpy).toHaveBeenCalledWith(['🍇', '🍋', '🍎']);
    expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋', '🍎', '🍇', '🍋', '🍎']);
    await nextTick();
    const fruits = wrapper.get('#fruits');
    expect(fruits.text()).toBe('🍍,🍎,🍇,🍋,🍎,🍇,🍋,🍎');
  });

  it('should throw error if not decorated on a class field', () => {
    expect(() => {
      @Component
      class TestComponent {
        @Action(useBasketStore)
        foo() {
          console.log('hello');
        }
      }
      new TestComponent();
    }).toThrow('The @Action decorator can only be used to decorate a class field.');
  });
});
