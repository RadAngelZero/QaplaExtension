import React, { createContext, useContext } from 'react';
import { AnalyticsBrowser } from '@segment/analytics-next'

const SegmentContext = createContext(null);

const SegmentProvider = ({ children }) => {
    const segment = AnalyticsBrowser.load({ writeKey: '2aMup1UfHD1G1GBHlRj9Ew5gpdq5AVER' });

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