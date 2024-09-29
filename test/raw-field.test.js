////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createPinia, setActivePinia } from 'pinia';
import { isReactive } from 'vue';
import { Logger } from '@haixing_hu/logging';
import { RawField, toStore } from '../src/index';
import CustomizedAppender from './data/customized-appender';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('RawField', () => {
  it('The field marked with @RawField should not be reactive', () => {
    const appender = new CustomizedAppender();
    const theLogger = Logger.getLogger('TestLogger', { appender, level: 'TRACE' });

    class TestStore {
      obj = {
        id: 123,
        code: 'abc',
      };

      @RawField
      logger = theLogger;

      hello() {
        this.logger.info('Hello World!');
      }
    }
    const useTestStore = toStore('test', TestStore);
    const store = useTestStore();
    expect(store.obj).toEqual({ id: 123, code: 'abc' });
    expect(store.logger).toBe(theLogger);
    expect(store.$state.obj).toEqual({ id: 123, code: 'abc' });
    expect(store.$state.logger).toBe(theLogger);
    expect(Object.getOwnPropertyNames(store.$state)).toEqual(['obj', 'logger']);
    expect(typeof store.hello).toBe('function');
    store.hello();
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0].type).toBe('INFO');
    expect(appender.logs[0].args).toEqual([
      '[INFO] TestLogger - %s',
      'Hello World!',
    ]);
    expect(isReactive(store.obj)).toBe(true);
    expect(isReactive(store.logger)).toBe(false);
  });

  it('should throw if not decorate on a class method', () => {
    expect(() => {
      @RawField
      class TestStore {
        foo() {
          console.log('hello');
        }
      }
      new TestStore();
    }).toThrow('The @RawField decorator can only be used to decorate a class field.');
  });
});
