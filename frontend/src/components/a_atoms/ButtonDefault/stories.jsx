// YourComponent.stories.js|jsx

import React from 'react';
import ButtonDefault from './ButtonDefault';

// This default export determines where your story goes in the story list
export default {
    title: 'Button - Default',
    component: ButtonDefault,
};

// We create a “template” of how args map to rendering
const Template = (args) => <ButtonDefault {...args} />;

export const FirstStory = {
  args: {
    //👇 The args you need here will depend on your component
  },
};