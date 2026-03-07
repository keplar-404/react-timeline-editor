import Theme from 'rspress/theme';
import { AfterHero } from './AfterHero';

// Show all Props below
const Layout = () => (
  <Theme.Layout
    /* After Hero section on Home page */
    afterHero={<AfterHero />}
  />
);

export default {
  ...Theme,
  Layout,
};

export * from 'rspress/theme';
