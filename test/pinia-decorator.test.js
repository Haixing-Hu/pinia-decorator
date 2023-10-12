/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { describe, it, afterEach, beforeEach, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { addFruitSpy, addFruitsSpy, selectFruitSpy } from './data/basket';
import MyComponent from './data/MyComponent.vue';

beforeEach(() => {
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.mocked(addFruitSpy).mockClear();
  vi.mocked(addFruitsSpy).mockClear();
  vi.mocked(selectFruitSpy).mockClear();
});

describe('pinia-decorator', () => {
  describe('Test @State', () => {
    console.log('MyComponent:', MyComponent);
    const wrapper = mount(MyComponent);
    const vm = wrapper.vm;
    it('should map state with field name', () => {
      expect(vm.fruits).toStrictEqual(['🍍', '🍎', '🍇', '🍋']);
    });
    it('should map state with state name', () => {
      expect(vm.selectedFruit).toBe('');
    });
  });
  // describe('Getters', () => {
  //   const wrapper = mount(MyComponent);
  //   it('should map to a specific key', () => {
  //     const component = factory();
  //     const got = component.computed.myFruitCount()('🍎')
  //     console.log(got);
  //     expect(got).toBe(1);
  //   });
  //
  //   it('should map to the attribute name', () => {
  //     const component = factory();
  //     expect(component.computed.count()).toBe(4);
  //   });
  // });
  //
  // describe('Actions', () => {
  //   it('should map to an action by key', () => {
  //     const component = factory();
  //     component.methods.addFruit('🍎');
  //     expect(addFruitSpy).toHaveBeenCalledWith('🍎');
  //   });
  //
  //   it('should map to an action by attribute name', () => {
  //     const component = factory();
  //     component.methods.addFruits(['🍎', '🍎']);
  //     expect(addFruitsSpy).toHaveBeenCalledWith(['🍎', '🍎']);
  //   });
  // });
  //
  // describe('Store', () => {
  //   it('should map the store directly in the component', () => {
  //     const component = factory();
  //     component.computed.$store().addFruits(['🍎', '🍎']);
  //     expect(addFruitsSpy).toHaveBeenCalledWith(['🍎', '🍎']);
  //   });
  // });
});
