import React, { useState, useEffect, useCallback } from 'react';
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
            
            // Update cache and resolve all pending requests
            data.forEach(template => {
                if (template) {
                    tileTemplateCache.set(template._id, template);
                }
            });
            
            // Resolve all pending requests
            pendingRequests.forEach((resolve, reject) => {
                const template = tileTemplateCache.get(id);
                if (template) {
                    resolve(template);
                } else {
                    reject(new Error('Template not found'));
                }
            });
        }
    } catch (error) {
        // Reject all pending requests on error
        pendingRequests.forEach((resolve, reject) => {
            reject(error);
        });
    } finally {
        pendingRequests.clear();
        batchLoading = false;
        batchTimeout = null;
    }
};

const TileRenderer = ({ tileTemplateId, fallbackIcon = 'Circle', className = '' }) => {
    const [tileTemplate, setTileTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTileTemplate = useCallback(async (id) => {
        // Check cache first
        if (tileTemplateCache.has(id)) {
            return tileTemplateCache.get(id);
        }

        // If batch loading is in progress, add to pending requests
        if (batchLoading) {
            return new Promise((resolve, reject) => {
                pendingRequests.set(id, { resolve, reject });
            });
        }

        // Start batch loading
        batchLoading = true;
        
        // Set timeout to process batch
        if (batchTimeout) clearTimeout(batchTimeout);
        batchTimeout = setTimeout(processBatchRequests, 50); // 50ms delay to collect requests
        
        return new Promise((resolve, reject) => {
            pendingRequests.set(id, { resolve, reject });
        });
    }, []);

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
        const loadTemplate = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const template = await fetchTileTemplate(tileTemplateId);
                setTileTemplate(template);
            } catch (err) {
                console.error('Error fetching tile template:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, [tileTemplateId, fetchTileTemplate]);

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
