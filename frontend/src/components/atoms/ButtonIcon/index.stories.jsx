// YourComponent.stories.js|jsx
import React from 'react';
import ButtonIcon from './index';

import './style.scss';

// This default export determines where your story goes in the story list
export default {
    title: 'Greenfinch/Button Icon',
    component: ButtonIcon,
};

// We create a “template” of how args map to rendering
const Template = (args) => <ButtonIcon {...args} />; 

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = Template.bind({});
Default.args = {
    type: 'default',
    hasIcon: true,
    faClass: "fa-sharp fa-solid fa-flag",
};

export const Clean = Template.bind({});
Clean.args = {
    type: 'clean',
    hasIcon: true,
    faClass: "fa-sharp fa-solid fa-flag",
};

export const Primary = Template.bind({});
Primary.args = {
    type: 'primary',
    hasIcon: true,
    faClass: "fa-sharp fa-solid fa-flag",
};

export const Secondary = Template.bind({});
Secondary.args = {
    type: 'secondary',
    hasIcon: true,
    faClass: "fa-sharp fa-solid fa-flag",
};
