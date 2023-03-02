import React from 'react';
import PropTypes from 'prop-types';

import CardContentBody from '../../molecules/CardContentBody';
import CardContentHeader from '../../molecules/CardContent/CardContentHeader';

import './style.scss';

export const CardCategory = {
    CARDCONTAINER: 'cardcontainer',
    CARDOBJECT: 'cardobject',
}

export const CardDisplay = {
    GRID: 'cardgrid',
    ROW: 'cardrow',
    TABLEROW: 'cardtablerow',
}

const CardContent = ({ category, display, isClickable, onClick, hasCheckbox, hasDropdown, contentName, contentID, contentPrimary, contentSecondary, ContentTertiary }) => {
    return (
        <>
            {
                display === "cardgrid" && (
                    isClickable ?
                        <div>
                            <CardContentHeader
                                hasCheckbox={hasCheckbox}
                                hasDropdown={hasDropdown} />
                            <CardContentBody>
                                { 
                                    isClickable ? 
                                        <div>Button</div> 
                                    : 
                                    <div>No button</div> 
                                }
                                {/* Conditional can come here */}
                                {contentName}
                            </CardContentBody>
                        </div>
                    :
                    <div>
                        <div>
                            Header
                        </div>
                        <div>
                            Body, no button
                             {/* Conditional can come here, so not needed */}
                            {contentName}
                        </div>
                    </div>
                )
            }
            {
                display === "cardrow" && (
                    isClickable ?
                        <div>
                            <div>
                                Header
                            </div>
                            <div>
                                Body, with button
                                {contentName}
                            </div>
                        </div>
                    :
                    <div>
                        <div>
                            Header
                        </div>
                        <div>
                            Body, no button
                            {contentName}
                        </div>
                    </div>
                )
            }
        </>
    )
};

export default CardContent;

CardContent.propTypes = {
    category: PropTypes.oneOf(Object.keys(CardCategory)),
    display: PropTypes.oneOf(Object.keys(CardDisplay)),
    contentName: PropTypes.string,
    contentID: PropTypes.string,
    isClickable: PropTypes.bool,
    contentPrimary: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    contentSecondary: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    contentTertiary: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
}

CardContent.defaultProps = {
    category: "container",
    display: "gird",
    contentName: "Content name",
}