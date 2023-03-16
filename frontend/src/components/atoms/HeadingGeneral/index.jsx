import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const HeadingGeneral = ({ level, isUppercase, text }) => {
    console.log("TEXT",  text)
  return (
    <>
        {
            level === "h1" && ( 
                isUppercase ? 
                    <h1 className="atmUppercase">{text}</h1>
                : <h1>{text}</h1>
            )
        }
        {
            level === "h2" && (
                isUppercase ? 
                    <h2 className="atmUppercase">{text}</h2>
                :
                <h2>{text}</h2>
            )
        }
        {
            level === "h3" && (
                isUppercase ? 
                    <h3 className="atmUppercase">{text}</h3>
                :
                <h3>{text}</h3>
            )
        }
        {
            level === "h4" && (
                isUppercase ? 
                    <h4 className="atmUppercase">{text}</h4>
                :
                <h4>{text}</h4>
            )
        }
        {
            level === "h5" && (
                isUppercase ? 
                    <h5 className="atmUppercase">{text}</h5>
                :
                <h5>{text}</h5>
            )
        }
        {
            level === "h6" && (
                isUppercase ? 
                    <h6 className="atmUppercase">{text}</h6>
                :
                <h6>{text}</h6>
            )
        }
    </>
  )
};

export default HeadingGeneral;

HeadingGeneral.propTypes = {
    level: PropTypes.string.isRequired,
    isUppercase: PropTypes.bool,
    text: PropTypes.string
};

HeadingGeneral.defaultProps = {
    level: "h4",
    isUppercase: false,
    text: "Lorem Ipsum"
};                            