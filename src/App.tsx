import '@/App.css';

import { IssueEditor } from './issue-editor/IssueEditor';
import IssueList from './issue-list/IssueList';
export function App() {
  return (
    <>
      <IssueEditor />
      <IssueList />
    </>
  );
}
