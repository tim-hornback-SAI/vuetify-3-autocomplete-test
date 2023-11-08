import {flushPromises, mount} from '@vue/test-utils'
import { expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import HelloWorld from "../src/components/HelloWorld.vue";
import {fireEvent, render, screen, waitFor} from "@testing-library/vue";
import {VAutocomplete} from "vuetify/components";
import userEvent from '@testing-library/user-event';

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

test('displays message', () => {
  const wrapper = mount({
    template: '<v-layout><hello-world></hello-world></v-layout>'
  }, {
    props: {},
    global: {
      components: {
        HelloWorld,
      },
      plugins: [vuetify],
    }
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Components')
})

test('autocomplete', async () => {
  render({
    components: {VAutocomplete},
    template:`<div><v-autocomplete label="thething" :items="items" v-model="it"/>it: {{it}} items: {{items}}</div>`,
    data() {
      return {
        items: ['foo', 'bar'],
        it: 'not set'
      }
    }
  }, {
    global:{
      plugins:[vuetify]
    },
    props: {
      items: ['foo', 'bar']
    }
  })

  await userEvent.click(screen.getByLabelText('thething'))
  await userEvent.click(screen.getByRole('combobox'))
  // await userEvent.keyboard('ArrowDown');
  await userEvent.type(screen.getByRole('combobox'),'f');
  // await fireEvent.update(screen.getByLabelText('thething'), 'f')
  await fireEvent.update(screen.getByRole('combobox'), 'f')
  await userEvent.keyboard('Enter');
  await screen.findByRole('listbox')
  await flushPromises();
  await waitFor(() => expect(document.querySelectorAll('.v-list-item-title').length).toBeGreaterThan(1))
  screen.debug()
})
