export interface WatermarkOptions {
  opacity?: number;
  padding?: number;
  widthPercentage?: number;
}

// Function to detect if image has transparent background
const hasTransparentBackground = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): boolean => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Check corners and edges for transparency
  const checkPositions = [
    // Corners
    [0, 0],
    [canvas.width - 1, 0],
    [0, canvas.height - 1],
    [canvas.width - 1, canvas.height - 1],
    // Edge midpoints
    [Math.floor(canvas.width / 2), 0],
    [Math.floor(canvas.width / 2), canvas.height - 1],
    [0, Math.floor(canvas.height / 2)],
    [canvas.width - 1, Math.floor(canvas.height / 2)]
  ];
  
  for (const [x, y] of checkPositions) {
    const index = (y * canvas.width + x) * 4;
    const alpha = data[index + 3];
    if (alpha < 255) {
      return true; // Found transparency
    }
  }
  
  return false;
};

export const applyWatermark = async (
  originalImage: File,
  watermarkPath: string,
  options: WatermarkOptions = {}
): Promise<Blob> => {
  const {
    opacity = 0.4,
    padding = 20,
    widthPercentage = 60
  } = options;

  // Create canvas and get context
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Load the original image
  const imageUrl = URL.createObjectURL(originalImage);
  const img = await loadImage(imageUrl);
  
  // Set canvas size to match original image
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw original image
  ctx.drawImage(img, 0, 0);
  
  // Check if image has transparent background
  const isTransparent = hasTransparentBackground(canvas, ctx);
  
  // Use white logo for transparent backgrounds, regular logo for others
  const logoPath = isTransparent ? '/trendimo-white.png' : watermarkPath;
  
  // Increase size for white logo on transparent backgrounds
  const logoWidthPercentage = isTransparent ? 80 : widthPercentage;
  
  try {
    // Load and draw watermark
    const watermark = await loadImage(logoPath);
    
    // Calculate watermark dimensions
    const watermarkWidth = (img.width * logoWidthPercentage) / 100;
    const scale = watermarkWidth / watermark.width;
    const watermarkHeight = watermark.height * scale;
    
    // Position watermark in center
    const x = (canvas.width - watermarkWidth) / 2;
    const y = (canvas.height - watermarkHeight) / 2;
    
    // Set transparency
    ctx.globalAlpha = opacity;
    
    // Draw watermark
    ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
    
    // Reset transparency
    ctx.globalAlpha = 1.0;
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        originalImage.type,
        0.92  // Preserve quality
      );
    });
    
    return blob;
  } finally {
    // Clean up
    URL.revokeObjectURL(imageUrl);
  }
};

// Helper function to load images
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}; 