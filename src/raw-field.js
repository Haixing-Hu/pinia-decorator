////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/**
 * The key of the metadata of a field of a Pinia store class, which indicates
 * that the field is a non-reactive raw field.
 *
 * @type {string}
 * @private
 * @author Haixing Hu
 */
const RAW_PROPERTY_KEY = '__pinia_decorator_raw_field__';

/**
 * The decorator used to decorate a field of a Pinia store class, which indicates
 * that the field is a non-reactive raw field.
 *
 * The raw fields are not reactive, which means that the changes of the raw fields
 * will not trigger the reactivity of the Pinia store. The raw fields are useful
 * to store the data that should not be reactive.
 *
 * @param {undefined} target
 *     the target of the decorator. Since this decorator is used to decorate a
 *     class field, the target is always `undefined`.
 * @param {object} context
 *     the context of the decorator.
 * @author Haixing Hu
 */
function RawField(target, context) {
  if (context.kind !== 'field') {
    throw new Error('The @RawField decorator can only be used to decorate a class field.');
  }
  const metadata = context.metadata;
  metadata[RAW_PROPERTY_KEY] ??= [];
  metadata[RAW_PROPERTY_KEY].push(context.name);
}

export {
  RAW_PROPERTY_KEY,
  RawField,
};

export default RawField;
