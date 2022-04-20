// YourComponent.stories.js|jsx
import React from 'react';
import ButtonText from './index';

// This default export determines where your story goes in the story list
export default {
    title: 'Greenfinch/Button Text',
    component: ButtonText,
};

// We create a “template” of how args map to rendering
const Template = (args) => <ButtonText {...args} />; 

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = Template.bind({});
Default.args = {
    type: 'default',
    text: 'Button - default',
    hasIcon: true,
    faClass: "fas fa-flag",
};

export const Clean = Template.bind({});
Clean.args = {
    type: 'clean',
    text: 'Button - clean',
    hasIcon: true,
    faClass: "fas fa-flag",
};

export const Primary = Template.bind({});
Primary.args = {
    type: 'primary',
    text: 'Button - primary',
    hasIcon: true,
    faClass: "fas fa-flag",
};

export const Secondary = Template.bind({});
Secondary.args = {
    type: 'secondary',
    text: 'Button - secondary',
    hasIcon: true,
    faClass: "fas fa-flag",
};
