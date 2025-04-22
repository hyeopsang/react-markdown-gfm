import 'github-markdown-css/github-markdown-light.css';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export function IssueEditor() {
  const [markdown, setMarkdown] = useState('');

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-4 md:flex-row">
      <textarea
        className="h-96 w-full border p-3 font-mono text-sm md:w-1/2"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="이슈를 작성해주세요."
      />

      <div className="markdown-body w-full overflow-auto rounded border bg-white p-4 md:w-1/2">
        <ReactMarkdown
          children={markdown}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypePrism]}
        />
      </div>
    </div>
  );
}
