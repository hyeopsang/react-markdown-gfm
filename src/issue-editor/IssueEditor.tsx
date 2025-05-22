import 'github-markdown-css/github-markdown-light.css';

import { X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { createIssue } from '@/api/fetchIssue';

import { SelectAssignees } from './selectAssignees';
import { SelectLabels } from './SelectLabels';
interface IssueContent {
  title: string;
  body: string;
  assignees: string[];
  labels: string[];
}

interface IssueEditorProps {
  onClose: () => void;
}
export function IssueEditor({ onClose }: IssueEditorProps) {
  const [issue, setIssue] = useState<IssueContent>({
    title: '',
    body: '',
    assignees: [],
    labels: [],
  });
  const IssueCreate = useCallback(async (issue: IssueContent) => {
    const responser = await createIssue(issue);
    onClose();
    console.log('이슈 생성', responser);
  }, []);
  console.log(issue);
  return createPortal(
    <div className="pointer-events-auto flex w-[1000px] flex-col gap-3 rounded-xs bg-white p-4 shadow-xl">
      <X onClick={onClose} className="ml-auto" />
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col overflow-auto bg-white md:w-1/2">
          <input
            className="mb-2 rounded border p-2"
            placeholder="title"
            value={issue.title}
            onChange={(e) => setIssue({ ...issue, title: e.target.value })}
          />
          <textarea
            className="h-83.5 w-full rounded-xs border p-3 font-mono text-sm"
            value={issue.body}
            onChange={(e) => setIssue({ ...issue, body: e.target.value })}
            placeholder="이슈를 작성해주세요."
          />
        </div>
        <div className="markdown-body h-96 w-full overflow-auto rounded border bg-white p-4 md:w-1/2">
          <h2>{issue.title}</h2>
          <ReactMarkdown
            children={issue.body}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypePrism]}
          />
        </div>
      </div>
      <div className="mr-auto flex flex-col items-center gap-3 pt-3">
        <SelectLabels
          onChange={(labels) => setIssue((prev) => ({ ...prev, labels }))}
        />

        <SelectAssignees
          onChange={(assignees) => setIssue((prev) => ({ ...prev, assignees }))}
        />
      </div>

      <div className="mt-4 flex w-full justify-center">
        <button
          className="rounded bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          onClick={() => IssueCreate(issue)}
        >
          이슈 생성
        </button>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
}
