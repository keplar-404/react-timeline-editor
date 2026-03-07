import { useLang } from 'rspress/runtime';

export const TimelineEffect = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Description</th>
          <th>Type</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>id</td>
          <td>Effect ID</td>
          <td>
            <code>string</code>
          </td>
          <td>
            <code>(Required)</code>
          </td>
        </tr>
        <tr>
          <td>name</td>
          <td>Effect name</td>
          <td>
            <code>string</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>source</td>
          <td>Effect running code</td>
          <td>
            <code>
              TimeLineEffectSource
            </code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const TimeLineEffectSource = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Description</th>
          <th>Type</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>start</td>
          <td>Callback when starting to play in the current action time area</td>
          <td>
            <code>
              (param: EffectSourceParam) =&gt; void
            </code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>enter</td>
          <td>Execute callback when time enters the action</td>
          <td>
            <code>
              (param: EffectSourceParam) =&gt; void
            </code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>update</td>
          <td>Callback when action updates</td>
          <td>
            <code>(param: EffectSourceParam) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>leave</td>
          <td>Execute callback when time leaves the action</td>
          <td>
            <code>(param: EffectSourceParam) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>stop</td>
          <td>Callback when stopping play in the current action time area</td>
          <td>
            <code>(param: EffectSourceParam) =&gt; void</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const EffectSourceParam = () => {
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
          <td>time</td>
          <td>Current play time</td>
          <td>
            <code>number</code>
          </td>
        </tr>
        <tr>
          <td>isPlaying</td>
          <td>Is playing</td>
          <td>
            <code>boolean</code>
          </td>
        </tr>
        <tr>
          <td>action</td>
          <td>Action</td>
          <td>
            <code>
              TimelineAction
            </code>
          </td>
        </tr>
        <tr>
          <td>effect</td>
          <td>Action effect</td>  
          <td>
            <code>
              TimelineEffect
            </code>
          </td>
        </tr>
        <tr>
          <td>engine</td>
          <td>Engine</td>
          <td>
            <code>TimelineEngine</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
