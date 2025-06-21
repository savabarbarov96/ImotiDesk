interface PropertyDetails {
  bedrooms?: number | null;
  city: string;
  address: string;
  property_type?: string;
  sub_district?: string;
}

/**
 * Generates a property title based on property details
 * Format: "{property_type}, гр {city}, {sub_district}, {address}" (for Sofia)
 * Format: "{property_type}, гр {city}, {address}" (for other cities)
 * Example: "2-СТАЕН, гр София, Младост, ул. Малинова долина"
 * Example: "КЪЩА, гр Пловдив, ул. Централна"
 */
export const generatePropertyTitle = (details: PropertyDetails): string => {
  const { bedrooms, city, address, property_type, sub_district } = details;
  
  // Extract the street/area from the full address (take the first part before comma if exists)
  const addressPart = address.split(',')[0].trim();
  
  // Handle property type - use the Bulgarian property types
  let typePart = '';
  if (property_type) {
    typePart = property_type;
  } else if (bedrooms && bedrooms > 0) {
    typePart = `${bedrooms}-СТАЕН`;
  } else {
    typePart = 'ИМОТ';
  }
  
  // Format city with "гр" prefix if not already present
  const cityPart = city.startsWith('гр ') ? city : `гр ${city}`;
  
  // For Sofia, include sub_district if available
  if (city === 'София' && sub_district) {
    return `${typePart}, ${cityPart}, ${sub_district}, ${addressPart}`;
  }
  
  // For other cities or Sofia without sub_district
  return `${typePart}, ${cityPart}, ${addressPart}`;
};

/**
 * Updates an existing property title to use the auto-generated format
 */
export const updatePropertyTitle = (property: PropertyDetails): string => {
  return generatePropertyTitle(property);
};

/**
 * Creates a migration script to update all existing property titles
 * This can be used to update properties that were created before auto-generation was implemented
 */
export const generateTitleUpdateScript = (properties: Array<PropertyDetails & { id: string }>): string => {
  const updates = properties.map(property => {
    const newTitle = generatePropertyTitle(property);
    return `UPDATE imotidesk_properties SET title = '${newTitle.replace(/'/g, "''")}' WHERE id = '${property.id}';`;
  }).join('\n');
  
  return `-- Auto-generated property title updates
-- Generated on ${new Date().toISOString()}

BEGIN;

${updates}

COMMIT;`;
}; 