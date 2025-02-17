import React from 'react';
import { assert } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import { createMount } from '@material-ui/core/test-utils';
import describeConformance from '@material-ui/core/test-utils/describeConformance';
import { Transition } from '@material-ui/react-transition-group';
import Zoom from './Zoom';

describe('<Zoom />', () => {
  let mount;

  before(() => {
    mount = createMount({ strict: true });
  });

  after(() => {
    mount.cleanUp();
  });

  describeConformance(
    <Zoom in>
      <div />
    </Zoom>,
    () => ({
      classes: {},
      inheritComponent: Transition,
      mount,
      skip: ['componentProp', 'refForwarding'],
    }),
  );

  describe('transition lifecycle', () => {
    let clock;
    let wrapper;
    let child;

    const handleEnter = spy();
    const handleEntering = spy();
    const handleEntered = spy();
    const handleExit = spy();
    const handleExiting = spy();
    const handleExited = spy();

    before(() => {
      clock = useFakeTimers();
      wrapper = mount(
        <Zoom
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div id="test" />
        </Zoom>,
      );
      child = wrapper.find('#test');
    });

    after(() => {
      clock.restore();
    });

    describe('in', () => {
      before(() => {
        wrapper.setProps({ in: true });
      });

      describe('handleEnter()', () => {
        it('should call handleEnter()', () => {
          assert.strictEqual(handleEnter.callCount, 1);
          assert.strictEqual(handleEnter.args[0][0], child.instance());
        });

        it('should set style properties', () => {
          assert.match(
            handleEnter.args[0][0].style.transition,
            /transform 225ms cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/,
          );
        });
      });

      describe('handleEntering()', () => {
        it('should call handleEntering()', () => {
          assert.strictEqual(handleEntering.callCount, 1);
          assert.strictEqual(handleEntering.args[0][0], child.instance());
        });
      });

      describe('handleEntered()', () => {
        it('should call handleEntered()', () => {
          clock.tick(1000);
          assert.strictEqual(handleEntered.callCount, 1);
          assert.strictEqual(handleEntered.args[0][0], child.instance());
        });
      });
    });

    describe('out', () => {
      before(() => {
        wrapper.setProps({ in: true });
        wrapper.setProps({ in: false });
      });

      describe('handleExit()', () => {
        it('should call handleExit()', () => {
          assert.strictEqual(handleExit.callCount, 1);
          assert.strictEqual(handleExit.args[0][0], child.instance());
        });

        it('should set style properties', () => {
          assert.match(
            handleExit.args[0][0].style.transition,
            /transform 195ms cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/,
          );
        });
      });

      describe('handleExiting()', () => {
        it('should call handleExiting()', () => {
          assert.strictEqual(handleExiting.callCount, 1);
          assert.strictEqual(handleExiting.args[0][0], child.instance());
        });
      });

      describe('handleExited()', () => {
        it('should call handleExited()', () => {
          clock.tick(1000);
          assert.strictEqual(handleExited.callCount, 1);
          assert.strictEqual(handleExited.args[0][0], child.instance());
        });
      });
    });
  });

  describe('prop: appear', () => {
    it('should work when initially hidden: appear=true', () => {
      const wrapper = mount(
        <Zoom in={false} appear>
          <div>Foo</div>
        </Zoom>,
      );
      assert.deepEqual(wrapper.find('div').props().style, {
        transform: 'scale(0)',
        visibility: 'hidden',
      });
    });

    it('should work when initially hidden: appear=false', () => {
      const wrapper = mount(
        <Zoom in={false} appear={false}>
          <div>Foo</div>
        </Zoom>,
      );
      assert.deepEqual(wrapper.find('div').props().style, {
        transform: 'scale(0)',
        visibility: 'hidden',
      });
    });
  });
});
