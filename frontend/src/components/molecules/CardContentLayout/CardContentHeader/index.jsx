import React from 'react';
import PropTypes from 'prop-types';

import ContentCheckbox from '../../../atoms/ContentCheckbox';
import ContentDropdown from '../../ContentDropdown';

// Central style sheet for Card Content (molecule)
import '../_settings/style.scss';

const CardContentHeader= (hasCheckbox, hasDropdown) => {
    return (
        <div className="molCardContentHeader d-flex flex-row">
            {
                hasCheckbox ?
                    <div className="me-auto">
                        <ContentCheckbox></ContentCheckbox>
                    </div>
                :
                    null
            }
            {
                hasDropdown ?
                    <div>
                        <ContentDropdown></ContentDropdown>
                    </div>
                :
                    null
            }
        </div>
    )
}

export default CardContentHeader;

CardContentHeader.propTypes = {
    hasCheckbox: PropTypes.bool,
    hasDropdown: PropTypes.bool 
}

CardContentHeader.defaultProps = {
    hasCheckbox: false,
    hasDropdown: true
}