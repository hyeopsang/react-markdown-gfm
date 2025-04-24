import 'github-markdown-css/github-markdown-light.css';

import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { createIssue } from '@/api/fetchIssue';
interface IssueContent {
  title: string;
  body: string;
}

interface IssueEditorProps {
  onClose: () => void;
}
export function IssueEditor({ onClose }: IssueEditorProps) {
  const [issue, setIssue] = useState<IssueContent>({
    title: '',
    body: '',
  });
  const IssueCreate = useCallback(async (issue: IssueContent) => {
    const responser = await createIssue(issue);
    console.log('이슈 생성', responser);
  }, []);

  return createPortal(
    <div className="fixed flex w-[50%] flex-col rounded-2xl bg-white p-4 shadow-xl">
      <div className="mb-4 flex w-full flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col overflow-auto bg-white p-4 md:w-1/2">
          <input
            className="mb-2 rounded border p-2"
            placeholder="title"
            value={issue.title}
            onChange={(e) => setIssue({ ...issue, title: e.target.value })}
          />
          <textarea
            className="h-96 w-full border p-3 font-mono text-sm"
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
