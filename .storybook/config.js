import { configure } from '@storybook/react';

const req = require.context('../packages/btce-front/src/components/newsSearch', true, /\.story\.tsx?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
