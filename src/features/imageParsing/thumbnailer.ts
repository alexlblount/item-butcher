export function saveImageData(dataUrl: string): string {
  const key = generateUniqueKey();
  sessionStorage.setItem(key, dataUrl);
  return key;
}

export function generateUniqueKey(): string {
  return `image_${Date.now()}`;
}

export function getImageData(key: string): string | null {
  return sessionStorage.getItem(key);
}

export function clearSessionStorage(): void {
  sessionStorage.clear();
}
