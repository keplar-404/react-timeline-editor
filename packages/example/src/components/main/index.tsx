import React from 'react';
import { useNavigate } from 'react-router-dom';
import { examples } from '../../config/app-config';
import './index.less';

const MainPage: React.FC = () => {
  const getStatusBadge = (status: 'ready' | 'planned' | 'development') => {
    const statusConfig = {
      ready: { text: 'Available', color: '#28a745', bgColor: '#d4edda' },
      development: { text: 'In Development', color: '#ffc107', bgColor: '#fff3cd' },
      planned: { text: 'Planned', color: '#6c757d', bgColor: '#e9ecef' },
    };

    const config = statusConfig[status];
    return (
      <span
        style={{
          padding: '2px 8px',
          fontSize: '12px',
          borderRadius: '12px',
          color: config.color,
          backgroundColor: config.bgColor,
          fontWeight: 'bold',
        }}
      >
        {config.text}
      </span>
    );
  };

  const navigate = useNavigate();

  const handleExampleClick = (example: typeof examples[number]) => {
    if (example.status === 'ready') {
      // Navigate using React Router
      navigate(example.route);
    } else {
      alert(`Example "${example.title}" is not yet available.`);
    }
  };

  return (
    <div className="main-page">
      {/* Header */}
      <div className="header">
        <h1>React Timeline Editor</h1>
        <p>Example project navigator</p>
        <div className="launcher-info">
          <span style={{ marginRight: '8px' }}>🚀</span>
          Use the launcher to select different examples to test
        </div>
      </div>

      {/* Examples grid */}
      <div className="examples-grid">
        {examples.map((example) => (
          <div
            key={example.id}
            onClick={() => handleExampleClick(example)}
            className={`example-card ${example.status === 'ready' ? 'ready' : ''}`}
            style={
              {
                '--example-color': example.color,
              } as React.CSSProperties
            }
          >
            {/* Status badge */}
            <div className="status-badge">{getStatusBadge(example.status)}</div>

            {/* Icon */}
            <div className="example-icon">{example.icon}</div>

            {/* Title */}
            <h3 className="example-title">{example.title}</h3>

            {/* Description */}
            <p className="example-description">{example.description}</p>

            {/* Action button */}
            <div className="example-action">
              <button disabled={example.status !== 'ready'} className={example.status === 'ready' ? 'ready' : ''}>
                {example.status === 'ready' ? 'Launch Example' : 'Coming Soon'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="instructions">
        <h3>How to Use</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div className="step-item">
            <div className="step-number" style={{ '--step-color': '#007acc' } as React.CSSProperties}>
              1
            </div>
            <div className="step-content">
              <strong>Start the dev server</strong>
              <p>
                From the project root, run: <code>yarn example run</code>
              </p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number" style={{ '--step-color': '#51cf66' } as React.CSSProperties}>
              2
            </div>
            <div className="step-content">
              <strong>Choose an example</strong>
              <p>Select the example page you want to test from the launcher menu</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number" style={{ '--step-color': '#fcc419' } as React.CSSProperties}>
              3
            </div>
            <div className="step-content">
              <strong>Start developing</strong>
              <p>The dev server starts automatically with hot reload enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>React Timeline Editor — Development Environment</p>
      </div>
    </div>
  );
};

export default MainPage;
