/**
 * Component lazy loader utility for performance optimization
 * Defers component initialization until they enter viewport
 */

import { lazy, Suspense, ComponentType } from 'react';

export const createLazyComponent = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  return lazy(importFn);
};

export const ComponentLoader = ({ 
  Component, 
  fallback = <div className="h-screen flex items-center justify-center bg-background" /> 
}: { 
  Component: ComponentType<any>; 
  fallback?: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    <Component />
  </Suspense>
);
