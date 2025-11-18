import React from 'react';

type AdminPageWrapperProps = {
  children: React.ReactNode;
};

export function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  return <>{children}</>;
}
