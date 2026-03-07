import { useLang } from 'rspress/runtime';

export const TimelineRow = () => {
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
          <td>Action row ID</td>
          <td>
            <code>string</code>
          </td>
          <td>
            <code>(Required)</code>
          </td>
        </tr>
        <tr>
          <td>actions</td>
          <td>Action list of the row</td>
          <td>
            <code>TimelineAction[]</code>
          </td>
          <td>
            <code>(Required)</code>
          </td>
        </tr>
        <tr>
          <td>rowHeight</td>
          <td>Custom row height (determined by rowHeight in props by default)</td>
          <td>
            <code>number</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
        <tr>
          <td>selected</td>
          <td>Whether the row is selected</td>
          <td>
            <code>boolean</code>
          </td>
          <td>
            <code>false</code>
          </td>
        </tr>
        <tr>
          <td>classNames</td>
          <td>Extended class name of the row</td>
          <td>
            <code>string[]</code>
          </td>
          <td>
            <code>--</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
