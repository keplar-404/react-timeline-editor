import { useLang } from 'rspress/runtime';

export const TimelineState = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Description</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>target</td>
          <td>DOM node that timeline belongs to</td>
          <td>
            <code>HTMLElement</code>
          </td>
        </tr>
        <tr>
          <td>listener</td>
          <td>Running listener</td>
          <td>
            <code>Emitter</code>
          </td>
        </tr>
        <tr>
          <td>isPlaying</td>
          <td>Whether it is playing</td>
          <td>
            <code>boolean</code>
          </td>
        </tr>
        <tr>
          <td>isPaused</td>
          <td>Whether it is paused</td>
          <td>
            <code>boolean</code>
          </td>
        </tr>
        <tr>
          <td>setTime</td>
          <td>Set current playback time</td>
          <td>
            <code>(time: number) =&gt; void</code>
          </td>
        </tr>
        <tr>
          <td>getTime</td>
          <td>Get current playback time</td>
          <td>
            <code>() =&gt; number</code>
          </td>
        </tr>
        <tr>
          <td>setPlayRate</td>
          <td>Set playback rate</td>
          <td>
            <code>(rate: number) =&gt; void</code>
          </td>
        </tr>
        <tr>
          <td>getPlayRate</td>
          <td>Get playback rate</td>
          <td>
            <code>() =&gt; number</code>
          </td>
        </tr>
        <tr>
          <td>reRender</td>
          <td>Re-render current time</td>
          <td>
            <code>() =&gt; void</code>
          </td>
        </tr>
        <tr>
          <td>play</td>
          <td>Run</td>
          <td>
            <code>
              (param: {'{'} toTime?: number; autoEnd?: boolean; {'}'}) =&gt; boolean
            </code>
          </td>
        </tr>
        <tr>
          <td>pause</td>
          <td>Pause</td>
          <td>
            <code>() =&gt; void</code>
          </td>
        </tr>
        <tr>
          <td>setScrollLeft</td>
          <td>Set scrollLeft</td>
          <td>
            <code>(val: number) =&gt; void</code>
          </td>
        </tr>
        <tr>
          <td>setScrollTop</td>
          <td>Set scrollTop</td>
          <td>
            <code>(val: number) =&gt; void</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
