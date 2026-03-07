import { useLang } from 'rspress/runtime';
import { Tag } from 'antd';

export const Props = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Description</th>
          <th>Type</th>
          <th style={{ minWidth: 100 }}>Default</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>scrollTop</td>
          <td>
            Scroll distance from the top of the editing area (
            <Tag color="error">@deprecated</Tag> Please use ref.setScrollTop instead)
          </td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onScroll</td>
          <td>Editing area scroll callback (used to control synchronization with editing line scrolling)</td>
          <td>
            <code>(params: OnScrollParams) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>autoScroll</td>
          <td>Whether to enable auto-scroll during dragging</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
        <tr>
          <td>dragLine</td>
          <td>Whether to display the auxiliary drag line</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>true</code>
          </td>
        </tr>
        <tr>
          <td>onScrollEnd</td>
          <td>Scroll end callback</td>
          <td>
            <code>(params: OnScrollParams) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onCursorDragStart</td>
          <td>Cursor drag start callback</td>
          <td>
            <code>(time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onCursorDrag</td>
          <td>Cursor dragging callback</td>
          <td>
            <code>(time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onCursorDragEnd</td>
          <td>Cursor drag end callback</td>
          <td>
            <code>(time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onAreaClick</td>
          <td>Blank area click callback</td>
          <td>
            <code>(e: React.MouseEvent, time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onAreaContextmenu</td>
          <td>Blank area right-click callback</td>
          <td>
            <code>(e: React.MouseEvent, time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onAreaDragStart</td>
          <td>Blank area drag start callback</td>
          <td>
            <code>(e: React.MouseEvent, time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onAreaDrag</td>
          <td>Blank area dragging callback</td>
          <td>
            <code>(e: React.MouseEvent, time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onAreaDragEnd</td>
          <td>Blank area drag end callback</td>
          <td>
            <code>(e: React.MouseEvent, time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>grid</td>
          <td>Whether to display the grid</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
        <tr>
          <td>snapGrid</td>
          <td>Whether to enable grid snapping</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
        <tr>
          <td>snapCursor</td>
          <td>Whether to enable cursor snapping</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
        <tr>
          <td>onActionClick</td>
          <td>Action click callback</td>
          <td>
            <code>(e: React.MouseEvent, action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionContextmenu</td>
          <td>Action right-click callback</td>
          <td>
            <code>(e: React.MouseEvent, action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionResizingStart</td>
          <td>Action resizing start callback</td>
          <td>
            <code>(action: TimelineAction, dir: 'left' | 'right') =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionResizing</td>
          <td>Action resizing callback</td>
          <td>
            <code>(action: TimelineAction, dir: 'left' | 'right') =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionResizingEnd</td>
          <td>Action resizing end callback</td>
          <td>
            <code>(action: TimelineAction, dir: 'left' | 'right') =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionMovingStart</td>
          <td>Action moving start callback</td>
          <td>
            <code>(action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionMoving</td>
          <td>Action moving callback</td>
          <td>
            <code>(action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionMovingEnd</td>
          <td>Action moving end callback</td>
          <td>
            <code>(action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionChange</td>
          <td>Action content change callback (triggers when dragging ends, for data updates)</td>
          <td>
            <code>(action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onActionRemove</td>
          <td>Action removal callback</td>
          <td>
            <code>(action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>getEffectId</td>
          <td>Function to get effect ID (optional, default uses effect.id)</td>
          <td>
            <code>(effect: TimelineEffect) =&gt; string</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>getActionId</td>
          <td>Function to get action ID (optional, default uses action.id)</td>
          <td>
            <code>(action: TimelineAction) =&gt; string</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>labels</td>
          <td>UI labels for internationalization</td>
          <td>
            <code>TimelineLabels</code>
          </td>
          <td>
            English labels
          </td>
        </tr>
        <tr>
          <td>style</td>
          <td>Component inline style</td>
          <td>
            <code>React.CSSProperties</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>effects</td>
          <td>Timeline effects definition</td>
          <td>
            <code>Record&lt;string, TimelineEffect&gt;</code>
          </td>
          <td>
            <code>{}</code>
          </td>
        </tr>
        <tr>
          <td>data</td>
          <td>Timeline data</td>
          <td>
            <code>TimelineRow[]</code>
          </td>
          <td>
            <code>[]</code>
          </td>
        </tr>
        <tr>
          <td>scale</td>
          <td>Timeline scale (pixels per second)</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>1</code>
          </td>
        </tr>
        <tr>
          <td>scaleWidth</td>
          <td>Timeline scale width (pixels)</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>160</code>
          </td>
        </tr>
        <tr>
          <td>startLeft</td>
          <td>Initial scroll position from left</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>20</code>
          </td>
        </tr>
        <tr>
          <td>minScaleCounts</td>
          <td>Minimum scale segments to display</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>10</code>
          </td>
        </tr>
        <tr>
          <td>maxScaleCounts</td>
          <td>Maximum scale segments to display</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>Infinity</code>
          </td>
        </tr>
        <tr>
          <td>onClickAction</td>
          <td>Triggered when an action is clicked</td>
          <td>
            <code>(action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onDoubleClickAction</td>
          <td>Triggered when an action is double-clicked</td>
          <td>
            <code>(action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onContextMenuAction</td>
          <td>Triggered when an action is right-clicked</td>
          <td>
            <code>(action: TimelineAction) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onCursorChange</td>
          <td>Triggered when the cursor position changes</td>
          <td>
            <code>(time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onScaleChange</td>
          <td>Triggered when the scale changes</td>
          <td>
            <code>(scale: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>onDragLineChange</td>
          <td>Triggered when the drag line position changes</td>
          <td>
            <code>(time: number) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>headerHeight</td>
          <td>Timeline header height</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>40</code>
          </td>
        </tr>
        <tr>
          <td>rowHeight</td>
          <td>Timeline row height</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>32</code>
          </td>
        </tr>
        <tr>
          <td>hideCursor</td>
          <td>Whether to hide the cursor</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
        <tr>
          <td>disableDrag</td>
          <td>Whether to disable all dragging</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
