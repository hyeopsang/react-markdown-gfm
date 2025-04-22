import { useCallback, useEffect } from 'react';

import { getIssue } from '@/api/fetchIssue';
export default function IssueList() {
  const fetchIssues = useCallback(async () => {
    const response = await getIssue();
    const issues = response.data;
    console.log('이슈', issues);
  }, []);
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);
  return (
    <div>
      <button onClick={fetchIssues}>Fetch Issues</button>
    </div>
  );
}
