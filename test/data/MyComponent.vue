<template>
  <div class="my-component">
    <div>
      All Fruits:
      <ul id="all-fruits">
        <li v-for="fruit in fruits" :key="fruit">{{ fruit }}</li>
      </ul>
    </div>
    <div>
      Total Fruit Count:
      <span id="total-count">{{ totalCount }}</span>
    </div>
    <div>
      Selected Fruit:
      <span id="selected-fruit">{{ selectedFruit }}</span>
    </div>
    <div>
      Count of Selected Fruit:
      <span id="selected-fruit-count">{{ fruitCount(selectedFruit) }}</span>
    </div>
    <div>
      <input id="input-fruit" type="text" v-model="fruit" />
    </div>
    <div>
      <button
          id="select-fruit"
          @click="onSelectFruitClicked"
      >
        Select Fruit
      </button>
      <button
          id="change-select-fruit"
          @click="onChangeFruitClicked"
      >
        Change Selected Fruit
      </button>
      <button
        id="add-fruit"
        @click="onAddFruitClicked"
      >
        Add Fruit
      </button>
      <button
        id="batch-add-fruits"
        @click="onBatchAddFruitsClicked"
      >
        Batch Add Fruits
      </button>
    </div>
  </div>
</template>
<script>
import { Component, toVue } from '@haixing_hu/vue3-class-component';
import { useBasketStore } from './basket';
import { State, WritableState, Action, Getter, Store } from '../../src/index';

@Component
class MyComponent {
  @State(useBasketStore)
  fruits;

  @WritableState(useBasketStore, 'selected')
  selectedFruit;

  @Getter(useBasketStore)
  fruitCount;

  @Getter(useBasketStore, 'count')
  totalCount;

  @Action(useBasketStore)
  addFruit;

  @Action(useBasketStore, 'addFruits')
  batchAddFruits;

  @Action(useBasketStore)
  selectFruit;

  @Store(useBasketStore)
  store;

  fruit = '';

  onSelectFruitClicked() {
    const list = this.fruit.split(',');
    this.selectFruit(list[0]);
  }

  onChangeFruitClicked() {
    const list = this.fruit.split(',');
    this.selectedFruit = list[0];
  }

  onAddFruitClicked() {
    const list = this.fruit.split(',');
    this.addFruit(list[0]);
  }

  onBatchAddFruitsClicked() {
    const list = this.fruit.split(',');
    this.batchAddFruits(list);
  }
}
export default toVue(MyComponent);
</script>
