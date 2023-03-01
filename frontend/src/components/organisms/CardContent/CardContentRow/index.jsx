import React from 'react';
import PropTypes from 'prop-types';

import ContentCheckbox from '../../../atoms/ContentCheckbox';
import CardContentBody from '../../../molecules/CardContentLayout/CardContentBody';
import ContentDropdown from '../../../molecules/ContentDropdown';

// Central style sheet for Card Content (organism)
import '../_settings/style.scss';

/* If layout option: grid, row, table row */

const CardContentRow = ({hasCheckbox, hasDropdown, onClick, contentType, contentName, contentFile, pendingDeleted }) => {
  
    return (
        <section className="orgCardContentRow d-flex flex-row">
            { 
                hasCheckbox ?
                    <ContentCheckbox />
                : null
            }           
            <div className="flex-grow-1">
                <CardContentBody />
            </div>
            {
                hasDropdown ?
                    <ContentDropdown />
                : null
            }
        </section>
    )
}

export default CardContentRow;

CardContentRow.propTypes = {
    hasCheckbox: PropTypes.bool,
    hasDropdown: PropTypes.bool 
}

CardContentRow.defaultProps = {
    hasCheckbox: false,
    hasDropdown: true
}