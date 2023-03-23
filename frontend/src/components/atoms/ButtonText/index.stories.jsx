// YourComponent.stories.js|jsx
import React from 'react';
import ButtonText from './index';

import './style.scss';

// This default export determines where your story goes in the story list
export default {
    title: 'Greenfinch/Button Text',
    component: ButtonText,
    parameters: {
        docs: {
            description: {
                component: 'Standard _Greenfinch_ text button.',
            },
        },
    },
    argTypes: {
        onClick: {
            description: 'Overwritten description',
            table: {
                type: {
                    summary: 'Something short',
                    detail: 'Something really really long',
                },
            },
            control: {
                type: null,
            },
        },
    }
};

// We create a “template” of how args map to rendering
const Template = (args) => <ButtonText {...args} />; 

// More on args: https://storybook.js.org/docs/react/writing-stories/args
// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
// https://storybook.js.org/docs/react/writing-docs/doc-block-argstable
// https://storybook.js.org/addons/@storybook/addon-docs

export const Default = Template.bind({});
Default.args = {
    type: 'default',
    text: 'Button Text - default',
};

export const Clean = Template.bind({});
Clean.args = {
    type: 'clean',
    text: 'Button Text - clean',
};

export const Primary = Template.bind({});
Primary.args = {
    type: 'primary',
    text: 'Button Text - primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
    type: 'secondary',
    text: 'Button Text - secondary',
};

export const Dora = Template.bind({});
Dora.args = {
    type: 'dora',
    text: 'View on Dora',
    faClass: 'fak fa-doracoz'
};
