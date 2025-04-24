import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardFooter } from '@/shared/components/ui/card';

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  state: string;
  html_url: string;
  number: number;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  assignee: { login: string; avatar_url: string };
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
}

export function IssueCard({ issue }: { issue: GitHubIssue }) {
  return (
    <Card className="rounded-none border-none px-4 py-0 shadow-none">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex gap-3">
            <div>
              <div className="justify-left flex items-center gap-2">
                <h2 className="text-base font-bold font-semibold">
                  {issue.title}
                </h2>
              </div>
              <p className="pt-3 text-left text-xs font-normal text-[#939393]">
                {issue.created_at}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ReactMarkdown
              children={issue.body}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypePrism]}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <CardFooter className="flex flex-wrap gap-2.5 p-0.5 pb-6">
        <div className="flex w-full items-center justify-between">
          <Avatar className="h-5 w-5">
            <AvatarImage
              src={issue.assignee.avatar_url}
              alt={issue.assignee.login}
            />
            <AvatarFallback>{issue.assignee.login}</AvatarFallback>
          </Avatar>
          <img src="/github.png" className="h-5 w-5" />
        </div>

        <div className="mt-2 flex w-full flex-wrap gap-1">
          {issue.labels.map((label, i) => (
            <Badge
              key={i}
              variant="secondary"
              style={{ backgroundColor: label.color }}
              className={`text-xs`}
            >
              {label.name}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
