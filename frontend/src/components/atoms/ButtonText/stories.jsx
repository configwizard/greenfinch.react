// YourComponent.stories.js|jsx

import React from 'react';
import ButtonText from './ButtonText';

// This default export determines where your story goes in the story list
export default {
    title: 'Button - Default',
    component: ButtonText,
};

// We create a “template” of how args map to rendering
const Template = (args) => <ButtonText {...args} />;

export const FirstStory = {
  args: {
    //👇 The args you need here will depend on your component
  },
};