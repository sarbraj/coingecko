import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();
    renderCountRef.current += 1;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} mounted at ${mountTimeRef.current}ms`);
      console.log(`${componentName} render count: ${renderCountRef.current}`);
    }

    return () => {
      if (process.env.NODE_ENV === 'development') {
        const unmountTime = performance.now();
        console.log(
          `${componentName} unmounted after ${unmountTime - mountTimeRef.current}ms`
        );
      }
    };
  }, [componentName]);

  return renderCountRef.current;
};
