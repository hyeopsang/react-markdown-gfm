import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GIT_AUTH_KEY,
});

export const getIssue = () => {
  return octokit.request('GET /repos/hyeopsang/react-markdown-gfm/issues', {
    owner: 'hyeopsang',
    repo: 'react-markdown-gfm',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
};

interface IssueContent {
  title: string;
  body: string;
  assignees: string[];
  labels: string[];
}
export const createIssue = (issuesContent: IssueContent) => {
  return octokit.request('POST /repos/hyeopsang/react-markdown-gfm/issues', {
    owner: 'hyeopsang',
    repo: 'react-markdown-gfm',
    title: issuesContent.title,
    body: issuesContent.body,
    assignees: ['hyeopsang'],
    labels: ['bug'],
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
};
export const getAssignees = () => {
  return octokit.request('GET /repos/{owner}/{repo}/assignees', {
    owner: 'hyeopsang',
    repo: 'react-markdown-gfm',
  });
};
export const getLabels = () => {
  return octokit.request('GET /repos/{owner}/{repo}/labels', {
    owner: 'hyeopsang',
    repo: 'react-markdown-gfm',
  });
};
