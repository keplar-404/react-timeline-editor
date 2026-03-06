// App config — unified route + example display configuration
export interface AppConfig {
  id: string;
  path: string;
  componentName: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  status: 'ready' | 'planned' | 'development';
}

// All example configs — single source of truth for routes and display info
export const appConfigs: AppConfig[] = [
  {
    id: 'row-drag',
    path: '/row-drag',
    componentName: 'RowDrag',
    title: 'Row Drag',
    description: 'Row drag and drop — reorder rows and drag blocks across rows',
    route: '/row-drag',
    icon: '⭐',
    color: '#b15a40',
    status: 'ready',
  },
  {
    id: 'main',
    path: '/main',
    componentName: 'MainPage',
    title: 'Main Page',
    description: 'Navigation page for all examples',
    route: '/main',
    icon: '🏠',
    color: '#007acc',
    status: 'planned',
  },
  {
    id: 'basic',
    path: '/basic',
    componentName: 'BasicExample',
    title: 'Basic Example',
    description: 'Basic React functionality and component interactions',
    route: '/basic',
    icon: '⚛️',
    color: '#007acc',
    status: 'planned',
  },
  {
    id: 'timeline',
    path: '/timeline',
    componentName: 'TimelineExample',
    title: 'Timeline Editor',
    description: 'Core timeline editor functionality demo',
    route: '/timeline',
    icon: '⏰',
    color: '#ff6b6b',
    status: 'planned',
  },
  // {
  //   id: 'animation',
  //   path: '/animation',
  //   componentName: 'AnimationExample',
  //   title: 'Animation',
  //   description: 'CSS animation effects and transitions',
  //   route: '/animation',
  //   icon: '🎬',
  //   color: '#51cf66',
  //   status: 'planned',
  // },
  // {
  //   id: 'advanced',
  //   path: '/advanced',
  //   componentName: 'AdvancedExample',
  //   title: 'Advanced Features',
  //   description: 'Advanced timeline editor capabilities',
  //   route: '/advanced',
  //   icon: '🚀',
  //   color: '#fcc419',
  //   status: 'planned',
  // },
  // {
  //   id: 'integration',
  //   path: '/integration',
  //   componentName: 'IntegrationExample',
  //   title: 'Integration',
  //   description: 'Integration with third-party libraries',
  //   route: '/integration',
  //   icon: '🔗',
  //   color: '#ae3ec9',
  //   status: 'planned',
  // },
  // {
  //   id: 'customization',
  //   path: '/customization',
  //   componentName: 'CustomizationExample',
  //   title: 'Customization',
  //   description: 'Theme customization and style extension',
  //   route: '/customization',
  //   icon: '🎨',
  //   color: '#20c997',
  //   status: 'development',
  // },
];

// Get available route configs (status === ready)
export const getAvailableRoutes = () => {
  return appConfigs.filter((config) => config.status === 'ready');
};

// Get all example configs (for the main page display)
export const getExamples = () => {
  return appConfigs.filter((config) => config.id !== 'main');
};

// Find config by ID
export const findConfigById = (id: string) => {
  return appConfigs.find((config) => config.id === id);
};

// Add a new config (used by scaffolding scripts)
export const addConfig = (configData: Omit<AppConfig, 'componentName' | 'route' | 'path'>) => {
  const newConfig: AppConfig = {
    ...configData,
    componentName: capitalizeFirst(configData.id),
    route: `/${configData.id}`,
    path: `/${configData.id}`,
  };

  appConfigs.push(newConfig);
  return newConfig;
};

// Helper: capitalise first letter
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Route config export (backwards-compatible)
export const routes = appConfigs.map((config) => ({
  id: config.id,
  path: config.path,
  componentName: config.componentName,
  title: config.title,
  description: config.description,
  status: config.status,
}));

// Example config export (backwards-compatible)
export const examples = appConfigs
  .filter((config) => config.id !== 'main')
  .map((config) => ({
    id: config.id,
    title: config.title,
    description: config.description,
    route: config.route,
    icon: config.icon,
    color: config.color,
    status: config.status,
  }));
