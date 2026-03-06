import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from '../config/app-config';
import { Agentation } from "agentation";

// Import all components
import MainPage from '../components/main';
// import BasicExample from '../components/basic';
// import TimelineExample from '../components/timeline';
// import AnimationExample from '../components/animation';

import RowDrag from '../components/row-drag';

const componentMap: Record<string, React.FC> = {
  MainPage,
  // BasicExample,
  // TimelineExample,
  // AnimationExample,
  RowDrag,

};

const App: React.FC = () => {
  return (
    <>
      <Router>
      <Routes>
        {/* Default route goes directly to the feature demo */}
        <Route path="/" element={<Navigate to="/row-drag" replace />} />

        {/* Dynamically render all routes */}
        {routes.map((route) => {
          const Component = componentMap[route.componentName];
          return Component ? <Route key={route.id} path={route.path} element={<Component />} /> : null;
        })}

        {/* 404 redirect to main page */}
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </Router>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
