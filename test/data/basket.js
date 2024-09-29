////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { defineStore } from 'pinia';

const addFruitSpy = jest.fn(function addFruit(fruit) {
  this.fruits.push(fruit);
});

const addFruitsSpy = jest.fn(function addFruits(fruits) {
  this.fruits.push(...fruits);
});

const selectFruitSpy = jest.fn(function selectFruit(fruit) {
  this.selected = fruit;
});

const useBasketStore = defineStore('basket', {
  state: () => ({
    fruits: ['🍍', '🍎', '🍇', '🍋', '🍎'],
    selected: '🍎',
  }),
  getters: {
    fruitCount: (state) => (fruit) => state.fruits.filter((f) => f === fruit).length,
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
