import { Timeline } from '@keplar-404/react-timeline-editor';
import { Switch } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import './index.css';
import { mockData, mockEffect } from './mock';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);
  const [autoScroll, setAutoScroll] = useState(true);

  return (
    <div className="timeline-editor-example9">
      <Switch
        checkedChildren="Enable Auto Scroll"
        unCheckedChildren="Disable Auto Scroll"
        checked={autoScroll}
        onChange={(e) => setAutoScroll(e)}
        style={{ marginBottom: 20 }}
      />
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        autoScroll={autoScroll}
      />
    </div>
  );
};

export default TimelineEditor;
