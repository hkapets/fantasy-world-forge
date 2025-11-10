import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';

interface LazyComponentProps {
  [key: string]: any;
}

const LazyLoadFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px'
  }}>
    <LoadingSpinner />
  </div>
);

export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return (props: LazyComponentProps) => (
    <Suspense fallback={fallback || <LazyLoadFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export const lazyComponents = {
  Characters: () => import('@/components/Characters/Characters').then(m => ({ default: m.Characters })),
  CharacterView: () => import('@/components/Characters/CharacterView').then(m => ({ default: m.CharacterView })),
  Lore: () => import('@/components/Lore/Lore').then(m => ({ default: m.Lore })),
  LoreItemView: () => import('@/components/Lore/LoreItemView').then(m => ({ default: m.LoreItemView })),
  Maps: () => import('@/components/Maps/Maps').then(m => ({ default: m.Maps })),
  MapView: () => import('@/components/Maps/MapView').then(m => ({ default: m.MapView })),
  Chronology: () => import('@/components/Chronology/Chronology').then(m => ({ default: m.Chronology })),
  Relationships: () => import('@/components/Relationships/Relationships').then(m => ({ default: m.Relationships })),
  Scenarios: () => import('@/components/Scenarios/Scenarios').then(m => ({ default: m.Scenarios })),
  ScenarioView: () => import('@/components/Scenarios/ScenarioView').then(m => ({ default: m.ScenarioView })),
  Notes: () => import('@/components/Notes/Notes').then(m => ({ default: m.Notes })),
  Dashboard: () => import('@/components/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })),
  Settings: () => import('@/components/Settings/Settings').then(m => ({ default: m.Settings })),
  ExportWizard: () => import('@/components/Export/ExportWizard').then(m => ({ default: m.ExportWizard })),
  PluginManager: () => import('@/components/Settings/PluginManager').then(m => ({ default: m.PluginManager })),
};

export type LazyComponentName = keyof typeof lazyComponents;

export function getLazyComponent(name: LazyComponentName) {
  const importFunc = lazyComponents[name];
  if (!importFunc) {
    console.error(`Lazy component "${name}" not found`);
    return null;
  }
  return lazyLoadComponent(importFunc);
}
