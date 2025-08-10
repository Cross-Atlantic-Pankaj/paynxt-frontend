import React from 'react';
import * as LucideIcons from 'lucide-react';
import { getIconName } from '@/lib/iconMapping';

const Tile = ({ 
    bg = '#f8f9fa', 
    icon = 'Circle', 
    color = '#000000', 
    size = 32,
    className = '',
    onClick,
    children 
}) => {
    // Get the icon component from Lucide React using icon mapping
    const mappedIconName = getIconName(icon);
    const IconComponent = LucideIcons[mappedIconName];
    
    // If the icon doesn't exist, show a fallback
    if (!IconComponent) {
        console.warn(`Icon "${mappedIconName}" not found in Lucide React, using Circle as fallback`);
    }
    
    const FinalIconComponent = IconComponent || LucideIcons.Circle;
    
    // Check if we're using full dimensions (w-full, h-full, or specific height like h-32)
    const isFullSize = className.includes('w-full') && (className.includes('h-full') || className.includes('h-'));
    
    return (
        <div
            className={`flex items-center justify-center ${isFullSize ? '' : 'rounded-lg shadow-sm'} ${className}`}
            style={{
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
            }}
            onClick={onClick}
        >
            {children || <FinalIconComponent size={size} color={color} />}
        </div>
    );
};

export default Tile;
