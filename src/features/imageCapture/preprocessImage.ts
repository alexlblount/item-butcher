interface ImageDataObject {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  getContext(): CanvasRenderingContext2D;
  drawImage(): void;
  getImageData(): ImageData;
  putImageData(imageData: ImageData): void;
}

function createImageData(image: HTMLImageElement): ImageDataObject {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  return {
    canvas,
    image,
    getContext(): CanvasRenderingContext2D {
      const context = this.canvas.getContext('2d', {
        willReadFrequently: true,
      });
      if (!context) {
        throw new Error('Unable to get canvas context');
      }
      return context;
    },
    drawImage(): void {
      const context = this.getContext();
      context.drawImage(
        this.image,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
    },
    getImageData(): ImageData {
      const context = this.getContext();
      return context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    putImageData(imageData: ImageData): void {
      const context = this.getContext();
      context.putImageData(imageData, 0, 0);
    },
  };
}

function convertToGrayscale(imageDataObject: ImageDataObject): void {
  const imageData = imageDataObject.getImageData();
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }

  imageDataObject.putImageData(imageData);
}

function applyThreshold(
  imageDataObject: ImageDataObject,
  threshold: number = 128,
): void {
  const imageData = imageDataObject.getImageData();
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const bw = avg >= threshold ? 255 : 0;
    data[i] = bw; // red
    data[i + 1] = bw; // green
    data[i + 2] = bw; // blue
  }

  imageDataObject.putImageData(imageData);
}

function calculateAverageColor(imageDataObject: ImageDataObject): string {
  const imageData = imageDataObject.getImageData();
  const data = imageData.data;

  const coverWidth = imageDataObject.canvas.width * 0.3; // 30% of the canvas width
  const coverHeight = coverWidth * 1.2; // 1.2 times the width

  // Define the sample area - directly below the top-right corner image, offset by 10px
  const sampleArea = {
    x: imageDataObject.canvas.width - coverWidth,
    y: coverHeight + 10, // Offset by 10px
    width: coverWidth,
    height: 10, // Sample height
  };

  let r = 0,
    g = 0,
    b = 0;

  for (let i = sampleArea.x; i < sampleArea.x + sampleArea.width; i++) {
    for (let j = sampleArea.y; j < sampleArea.y + sampleArea.height; j++) {
      const idx = (j * imageData.width + i) * 4;
      r += data[idx];
      g += data[idx + 1];
      b += data[idx + 2];
    }
  }

  const totalPixels = sampleArea.width * sampleArea.height;
  r = Math.round(r / totalPixels);
  g = Math.round(g / totalPixels);
  b = Math.round(b / totalPixels);

  return `rgb(${r}, ${g}, ${b})`;
}

function invertColors(imageDataObject: ImageDataObject): void {
  const context = imageDataObject.getContext();
  const imageData = context.getImageData(
    0,
    0,
    imageDataObject.canvas.width,
    imageDataObject.canvas.height,
  );
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // Invert Red
    data[i + 1] = 255 - data[i + 1]; // Invert Green
    data[i + 2] = 255 - data[i + 2]; // Invert Blue
    // Alpha channel (data[i + 3]) is left unchanged
  }

  context.putImageData(imageData, 0, 0);
}

function coverCornerImage(imageDataObject: ImageDataObject): void {
  const context = imageDataObject.getContext();

  // Define the area to cover
  const coverWidth = imageDataObject.canvas.width * 0.3; // 30% of the canvas width
  const coverHeight = coverWidth * 1.2; // 1.2 times the width

  // Calculate the position (top-right corner)
  const coverX = imageDataObject.canvas.width - coverWidth;
  const coverY = 0; // Starting from the top

  // Cover the area with a color matching the background
  context.fillStyle = calculateAverageColor(imageDataObject);
  context.fillRect(coverX, coverY, coverWidth, coverHeight);
}

function preprocessImage(image: HTMLImageElement): HTMLCanvasElement {
  const imageDataObject = createImageData(image);

  // Adjust the canvas dimensions to exclude the 20px border from the left, right, and top sides
  imageDataObject.canvas.width -= 50; // 25px from each side (left and right)
  imageDataObject.canvas.height -= 25; // 25px from the top

  // Draw the image onto the canvas, excluding the 20px border from the left, right, and top sides
  const context = imageDataObject.getContext();
  // Apply antialiasing by enabling image smoothing
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    imageDataObject.image,
    25,
    25, // Start drawing 20px from the left and 20px from the top of the original image
    image.width - 50,
    image.height - 25, // Adjust the width and height to exclude borders
    0,
    0,
    imageDataObject.canvas.width,
    imageDataObject.canvas.height, // Draw on the entire canvas
  );

  // Then apply other preprocessing steps
  coverCornerImage(imageDataObject);
  convertToGrayscale(imageDataObject);
  applyThreshold(imageDataObject);
  invertColors(imageDataObject);

  return imageDataObject.canvas;
}

export { ImageDataObject, convertToGrayscale, applyThreshold, preprocessImage };
