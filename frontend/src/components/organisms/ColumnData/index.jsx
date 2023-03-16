import React from 'react';
import PropTypes from 'prop-types';
import MiddleEllipsis from 'react-middle-ellipsis';

// Components
import HeadingGeneral from '../../atoms/HeadingGeneral';
import IconFile from '../../atoms/IconFile';
import IconFolder from '../../atoms/IconFolder';

import './style.scss';

export const ContentDisplay = {
    CONTAINER: 'container',
    OBJECT: 'object',
}

export const ContentCategory = {
    STATIC: 'static',
    WEBSITE: 'website',
    NFT: 'nft',
}

const ColumnData = ({ display, category, dataType, contentTitle, iconSize, data, file }) => {
console.log("DATA:", data, contentTitle )
    return (
    <>
        {
            ( display === "container" &&
                category === "static") ?
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
                            <span>{dataItem.contentDataValue}</span>
                        </div>
                    ))}
                </>
                : null
        }
        {
            ( display === "object" &&
                category === "static") ? 
                <>
                    { 
                    file ? 
                        <figure className="atmObjectThumbnail">
                            <img className="mw-100" src={`data:image/png;base64,${file}`} alt={contentTitle} />
                        </figure>
                    : <IconFile
                        type={dataType}
                        size="medium"/>
                    }
                    <span className="atmContentTitle">{contentTitle}</span>
                    {/* <MiddleEllipsis><span className="atmContentTitle">{contentTitle}</span></MiddleEllipsis> */}
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
                : null
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