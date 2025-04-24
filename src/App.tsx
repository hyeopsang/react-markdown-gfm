import '@/App.css';

import { Link } from 'react-router';

import { IssueList } from './issue-list/IssueList';
export function App() {
  return (
    <div className="h-full w-full">
      <IssueList />
      <Link className="text-5xl text-black" to={'/issue-form'}>
        이슈 작성하기
      </Link>
    </div>
  );
}
