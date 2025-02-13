////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createDecorator } from '@qubit-ltd/vue3-class-component';
import { mapState } from 'pinia';

/**
 * Injects a Pinia store's state to a Vue component class.
 *
 * This decorator should be used to decorate a class field.
 *
 * @param {object} store
 *     The Pinia store to be injected, which should be the object returned by
 *     the Pinia's `defineStore()` function..
 * @param {string} stateName
 *     The name of the state to be injected. If this argument is not specified,
 *     use the name of the decorated class field as the key.
 * @return {function}
 *     A class field decorator function.
 * @author Haixing Hu
 */
function State(store, stateName = undefined) {
  return createDecorator((Class, instance, target, context, options) => {
    if (context.kind !== 'field') {
      throw new Error('The @State decorator can only be used to decorate a class field.');
    }
    const key = stateName ?? context.name;
    delete options.fields[context.name];
    const states = mapState(store, [key]);
    options['computed'][context.name] = states[key];
  });
}

export default State;
