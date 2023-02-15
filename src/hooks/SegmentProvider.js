import React, { createContext, useContext } from 'react';

const SegmentContext = createContext(null);

const SegmentProvider = ({ children }) => {
    const segment = window.analytics ? window.analytics : null;

    return (
        <SegmentContext.Provider value={segment}>
            {children}
        </SegmentContext.Provider>
    );
}

export default SegmentProvider;

export const useSegment = () => {
    return useContext(SegmentContext);
}