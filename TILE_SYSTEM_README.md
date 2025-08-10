# Tile System for PayNXT360

This document explains how to use the new tile system that allows dynamic rendering of icons and images from tile templates stored in the database.

## Overview

The tile system replaces static image URLs with dynamic tile templates that can be:
- Easily customized through the database
- Reused across different blog posts and articles
- Updated without changing code
- Styled with custom colors, sizes, and icons

## Components

### 1. TileTemplate Model (`src/models/TileTemplate.js`)

The database schema for tile templates:

```javascript
{
  name: "Star",                    // Template name
  type: "Important",               // Template type/category
  jsxCode: "<Tile bg='#97ff8a' icon='Star' color='#ffffff' size={49} />",
  backgroundColor: "#97ff8a",      // Background color
  iconName: "Star",               // Lucide React icon name
  iconColor: "#ffffff",           // Icon color
  iconSize: 49,                   // Icon size (16-96)
  useTileBgEverywhere: false      // Whether to use tile background everywhere
}
```

### 2. Tile Component (`src/components/Tile.js`)

A reusable component that renders individual tiles:

```javascript
import Tile from '@/components/Tile';

<Tile 
  bg="#97ff8a" 
  icon="Star" 
  color="#ffffff" 
  size={49}
  className="w-15 h-15"
/>
```

### 3. TileRenderer Component (`src/components/TileRenderer.js`)

A smart component that fetches tile template data and renders the appropriate tile:

```javascript
import TileRenderer from '@/components/TileRenderer';

<TileRenderer 
  tileTemplateId="6898aa0026ff15286f793509"
  fallbackIcon="FileText"
  className="w-15 h-15"
/>
```

## API Endpoints

### GET `/api/tile-templates`
Fetches all tile templates.

### GET `/api/tile-templates/[id]`
Fetches a specific tile template by ID.

### POST `/api/tile-templates`
Creates a new tile template.

## Usage Examples

### 1. In Blog Posts

Replace static images with dynamic tiles:

```javascript
// Before (static image)
<img src={blog.imageIconurl} alt={blog.blogName} />

// After (dynamic tile)
{blog.tileTemplateId ? (
  <TileRenderer 
    tileTemplateId={blog.tileTemplateId}
    fallbackIcon="FileText"
    className="w-15 h-15"
  />
) : (
  <img src={blog.imageIconurl} alt={blog.blogName} />
)}
```

### 2. In Related Articles

Add tile icons to article lists:

```javascript
{article.tileTemplateId && (
  <TileRenderer 
    tileTemplateId={article.tileTemplateId}
    fallbackIcon="FileText"
    className="w-4 h-4 mr-2"
  />
)}
```

### 3. In Featured Reports

Display tiles in report grids:

```javascript
{blog.tileTemplateId ? (
  <TileRenderer 
    tileTemplateId={blog.tileTemplateId}
    fallbackIcon="FileText"
    className="w-15 h-15"
  />
) : (
  <img src={blog.imageIconurl} alt={blog.blogName} />
)}
```

## Database Integration

### 1. Update Blog Models

Add `tileTemplateId` field to your blog models:

```javascript
// In blogcontent.js, relarticles.js, featreport.js
tileTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'TileTemplate' }
```

### 2. Populate References

Use Mongoose populate to fetch tile template data:

```javascript
const blogs = await BlogManager.find()
  .populate('tileTemplateId')
  .sort({ createdAt: -1 });
```

### 3. Create Tile Templates

Insert tile templates into the `tiletemplates` collection:

```javascript
{
  "_id": ObjectId("6898aa0026ff15286f793509"),
  "name": "Star",
  "type": "Important",
  "jsxCode": "<Tile bg='#97ff8a' icon='Star' color='#ffffff' size={49} />",
  "backgroundColor": "#97ff8a",
  "iconName": "Star",
  "iconColor": "#ffffff",
  "iconSize": 49
}
```

## Icon Support

The system supports all Lucide React icons. Common icons include:

- **Basic Shapes**: Circle, Square, Triangle, Star, Heart
- **Business**: Building, Office, Factory, Store
- **Technology**: Database, Server, Cloud, Wifi
- **Finance**: CreditCard, Wallet, Banknote, Coins
- **Navigation**: MapPin, Navigation, Compass, Globe
- **Actions**: Edit, Delete, Search, Share, Download

## Fallback Handling

If a tile template is not found or an icon doesn't exist:

1. **Missing Template**: Shows a fallback icon (default: Circle)
2. **Missing Icon**: Logs a warning and uses Circle icon
3. **Network Error**: Shows loading state then fallback

## Testing

Visit `/test-tiles` to see all available tile templates and test their rendering.

## Migration Guide

### From Static Images to Tiles

1. **Create Tile Templates**: Add tile templates to your database
2. **Update Blog Records**: Add `tileTemplateId` to existing blog posts
3. **Update Components**: Replace `<img>` tags with `<TileRenderer>`
4. **Test**: Verify tiles render correctly across your application

### Example Migration

```javascript
// Before
<img src="https://example.com/icon.jpg" alt="Blog Icon" />

// After
<TileRenderer 
  tileTemplateId="your_tile_template_id"
  fallbackIcon="FileText"
  className="w-15 h-15"
/>
```

## Benefits

1. **Dynamic**: Change icons and styles without code changes
2. **Consistent**: Maintain visual consistency across the platform
3. **Scalable**: Easy to add new tile types and styles
4. **Maintainable**: Centralized icon and style management
5. **Performance**: Icons are lightweight and load quickly

## Troubleshooting

### Common Issues

1. **Icon Not Found**: Check if the icon name exists in Lucide React
2. **Template Not Loading**: Verify the tileTemplateId exists in the database
3. **Styling Issues**: Check CSS classes and inline styles
4. **Performance**: Ensure proper population of tileTemplateId references

### Debug Mode

Enable console logging to see tile template loading:

```javascript
// Check browser console for:
// - Tile template fetch requests
// - Icon mapping warnings
// - Rendering errors
```

## Future Enhancements

1. **Tile Editor**: Admin interface for creating/editing tiles
2. **Animation Support**: Add hover effects and transitions
3. **Custom Icons**: Support for custom SVG icons
4. **Theme Integration**: Dynamic theming based on user preferences
5. **Caching**: Implement tile template caching for better performance
