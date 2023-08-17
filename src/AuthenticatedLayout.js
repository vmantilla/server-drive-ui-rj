// AuthenticatedLayout.js
import React from 'react';
import SidebarMenu from './views/Dashboard/SidebarMenu';

function AuthenticatedLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <SidebarMenu />
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

export default AuthenticatedLayout;
