export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const zoomToPercent = (zoom: number): number => {
  return Math.round(zoom * 100);
};

export const percentToZoom = (percent: number): number => {
  return percent / 100;
};

export const generateSeed = (): number => {
  return Math.floor(Math.random() * 1000000);
};
