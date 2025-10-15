import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './layouts/Sidebar';
import Topnav from './layouts/Topnav';
import Main from './layouts/Main';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Layout component with state management
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // No authentication check - always show layout

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`
        bg-background transition-all duration-300 ease-in-out overflow-hidden
        ${sidebarOpen ? 'w-72' : 'w-0'}
      `}>
        <div className="w-72 h-full">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topnav */}
        <Topnav onToggleSidebar={() => {
          console.log('Toggle clicked, current state:', sidebarOpen);
          setSidebarOpen(!sidebarOpen);
        }} />
        
        {/* Main Content */}
        <Main>
          {children}
        </Main>
      </div>
    </div>
  );
};

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        );
        
        // All pages should have the layout (no authentication required)
        const shouldHaveLayout = true;
        
        // Add persistent layout only for authenticated pages
        if (shouldHaveLayout) {
            (page as any).default.layout = (page: React.ReactNode) => {
                return <Layout>{page}</Layout>;
            };
        }
        
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
