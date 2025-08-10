'use client';
import React, { useState, useEffect } from 'react';
import TileRenderer from '@/components/TileRenderer';

export default function TestTilesPage() {
    const [tileTemplates, setTileTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTileTemplates = async () => {
            try {
                const response = await fetch('/api/tile-templates');
                if (response.ok) {
                    const data = await response.json();
                    setTileTemplates(data);
                }
            } catch (error) {
                console.error('Error fetching tile templates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTileTemplates();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading tile templates...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-10">Tile Templates Demo</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tileTemplates.map((template) => (
                        <div key={template._id} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Type: {template.type}</p>
                            
                            <div className="flex justify-center mb-4">
                                <TileRenderer 
                                    tileTemplateId={template._id}
                                    fallbackIcon="Circle"
                                    className="w-20 h-20"
                                />
                            </div>
                            
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>Background: {template.backgroundColor}</p>
                                <p>Icon: {template.iconName}</p>
                                <p>Size: {template.iconSize}</p>
                                <p>Color: {template.iconColor}</p>
                            </div>
                            
                            <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono">
                                {template.jsxCode}
                            </div>
                        </div>
                    ))}
                </div>

                {tileTemplates.length === 0 && (
                    <div className="text-center text-gray-500">
                        No tile templates found. Please create some in your database.
                    </div>
                )}
            </div>
        </div>
    );
}
