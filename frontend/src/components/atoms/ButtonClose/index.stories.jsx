import React from 'react';
import ButtonClose from './index';

import './style.scss';

export default {
    title: 'Greenfinch/Button Close',
    component: ButtonClose,
};

// We create a “template” of how args map to rendering
const Template = (args) => <ButtonClose {...args} />; 

export const Small = Template.bind({});
Small.args = {
    type: 'default',
    hasIcon: true,
    faClass: "fa-sharp fa-solid fa-flag",
};

export const Medium = Template.bind({});
Medium.args = {
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