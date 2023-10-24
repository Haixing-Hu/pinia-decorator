////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createDecorator } from '@haixing_hu/vue3-class-component';
import { mapStores } from 'pinia';

/**
 * Injects a Pinia store to a Vue component class.
 *
 * This decorator should be used to decorate a class field.
 *
 * @param {object} store
 *     The Pinia store to be injected, which should be the object returned by
 *     the Pinia's `defineStore()` function..
 * @return {function}
 *     A class field decorator function.
 * @author Haixing Hu
 */
function Store(store) {
  return createDecorator((Class, instance, target, context, options) => {
    if (context.kind !== 'field') {
      throw new Error('The @Store decorator can only be used to decorate a class field.');
    }
    const realId = `${store.$id}Store`;
    const stores = mapStores(store);
    const key = context.name;
    delete options.fields[key];
    options['computed'][context.name] = stores[realId];
  });
}

export default Store;
