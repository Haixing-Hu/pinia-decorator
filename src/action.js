/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { createDecorator } from '@haixing_hu/vue3-class-component';
import { mapActions } from 'pinia';

/**
 * Injects a Pinia store's action to a Vue component class.
 *
 * This decorator should be used to decorate a class field.
 *
 * @param {object} store
 *     The Pinia store to be injected, which should be the object returned by
 *     the Pinia's `defineStore()` function..
 * @param {string} actionName
 *     The name of the action to be injected. If this argument is not specified,
 *     use the name of the decorated class field as the key.
 * @return {function}
 *     A class field decorator function.
 * @author Haixing Hu
 */
function Action(store, actionName = undefined) {
  return createDecorator((Class, instance, target, context, options) => {
    if (context?.kind !== 'field') {
      throw new Error('The @Action decorator can only be used to decorate a class field.');
    }
    const key = actionName ?? context.name;
    delete options.fields[context.name];
    const actions = mapActions(store, key);
    options['computed'][key] = actions[key];
  });
}

export default Action;
