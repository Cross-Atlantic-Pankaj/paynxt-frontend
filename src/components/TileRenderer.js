import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Tile from './Tile';

// Global cache for tile templates to avoid duplicate API calls
const tileTemplateCache = new Map();

// Batch loading mechanism
let batchLoading = false;
let pendingRequests = new Map();
let batchTimeout = null;

const processBatchRequests = async () => {
    if (pendingRequests.size === 0) return;
    
    const ids = Array.from(pendingRequests.keys());
    const uniqueIds = [...new Set(ids)];
    
    try {
        // Fetch all unique tile templates in one request
        const response = await fetch('/api/tile-templates/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: uniqueIds }),
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update cache
            data.forEach(template => {
                if (template) {
                    tileTemplateCache.set(template._id, template);
                }
            });
            
            // Resolve all pending requests
            pendingRequests.forEach(({ resolve, reject }, id) => {
                const template = tileTemplateCache.get(id);
                if (template) {
                    resolve(template);
                } else {
                    reject(new Error('Template not found'));
                }
            });
        } else {
            // Reject all pending requests on API error
            pendingRequests.forEach(({ resolve, reject }) => {
                reject(new Error('Failed to fetch tile templates'));
            });
        }
    } catch (error) {
        // Reject all pending requests on error
        pendingRequests.forEach(({ resolve, reject }) => {
            reject(error);
        });
    } finally {
        pendingRequests.clear();
        batchLoading = false;
        batchTimeout = null;
    }
};

const TileRenderer = memo(({ tileTemplateId, fallbackIcon = 'Circle', className = '' }) => {
    const [tileTemplate, setTileTemplate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoize the template ID to prevent unnecessary re-renders
    const memoizedTemplateId = useMemo(() => {
        if (typeof tileTemplateId === 'object' && tileTemplateId !== null) {
            return tileTemplateId._id || tileTemplateId;
        }
        return tileTemplateId;
    }, [tileTemplateId]);

    // Memoize the fetch function to prevent recreation
    const fetchTileTemplate = useCallback(async (id) => {
        // Check cache first
        if (tileTemplateCache.has(id)) {
            return tileTemplateCache.get(id);
        }

        return new Promise((resolve, reject) => {
            // Add to pending requests
            pendingRequests.set(id, { resolve, reject });

            // If not already batch loading, start the process
            if (!batchLoading) {
                batchLoading = true;
                
                // Set timeout to process batch
                if (batchTimeout) clearTimeout(batchTimeout);
                batchTimeout = setTimeout(processBatchRequests, 50); // 50ms delay to collect requests
            }
        });
    }, []);

    // Memoize the loading state to prevent unnecessary updates
    const shouldShowLoading = useMemo(() => {
        return loading && !tileTemplate && !error;
    }, [loading, tileTemplate, error]);

    useEffect(() => {
        if (!memoizedTemplateId) {
            setTileTemplate(null);
            setLoading(false);
            setError(null);
            return;
        }

        // If tileTemplateId is already an object (populated), use it directly
        if (typeof tileTemplateId === 'object' && tileTemplateId !== null) {
            setTileTemplate(tileTemplateId);
            setLoading(false);
            setError(null);
            return;
        }

        // Check if we already have this template in cache
        if (tileTemplateCache.has(memoizedTemplateId)) {
            setTileTemplate(tileTemplateCache.get(memoizedTemplateId));
            setLoading(false);
            setError(null);
            return;
        }

        // If tileTemplateId is a string (ObjectId), fetch it
        const loadTemplate = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const template = await fetchTileTemplate(memoizedTemplateId);
                setTileTemplate(template);
            } catch (err) {
                console.error('Error fetching tile template:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, [memoizedTemplateId, tileTemplateId, fetchTileTemplate]);

    // Memoize the fallback tile to prevent recreation
    const fallbackTile = useMemo(() => (
        <Tile 
            bg="#f8f9fa" 
            icon={fallbackIcon} 
            color="#6b7280" 
            size={32}
            className={className}
        />
    ), [fallbackIcon, className]);

    // Memoize the loading skeleton to prevent recreation
    const loadingSkeleton = useMemo(() => (
        <div 
            className={`animate-pulse bg-gray-200 rounded-lg ${className}`} 
            style={{ minWidth: 48, minHeight: 48 }}
        />
    ), [className]);

    // Memoize the main tile to prevent recreation
    const mainTile = useMemo(() => {
        if (!tileTemplate) return null;
        
        return (
            <Tile
                bg={tileTemplate.backgroundColor || '#f8f9fa'}
                icon={tileTemplate.iconName || fallbackIcon}
                color={tileTemplate.iconColor || '#000000'}
                size={tileTemplate.iconSize || 32}
                className={className}
            />
        );
    }, [tileTemplate, fallbackIcon, className]);

    // Early return for loading state
    if (shouldShowLoading) {
        return loadingSkeleton;
    }

    // Early return for error or no template
    if (error || !tileTemplate) {
        return fallbackTile;
    }

    // Return the main tile
    return mainTile;
});

// Add display name for debugging
TileRenderer.displayName = 'TileRenderer';

export default TileRenderer;
