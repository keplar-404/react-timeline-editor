import { useLang } from 'rspress/runtime';

export const TimelineAction = () => {
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
          <td>Action ID</td>
          <td>
            <code>string</code>
          </td>
          <td>
            <code>(Required)</code>
          </td>
        </tr>
        <tr>
          <td>start</td>
          <td>Action start time</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>(Required)</code>
          </td>
        </tr>
        <tr>
          <td>end</td>
          <td>Action end time</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>(Required)</code>
          </td>
        </tr>
        <tr>
          <td>effectId</td>
          <td>Effect ID index corresponding to the action</td>
          <td>
            <code>string</code>
          </td>
          <td>
            <code>(Required)</code>
          </td>
        </tr>
        <tr>
          <td>selected</td>
          <td>Whether the action is selected</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
        <tr>
          <td>flexible</td>
          <td>Whether the action can be resized</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>true</code>
          </td>
        </tr>
        <tr>
          <td>movable</td>
          <td>Whether the action can be moved</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>true</code>
          </td>
        </tr>
        <tr>
          <td>disable</td>
          <td>Disable action running</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
        <tr>
          <td>minStart</td>
          <td>Minimum start time limit for action</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>0</code>
          </td>
        </tr>
        <tr>
          <td>maxEnd</td>
          <td>Maximum end time limit for action</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>Number.MAX_VALUE</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
