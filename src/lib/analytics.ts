export const sendGAEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    console.warn('gtag is not loaded');
  }
};
