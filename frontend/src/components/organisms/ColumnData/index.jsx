import React from 'react';
import PropTypes from 'prop-types';

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
                        size={iconSize} />
                    <HeadingGeneral
                        level={"h5"}
                        isUppercase={false}
                        text={contentTitle}/>
                    {data.map((dataItem, index) => (
                        <div key={index}>
                            <HeadingGeneral
                                level={"h6"}
                                isUppercase={true}
                                text={dataItem.contentDataTitle} />
                            <span>{dataItem.contentDataValue}</span>
                        </div>
                    ))}
                </>
                :
                <h1>TEXT</h1>
            )
        }
        {
            display === "object" && (
                category === "static" ? 
                <>
                    <figure className="atmObjectThumbnail">
                        <img className="mw-100" src={`data:image/png;base64,${file}`} alt={contentTitle} />
                    </figure>
                    <HeadingGeneral
                        level={"h5"}
                        isUppercase={false}
                        text={contentTitle} />
                     {data.map((dataItem, index) => (
                        <div key={index}>
                            <HeadingGeneral
                                level={"h6"}
                                isUppercase={true}
                                text={dataItem.contentDataTitle} />
                            <span>{dataItem.contentDataValue}</span>
                        </div>
                    ))}
                </>
                :
                <h1>TEXT</h1>
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