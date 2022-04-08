import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const HeadingGeneral = ({ level, isUppercase, children }) => {
  return (
    <>
        {
            level === "h1" && (
                isUppercase ? 
                    <h1 className="atmUppercase">{children}</h1>
                :
                <h1>{children}</h1>
            )
        }
        {
            level === "h2" && (
                isUppercase ? 
                    <h2 className="atmUppercase">{children}</h2>
                :
                <h2>{children}</h2>
            )
        }
        {
            level === "h3" && (
                isUppercase ? 
                    <h3 className="atmUppercase">{children}</h3>
                :
                <h3>{children}</h3>
            )
        }
        {
            level === "h4" && (
                isUppercase ? 
                    <h4 className="atmUppercase">{children}</h4>
                :
                <h4>{children}</h4>
            )
        }
        {
            level === "h5" && (
                isUppercase ? 
                    <h5 className="atmUppercase">{children}</h5>
                :
                <h5>{children}</h5>
            )
        }
        {
            level === "h6" && (
                isUppercase ? 
                    <h6 className="atmUppercase">{children}</h6>
                :
                <h6>{children}</h6>
            )
        }
    </>
  )
};

export default HeadingGeneral;

HeadingGeneral.propTypes = {
    level: PropTypes.string,
    isUppercase: PropTypes.bool,
    children: PropTypes.string
};

HeadingGeneral.defaultProps = {
    level: "h4",
    isUppercase: false,
    children: "Heading"
};                            