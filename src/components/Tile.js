import React, { useMemo, memo } from 'react';
import * as LucideIcons from 'lucide-react';
import { getIconName } from '@/lib/iconMapping';

const Tile = memo(({ 
    bg = '#f8f9fa', 
    icon = 'Circle', 
    color = '#000000', 
    size = 32,
    className = '',
    onClick,
    children 
}) => {
    // Memoize the icon component to prevent recreation
    const IconComponent = useMemo(() => {
        const mappedIconName = getIconName(icon);
        const iconComp = LucideIcons[mappedIconName];
        
        // If the icon doesn't exist, show a fallback
        if (!iconComp) {
            console.warn(`Icon "${mappedIconName}" not found in Lucide React, using Circle as fallback`);
        }
        
        return iconComp || LucideIcons.Circle;
    }, [icon]);

    // Memoize the style object to prevent recreation
    const tileStyle = useMemo(() => {
        const isFullSize = className.includes('w-full') && (className.includes('h-full') || className.includes('h-'));
        
        return {
            backgroundColor: bg,
            ...(isFullSize ? {
                // For full-size tiles: no padding, no borders, no rounded corners
                border: 'none',
                borderRadius: '0',
                padding: '0',
                margin: '0'
            } : {
                // For regular tiles: keep the original styling
                minWidth: size + 16,
                minHeight: size + 16,
                padding: '8px'
            })
        };
    }, [bg, className, size]);

    // Memoize the CSS classes to prevent recreation
    const tileClasses = useMemo(() => {
        const isFullSize = className.includes('w-full') && (className.includes('h-full') || className.includes('h-'));
        return `flex items-center justify-center ${isFullSize ? '' : 'rounded-lg shadow-sm'} ${className}`;
    }, [className]);

    return (
        <div
            className={tileClasses}
            style={tileStyle}
            onClick={onClick}
        >
            {children || <IconComponent size={size} color={color} />}
        </div>
    );
});

// Add display name for debugging
Tile.displayName = 'Tile';

export default Tile;
