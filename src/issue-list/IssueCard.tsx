import { Clock, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';

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
    <Card>
      <CardHeader className="p-3 pb-0">
        <div className="flex flex-col items-center justify-center">
          <span className="text-muted-foreground text-sm">{issue.number}</span>
          <h2 className="font-semibold">{issue.title}</h2>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <ReactMarkdown
          children={issue.body}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypePrism]}
        />
        <div className="mt-2 flex flex-wrap gap-1">
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
      </CardContent>
      <CardFooter className="flex items-center justify-between p-3 pt-0">
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="h-3.5 w-3.5" />
          {issue.created_at}
        </div>
        {issue.assignee ? (
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={issue.assignee.avatar_url}
              alt={issue.assignee.login}
            />
            <AvatarFallback>{issue.assignee.login}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              <User className="h-3.5 w-3.5" />
            </AvatarFallback>
          </Avatar>
        )}
      </CardFooter>
    </Card>
  );
}
