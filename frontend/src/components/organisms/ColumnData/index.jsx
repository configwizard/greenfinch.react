import React from 'react';
import PropTypes from 'prop-types';
import MiddleEllipsis from 'react-middle-ellipsis';

import HeadingGeneral from '../../atoms/HeadingGeneral';
import IconFolder from '../../atoms/IconFolder';

import './style.scss';

// add categories up here for static, NFT, website

export const ContentDisplay = {
    CONTAINER: 'container',
    OBJECT: 'object',
}

export const ContentCategory = {
    STATIC: 'static',
    WEBSITE: 'website',
    NFT: 'nft',
}

const ColumnData = ({ display, category, contentTitle, iconSize, data, file }) => {
  return (
    <>
        {
            display === "container" && (
                category === "static" ? 
                <>
                    <IconFolder
                        size={iconSize}
                        type="native" />
                    <MiddleEllipsis><span className="atmContentTitle">{contentTitle}</span></MiddleEllipsis>
                    {data.map((dataItem, index) => (
                        <div key={index}>
                            <HeadingGeneral
                                level={"h6"}
                                isUppercase={true}
                                text={dataItem.contentDataTitle} />
                            <MiddleEllipsis><span>{dataItem.contentDataValue}</span></MiddleEllipsis>
                        </div>
                    ))}
                </>
                : null
            )
        }
        {
            display === "object" && (
                category === "static" ? 
                <>
                    { 
                    file ? 
                        <figure className="atmObjectThumbnail">
                            <img className="mw-100" src={`data:image/png;base64,${file}`} alt={contentTitle} />
                        </figure>
                    : null 
                    }
                    <MiddleEllipsis><span className="atmContentTitle">{contentTitle}</span></MiddleEllipsis>
                     {data.map((dataItem, index) => (
                        <div key={index}>
                            <HeadingGeneral
                                level={"h6"}
                                isUppercase={true}
                                text={dataItem.contentDataTitle} />
                            <MiddleEllipsis><span>{dataItem.contentDataValue}</span></MiddleEllipsis>
                        </div>
                    ))}
                </>
                : null
            )
        }
    </>
  )
};

export default ColumnData;

ColumnData.propTypes = {
    display: PropTypes.oneOf(Object.keys(ContentDisplay)),
    category: PropTypes.oneOf(Object.keys(ContentCategory)),
    data: PropTypes.array,
    iconSize: PropTypes.string,
};

ColumnData.defaultProps = {
    display: "container",
    category: "static",
    iconSize: "medium",
};                            