import React, { useState, useCallback, useRef } from 'react';
import './index.less';
import { mockData, mockEffect } from './mock';
import { Timeline } from '@xzdarcy/react-timeline-editor';
import { TimelineAction, TimelineRow } from '@xzdarcy/timeline-engine';
import { cloneDeep } from 'lodash';

// ─────────────────────────────────────────────
// Feature toggle state
// ─────────────────────────────────────────────

interface FeatureToggles {
  enableCrossRowDrag: boolean;
  enableGhostPreview: boolean;
  enableRowReorder: boolean;
  enableGridSnap: boolean;
  showDragLines: boolean;
}

// ─────────────────────────────────────────────
// Custom block renderer (to show custom render still works)
// ─────────────────────────────────────────────

const EFFECT_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  effect0: { bg: '#1a3a5c', border: '#3b82f6', label: 'FX-A' },
  effect1: { bg: '#3b1a4a', border: '#a855f7', label: 'FX-B' },
};

const CustomBlockRender = (action: TimelineAction, row: TimelineRow) => {
  const colors = EFFECT_COLORS[action.effectId] || { bg: '#333', border: '#666', label: action.effectId };
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}cc 100%)`,
        border: `1px solid ${colors.border}`,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        overflow: 'hidden',
        fontSize: 11,
        color: colors.border,
        fontWeight: 600,
        letterSpacing: '0.05em',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {colors.label} · {action.id}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main demo component
// ─────────────────────────────────────────────

const FeatureDemo: React.FC = () => {
  const [data, setData] = useState<TimelineRow[]>(() => cloneDeep(mockData));
  const [useCustomRender, setUseCustomRender] = useState(false);
  const [features, setFeatures] = useState<FeatureToggles>({
    enableCrossRowDrag: true,
    enableGhostPreview: true,
    enableRowReorder: false,
    enableGridSnap: false,
    showDragLines: false,
  });
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = useCallback((msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  }, []);

  const toggleFeature = (key: keyof FeatureToggles) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetData = () => {
    setData(cloneDeep(mockData));
    log('Data reset to initial state');
  };

  return (
    <div className="feature-demo">
      {/* ── Header ── */}
      <header className="demo-header">
        <div className="demo-header-left">
          <div className="demo-logo">▶</div>
          <div>
            <h1>React Timeline Editor Enhanced</h1>
            <p>Cross-row drag · Ghost preview · Custom blocks · Bug-free interaction</p>
          </div>
        </div>
        <button className="reset-btn" onClick={resetData}>
          ↺ Reset Data
        </button>
      </header>

      <div className="demo-layout">
        {/* ── Sidebar ── */}
        <aside className="demo-sidebar">
          <section className="sidebar-section">
            <h3 className="sidebar-title">✦ Feature Toggles</h3>
            <div className="toggle-list">
              <ToggleItem
                id="crossRowDrag"
                label="Cross-Row Block Drag"
                description="Drag any block to a different row"
                checked={features.enableCrossRowDrag}
                onChange={() => toggleFeature('enableCrossRowDrag')}
                badge="New"
                badgeColor="#3b82f6"
              />
              <ToggleItem
                id="ghostPreview"
                label="Ghost Drag Preview"
                description="Show glowing ghost following cursor"
                checked={features.enableGhostPreview}
                onChange={() => toggleFeature('enableGhostPreview')}
                badge="New"
                badgeColor="#a855f7"
                disabled={!features.enableCrossRowDrag}
              />
              <ToggleItem
                id="rowReorder"
                label="Row Reordering"
                description="Drag rows via ⋮⋮ handle"
                checked={features.enableRowReorder}
                onChange={() => toggleFeature('enableRowReorder')}
              />
              <ToggleItem
                id="gridSnap"
                label="Grid Snap"
                description="Snap blocks to time grid"
                checked={features.enableGridSnap}
                onChange={() => toggleFeature('enableGridSnap')}
              />
              <ToggleItem
                id="dragLines"
                label="Drag Assist Lines"
                description="Show alignment guides while dragging"
                checked={features.showDragLines}
                onChange={() => toggleFeature('showDragLines')}
              />
            </div>
          </section>

          <section className="sidebar-section">
            <h3 className="sidebar-title">✦ Rendering</h3>
            <div className="toggle-list">
              <ToggleItem
                id="customRender"
                label="Custom Block Renderer"
                description="Render blocks with custom component"
                checked={useCustomRender}
                onChange={() => setUseCustomRender((v) => !v)}
                badge="Supported"
                badgeColor="#10b981"
              />
            </div>
          </section>

          <section className="sidebar-section">
            <h3 className="sidebar-title">✦ How to Use</h3>
            <div className="how-to-list">
              <div className="how-to-item">
                <span className="how-to-icon">🖱️</span>
                <div>
                  <strong>Move block (same row)</strong>
                  <p>Click and drag any block body horizontally</p>
                </div>
              </div>
              <div className="how-to-item">
                <span className="how-to-icon">⬆️</span>
                <div>
                  <strong>Cross-row drag</strong>
                  <p>Click the block and drag it vertically to another row</p>
                </div>
              </div>
              <div className="how-to-item">
                <span className="how-to-icon">↔️</span>
                <div>
                  <strong>Resize block</strong>
                  <p>Drag the left or right edge handle</p>
                </div>
              </div>
              <div className="how-to-item">
                <span className="how-to-icon">⋮⋮</span>
                <div>
                  <strong>Reorder rows</strong>
                  <p>Enable Row Reordering, then drag the handle</p>
                </div>
              </div>
            </div>
          </section>

          <section className="sidebar-section">
            <h3 className="sidebar-title">✦ Event Log</h3>
            <div className="event-log">
              {eventLog.length === 0 ? (
                <p className="event-log-empty">No events yet. Interact with the timeline.</p>
              ) : (
                eventLog.map((e, i) => (
                  <div key={i} className="event-log-item">
                    {e}
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>

        {/* ── Timeline ── */}
        <main className="demo-main">
          <div className="timeline-wrapper">
            <Timeline
              editorData={data}
              effects={mockEffect}
              onChange={(newData) => {
                setData([...newData]);
              }}
              // Feature props
              enableCrossRowDrag={features.enableCrossRowDrag}
              enableGhostPreview={features.enableGhostPreview && features.enableCrossRowDrag}
              enableRowDrag={features.enableRowReorder}
              gridSnap={features.enableGridSnap}
              dragLine={features.showDragLines}
              // Visual / behaviour
              autoScroll={true}
              hideCursor={false}
              rowHeight={40}
              scaleWidth={160}
              // Custom renderer (when enabled)
              getActionRender={useCustomRender ? CustomBlockRender : undefined}
              // Callbacks — all fire to event log
              onActionMoveStart={({ action, row }) => {
                log(`Move start: ${action.id} in row ${row.id}`);
              }}
              onActionMoveEnd={({ action, row, start, end }) => {
                log(`Move end: ${action.id} → row ${row.id} [${start.toFixed(2)}s – ${end.toFixed(2)}s]`);
              }}
              onActionResizeStart={({ action, row, dir }) => {
                log(`Resize start: ${action.id} (${dir})`);
              }}
              onActionResizeEnd={({ action, row, start, end }) => {
                log(`Resize end: ${action.id} [${start.toFixed(2)}s – ${end.toFixed(2)}s]`);
              }}
              onRowDragStart={({ row }) => {
                log(`Row drag start: row ${row.id}`);
              }}
              onRowDragEnd={({ row, editorData }) => {
                setData([...editorData]);
                log(`Row drag end: row ${row.id} → new position`);
              }}
              onClickAction={(e, { action, row }) => {
                log(`Click: ${action.id} in row ${row.id}`);
              }}
            />
          </div>
          <div className="row-count-bar">
            {data.length} rows · {data.reduce((s, r) => s + r.actions.length, 0)} total blocks
          </div>
        </main>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Toggle item sub-component
// ─────────────────────────────────────────────

interface ToggleItemProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ id, label, description, checked, onChange, badge, badgeColor, disabled }) => (
  <label
    htmlFor={id}
    className={`toggle-item ${disabled ? 'toggle-item--disabled' : ''}`}
    style={{ opacity: disabled ? 0.45 : 1 }}
  >
    <div className="toggle-item-text">
      <div className="toggle-item-label">
        {label}
        {badge && (
          <span className="toggle-badge" style={{ background: badgeColor }}>
            {badge}
          </span>
        )}
      </div>
      <div className="toggle-item-desc">{description}</div>
    </div>
    <div className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={disabled ? undefined : onChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      <div className="toggle-thumb" />
    </div>
  </label>
);

export default FeatureDemo;
