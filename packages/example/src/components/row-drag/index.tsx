import React, { useState, useCallback, useRef, useEffect } from 'react';
import './index.less';
import { mockData, mockEffect } from './mock';
import {
  Timeline, CutOverlay, CutOverlayConfig, splitActionInRow,
  LoopZoneOverlay, TimelineState, TransportBar, useTimelinePlayer
} from '@keplar-404/react-timeline-editor';
import { TimelineAction, TimelineRow } from '@keplar-404/timeline-engine';
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
  enableCut: boolean;
}

// ─────────────────────────────────────────────
// Custom block renderer (to show custom render still works)
// ─────────────────────────────────────────────

const EFFECT_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  effect0: { bg: '#1a3a5c', border: '#3b82f6', label: 'FX-A' },
  effect1: { bg: '#3b1a4a', border: '#a855f7', label: 'FX-B' },
};

const CustomBlockRender = (action: TimelineAction, _row: TimelineRow) => {
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
// Custom Ghost Preview Components
// These are what a consumer of your npm package would build.
// ─────────────────────────────────────────────

/**
 * Example A: Rich ghost — mirrors the block's actual appearance.
 * Consumers can make their ghost look exactly like their block.
 */
const RichGhostPreview = ({ action, row }: { action: TimelineAction; row: TimelineRow }) => {
  const colors = EFFECT_COLORS[action.effectId] || { bg: '#333', border: '#666', label: action.effectId };
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${colors.bg}cc 0%, ${colors.bg}88 100%)`,
        border: `2px dashed ${colors.border}`,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        boxSizing: 'border-box',
        boxShadow: `0 0 18px ${colors.border}66, 0 0 6px ${colors.border}99`,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: colors.border, letterSpacing: '0.05em' }}>
        {colors.label}
      </span>
      <span style={{ fontSize: 10, color: `${colors.border}bb` }}>
        {action.id} · row {row.id}
      </span>
    </div>
  );
};

/**
 * Example B: Minimal ghost — just a semi-transparent label pill.
 * Shows that the ghost can be anything — even very simple.
 */
const MinimalGhostPreview = ({ action }: { action: TimelineAction }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
    }}
  >
    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
      Moving {action.id}…
    </span>
  </div>
);


// ─────────────────────────────────────────────
// Main demo component
// ─────────────────────────────────────────────

// Ghost preview style modes
type GhostStyle = 'default' | 'custom-rich' | 'custom-minimal';

const FeatureDemo: React.FC = () => {
  const timelineRef = useRef<TimelineState>(null);
  // ── Loop zone state ──
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopStart, setLoopStart]     = useState(1);
  const [loopEnd, setLoopEnd]         = useState(3);
  const [scrollLeft, setScrollLeft]   = useState(0);

  // ── Player hook (handles events, state, and loop clock) ──
  const player = useTimelinePlayer(timelineRef, {
    loop: { enabled: loopEnabled, start: loopStart, end: loopEnd },
  });

  const [data, setData] = useState<TimelineRow[]>(() => cloneDeep(mockData));
  const [useCustomRender, setUseCustomRender] = useState(false);
  const [ghostStyle, setGhostStyle] = useState<GhostStyle>('default');
  const [features, setFeatures] = useState<FeatureToggles>({
    enableCrossRowDrag: true,
    enableGhostPreview: true,
    enableRowReorder: false,
    enableGridSnap: false,
    showDragLines: false,
    enableCut: false,
  });
  const [cutConfig, setCutConfig] = useState<Required<CutOverlayConfig>>({
    bladeColor: '#ef4444',
    showPill: true,
    formatPillLabel: (t) => `✂ ${t.toFixed(2)}s`,
    pillColor: '#ef4444',
    pillTextColor: '#ffffff',
    showBlockHighlight: true,
    blockHighlightColor: 'rgba(239,68,68,0.08)',
    blockHighlightBorderColor: 'rgba(239,68,68,0.3)',
    cursor: 'col-resize',
    keyboardModifier: '',
  });
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [isDragDisabled, setIsDragDisabled] = useState(false);
  const log = useCallback((msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  }, []);

  const toggleFeature = (key: keyof FeatureToggles) => {
    setFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // When enabling cut mode, initialise isDragDisabled based on whether a modifier is required.
      // No modifier (always-cut) → drag disabled immediately.
      // Modifier configured → drag stays on until key is pressed.
      if (key === 'enableCut') {
        if (next.enableCut) {
          setIsDragDisabled(!cutConfig.keyboardModifier);
        } else {
          setIsDragDisabled(false);
        }
      }
      return next;
    });
  };

  const updateCutConfig = (key: keyof CutOverlayConfig, value: any) => {
    setCutConfig((prev) => ({ ...prev, [key]: value }));
    // When modifier config changes, reset drag-disabled to the appropriate default:
    // no modifier = always disabled; modifier set = not disabled (until key pressed)
    if (key === 'keyboardModifier') {
      setIsDragDisabled(!value);
    }
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
              <ToggleItem
                id="bladeCut"
                label="Blade Cut Mode"
                description="Hover block to preview cut · click to split"
                checked={features.enableCut}
                onChange={() => toggleFeature('enableCut')}
                badge="New"
                badgeColor="#ef4444"
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

            {/* ── Ghost Preview Style Selector ── */}
            <div style={{ marginTop: 12, opacity: features.enableCrossRowDrag && features.enableGhostPreview ? 1 : 0.4 }}>
              <div className="sidebar-sub-title">Ghost Preview Style</div>
              <div className="ghost-style-list">
                {([
                  { value: 'default', label: 'Default', desc: 'Built-in blue glow' },
                  { value: 'custom-rich', label: 'Custom: Rich', desc: 'Mirrors block appearance' },
                  { value: 'custom-minimal', label: 'Custom: Minimal', desc: 'Simple text label' },
                ] as { value: GhostStyle; label: string; desc: string }[]).map(({ value, label, desc }) => (
                  <label
                    key={value}
                    className={`ghost-style-option ${ghostStyle === value ? 'ghost-style-option--active' : ''}`}
                    onClick={() => features.enableCrossRowDrag && features.enableGhostPreview && setGhostStyle(value)}
                  >
                    <div className="ghost-style-radio">
                      {ghostStyle === value && <div className="ghost-style-radio-dot" />}
                    </div>
                    <div>
                      <div className="ghost-style-label">{label}</div>
                      <div className="ghost-style-desc">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ── Cut Configuration ── */}
          {features.enableCut && (
            <section className="sidebar-section">
              <h3 className="sidebar-title">✦ Cut Configuration</h3>
              <div className="toggle-list">
                <ToggleItem
                  id="showPill"
                  label="Show Time Pill"
                  description="Display time tooltip above blade"
                  checked={cutConfig.showPill}
                  onChange={() => updateCutConfig('showPill', !cutConfig.showPill)}
                />
                <ToggleItem
                  id="showHighlight"
                  label="Show Block Highlight"
                  description="Highlight the block hovered"
                  checked={cutConfig.showBlockHighlight}
                  onChange={() => updateCutConfig('showBlockHighlight', !cutConfig.showBlockHighlight)}
                />

                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#9ca3af', minWidth: 100 }}>Cursor Style</span>
                    <select 
                      value={cutConfig.cursor} 
                      onChange={(e) => updateCutConfig('cursor', e.target.value)} 
                      style={{ width: '100%', maxWidth: 120, background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}
                    >
                      <option value="col-resize">col-resize</option>
                      <option value="crosshair">crosshair</option>
                      <option value="copy">copy</option>
                      <option value="pointer">pointer</option>
                      <option value="default">default</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#9ca3af', minWidth: 100 }}>Hold Key to Cut</span>
                    <select 
                      value={cutConfig.keyboardModifier || ''} 
                      onChange={(e) => updateCutConfig('keyboardModifier', e.target.value)} 
                      style={{ width: '100%', maxWidth: 120, background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}
                    >
                      <option value="">None (Always Active)</option>
                      <option value="Alt">Alt / Option</option>
                      <option value="Control">Control</option>
                      <option value="Shift">Shift</option>
                      <option value="Meta">Meta / Cmd</option>
                      <option value="c">Letter 'C'</option>
                      <option value="x">Letter 'X'</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#9ca3af' }}>Blade Color</span>
                    <input 
                      type="color" 
                      value={cutConfig.bladeColor} 
                      onChange={(e) => updateCutConfig('bladeColor', e.target.value)} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', height: 24, width: 24, padding: 0 }}
                    />
                  </div>
                  {cutConfig.showPill && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#9ca3af' }}>Pill Background</span>
                      <input 
                        type="color" 
                        value={cutConfig.pillColor} 
                        onChange={(e) => updateCutConfig('pillColor', e.target.value)} 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', height: 24, width: 24, padding: 0 }}
                      />
                    </div>
                  )}
                  {cutConfig.showBlockHighlight && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#9ca3af', minWidth: 100 }}>Fill (rgba)</span>
                        <input 
                          type="text" 
                          value={cutConfig.blockHighlightColor} 
                          onChange={(e) => updateCutConfig('blockHighlightColor', e.target.value)} 
                          style={{ width: '100%', maxWidth: 120, background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#9ca3af', minWidth: 100 }}>Border (rgba)</span>
                        <input 
                          type="text" 
                          value={cutConfig.blockHighlightBorderColor} 
                          onChange={(e) => updateCutConfig('blockHighlightBorderColor', e.target.value)} 
                          style={{ width: '100%', maxWidth: 120, background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

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
          {/* ── Transport Bar ── */}
          <TransportBar
            player={player}
            loop={{
              enabled: loopEnabled,
              start: loopStart,
              end: loopEnd,
              onToggle: () => setLoopEnabled((v) => !v),
              onStartChange: setLoopStart,
              onEndChange: setLoopEnd,
            }}
          />
          <div className="timeline-wrapper">
            <Timeline
              ref={timelineRef}
              editorData={data}
              effects={mockEffect}
              onChange={(newData) => {
                setData([...newData]);
              }}
              // Feature props
              enableCrossRowDrag={features.enableCrossRowDrag && !(features.enableCut && isDragDisabled)}
              enableGhostPreview={features.enableGhostPreview && features.enableCrossRowDrag && !(features.enableCut && isDragDisabled)}
              enableRowDrag={features.enableRowReorder}
              gridSnap={features.enableGridSnap}
              dragLine={features.showDragLines}
              disableDrag={features.enableCut && isDragDisabled}
              // Custom ghost preview (only wired when not using the default)
              getGhostPreview={
                features.enableCrossRowDrag && features.enableGhostPreview && ghostStyle !== 'default'
                  ? ghostStyle === 'custom-rich'
                    ? ({ action, row }) => <RichGhostPreview action={action} row={row} />
                    : ({ action }) => <MinimalGhostPreview action={action} />
                  : undefined
              }
              // Visual / behaviour
              autoScroll={true}
              hideCursor={false}
              rowHeight={40}
              scaleWidth={160}
              onScroll={(params) => setScrollLeft(params.scrollLeft)}
              // Custom renderer (when enabled)
              getActionRender={useCustomRender ? CustomBlockRender : undefined}
              // Callbacks — all fire to event log
              onActionMoveStart={({ action, row }) => {
                log(`Move start: ${action.id} in row ${row.id}`);
              }}
              onActionMoveEnd={({ action, row, start, end }) => {
                log(`Move end: ${action.id} → row ${row.id} [${start.toFixed(2)}s – ${end.toFixed(2)}s]`);
              }}
              onActionResizeStart={({ action, dir }) => {
                log(`Resize start: ${action.id} (${dir})`);
              }}
              onActionResizeEnd={({ action, start, end }) => {
                log(`Resize end: ${action.id} [${start.toFixed(2)}s – ${end.toFixed(2)}s]`);
              }}
              onRowDragStart={({ row }) => {
                log(`Row drag start: row ${row.id}`);
              }}
              onRowDragEnd={({ row, editorData }) => {
                setData([...editorData]);
                log(`Row drag end: row ${row.id} → new position`);
              }}
              onClickAction={(_e, { action, row }) => {
                if (!features.enableCut) log(`Click: ${action.id} in row ${row.id}`);
              }}
            />
            {/* ── Loop Zone Overlay ── */}
            {loopEnabled && (
              <LoopZoneOverlay
                loopStart={loopStart}
                loopEnd={loopEnd}
                startLeft={20}
                scale={1}
                scaleWidth={160}
                scrollLeft={scrollLeft}
                onLoopStartChange={setLoopStart}
                onLoopEndChange={setLoopEnd}
              />
            )}
            {/* ── Cut Overlay ── */}
            {features.enableCut && (
              <CutOverlay
                data={data}
                scale={1}
                scaleSplitCount={10}
                scaleWidth={160}
                startLeft={20}
                rowHeight={40}
                gridSnap={features.enableGridSnap}
                editAreaTopOffset={42}
                /**
                 * Dynamically driven by the Sidebar form
                 */
                config={cutConfig}
                onModifierChange={(held) => {
                  setIsDragDisabled(held);
                }}
                onCut={(rowId, actionId, cutTime) => {
                  setData((prev) => splitActionInRow(prev, rowId, actionId, cutTime));
                  log(`✂ Cut: ${actionId} at ${cutTime.toFixed(2)}s`);
                }}
              />
            )}
          </div>
          <div className="row-count-bar">
            {data.length} rows · {data.reduce((s, r) => s + r.actions.length, 0)} total blocks
            {features.enableCut && (
              <span style={{ color: '#ef4444', marginLeft: 10, fontWeight: 600 }}>✂ CUT MODE ACTIVE</span>
            )}
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
