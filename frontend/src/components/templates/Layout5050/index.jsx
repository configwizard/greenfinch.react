import React from 'react';

export const colSide = {
    LEFT: 'left',
    RIGHT: 'right',
}

const Layout5050 = ({ colSide, children, hasScrollY }) => {
    return (
        <>
            {
                colSide === "left" && (
                    <div className="col-6 order-1">
                        <div >
                            {children}
                        </div>
                    </div>  
                )
            }
            {
                colSide === "right" && (
                    <div className="col-6 order-2">
                        <div >
                            {children}
                        </div>
                    </div>  
                )
            }
        </>
    )
};

export default Layout5050;