import { createBrowserRouter } from 'react-router';

import { App } from './App';
import { IssueEditor } from './issue-editor/IssueEditor';

export const Routes = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/issue-form',
    Component: IssueEditor,
  },
]);
