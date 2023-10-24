////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { defineStore } from 'pinia';
import { vi } from "vitest";

const addFruitSpy = vi.fn(function (fruit) {
  this.fruits.push(fruit);
});

const addFruitsSpy = vi.fn(function (fruits) {
  this.fruits.push(...fruits);
});

const selectFruitSpy = vi.fn(function (fruit) {
  this.selected = fruit;
});

const useBasketStore = defineStore('basket', {
  state: () => ({
    fruits: ['🍍', '🍎', '🍇', '🍋', '🍎'],
    selected: '🍎',
  }),
  getters: {
    fruitCount: (state) => (fruit) =>
        state.fruits.filter((f) => f === fruit).length,
    count: (state) => state.fruits.length,
  },
  actions: {
    addFruit: addFruitSpy,
    addFruits: addFruitsSpy,
    selectFruit: selectFruitSpy,
  },
});

export {
  addFruitSpy,
  addFruitsSpy,
  selectFruitSpy,
  useBasketStore,
};
