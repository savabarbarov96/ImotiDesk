import React, { createContext, useContext, useState } from 'react';
import PropertyModal from './PropertyModal';

interface PropertyModalContextType {
  openPropertyModal: (propertyId: string) => void;
  closePropertyModal: () => void;
}

const PropertyModalContext = createContext<PropertyModalContextType | undefined>(undefined);

export const usePropertyModal = () => {
  const context = useContext(PropertyModalContext);
  if (!context) {
    throw new Error('usePropertyModal must be used within a PropertyModalProvider');
  }
  return context;
};

export const PropertyModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const openPropertyModal = (id: string) => {
    setPropertyId(id);
    setIsOpen(true);
  };

  const closePropertyModal = () => {
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Clear property ID when modal is closed
      setTimeout(() => setPropertyId(null), 300);
    }
  };

  return (
    <PropertyModalContext.Provider value={{ openPropertyModal, closePropertyModal }}>
      {children}
      <PropertyModal 
        propertyId={propertyId} 
        isOpen={isOpen} 
        onOpenChange={handleOpenChange} 
      />
    </PropertyModalContext.Provider>
  );
};

export default PropertyModalProvider; 