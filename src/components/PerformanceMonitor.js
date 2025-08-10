import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ componentName, startTime }) => {
    const [loadTime, setLoadTime] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (startTime) {
            const endTime = performance.now();
            const time = endTime - startTime;
            setLoadTime(time);
            
            // Show warning for slow loading
            if (time > 1000) {
                console.warn(`Slow loading detected in ${componentName}: ${time.toFixed(2)}ms`);
                setIsVisible(true);
            }
        }
    }, [startTime, componentName]);

    if (!isVisible || !loadTime) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded shadow-lg z-50">
            <div className="text-sm font-semibold">Performance Warning</div>
            <div className="text-xs">
                {componentName}: {loadTime.toFixed(2)}ms
            </div>
            <button 
                onClick={() => setIsVisible(false)}
                className="text-yellow-600 hover:text-yellow-800 text-xs mt-1"
            >
                Dismiss
            </button>
        </div>
    );
};

export default PerformanceMonitor;
