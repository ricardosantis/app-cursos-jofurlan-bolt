import { StackHandler } from '@stackframe/react';
import { stackClientApp } from '@/stack/client';
import { usePathname } from 'expo-router';

export default function StackPage() {
  const pathname = usePathname();
  return <StackHandler app={stackClientApp} location={pathname} fullPage />;
}
