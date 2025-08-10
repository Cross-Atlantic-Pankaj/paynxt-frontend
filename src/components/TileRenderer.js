import React, { useState, useEffect } from 'react';
import Tile from './Tile';

const TileRenderer = ({ tileTemplateId, fallbackIcon = 'Circle', className = '' }) => {
    const [tileTemplate, setTileTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tileTemplateId) {
            setLoading(false);
            return;
        }

        // If tileTemplateId is already an object (populated), use it directly
        if (typeof tileTemplateId === 'object' && tileTemplateId !== null) {
            setTileTemplate(tileTemplateId);
            setLoading(false);
            return;
        }

        // If tileTemplateId is a string (ObjectId), fetch it
        const fetchTileTemplate = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/tile-templates/${tileTemplateId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch tile template');
                }
                
                const data = await response.json();
                setTileTemplate(data);
            } catch (err) {
                console.error('Error fetching tile template:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTileTemplate();
    }, [tileTemplateId]);

    if (loading) {
        return (
            <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} 
                 style={{ minWidth: 48, minHeight: 48 }} />
        );
    }

    if (error || !tileTemplate) {
        return (
            <Tile 
                bg="#f8f9fa" 
                icon={fallbackIcon} 
                color="#6b7280" 
                size={32}
                className={className}
            />
        );
    }

    return (
        <Tile
            bg={tileTemplate.backgroundColor || '#f8f9fa'}
            icon={tileTemplate.iconName || fallbackIcon}
            color={tileTemplate.iconColor || '#000000'}
            size={tileTemplate.iconSize || 32}
            className={className}
        />
    );
};

export default TileRenderer;
