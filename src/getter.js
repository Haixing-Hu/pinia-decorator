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
 * Injects a Pinia store's getter to a Vue component class.
 *
 * This decorator should be used to decorate a class field.
 *
 * @param {object} store
 *     The Pinia store to be injected, which should be the object returned by
 *     the Pinia's `defineStore()` function..
 * @param {string} getterName
 *     The name of the getter to be injected. If this argument is not specified,
 *     use the name of the decorated class field as the key.
 * @return {function}
 *     A class field decorator function.
 * @author Haixing Hu
 */
function Getter(store, getterName = undefined) {
  return createDecorator((Class, instance, target, context, options) => {
    if (context.kind !== 'field') {
      throw new Error('The @Getter decorator can only be used to decorate a class field.');
    }
    const key = getterName ?? context.name;
    delete options.fields[context.name];
    const getters = mapState(store, [key]);
    options['computed'][context.name] = getters[key];
  });
}

export default Getter;
