import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Bug, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { getIssue } from '@/api/fetchIssue';
import { IssueEditor } from '@/issue-editor/IssueEditor';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

import { IssueCard } from './IssueCard';
// GitHub 이슈 타입 정의
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
  assignee: {
    login: string;
    avatar_url: string;
  };
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
}

// 칸반 보드 상태 타입 정의
interface KanbanBoard {
  todo: GitHubIssue[];
  inProgress: GitHubIssue[];
  done: GitHubIssue[];
  [key: string]: GitHubIssue[]; // 인덱스 시그니처 추가
}

export function IssueList() {
  const [createIssue, setCreateIssue] = useState(false);
  const [issues, setIssues] = useState<KanbanBoard>({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchIssues = useCallback(async () => {
    try {
      const response = await getIssue();
      // API 응답을 칸반 보드 형식으로 변환하는 로직이 필요할 수 있습니다
      // 예시: 이슈의 라벨이나 상태에 따라 분류
      const todoIssues: GitHubIssue[] = [];
      const inProgressIssues: GitHubIssue[] = [];
      const doneIssues: GitHubIssue[] = [];
      console.log(response.data);
      response.data.forEach((issue: GitHubIssue) => {
        // 여기서 이슈를 분류하는 로직을 구현하세요
        // 예: 라벨에 따라 분류
        if (issue.state === 'closed') {
          doneIssues.push(issue);
        } else if (issue.labels.some((label) => label.name === 'in-progress')) {
          inProgressIssues.push(issue);
        } else {
          todoIssues.push(issue);
        }
      });

      setIssues({
        todo: todoIssues,
        inProgress: inProgressIssues,
        done: doneIssues,
      });
      console.log('이슈', issues);
    } catch (error) {
      console.error('이슈 가져오기 실패:', error);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Find the issue that was dragged
    const sourceColumn = issues[source.droppableId];
    const issueToMove = sourceColumn.find(
      (issue) => issue.id.toString() === draggableId
    );

    if (!issueToMove) return; // 이슈를 찾지 못한 경우 처리

    // Create new state with the issue removed from source column
    const newSourceColumn = sourceColumn.filter(
      (issue) => issue.id.toString() !== draggableId
    );

    // Add the issue to the destination column at the correct index
    const destinationColumn = issues[destination.droppableId];
    const newDestinationColumn = [...destinationColumn];
    newDestinationColumn.splice(destination.index, 0, issueToMove);

    // Update state with new column arrangements
    setIssues({
      ...issues,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestinationColumn,
    });
  };

  // Filter issues based on search query
  const filteredIssues: KanbanBoard = {
    todo: issues.todo.filter((issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    inProgress: issues.inProgress.filter((issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    done: issues.done.filter((issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center space-x-2 md:w-auto">
          <Input
            placeholder="Search issues..."
            className="w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" onClick={() => setCreateIssue(true)}>
            <Bug className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              <SelectItem value="sarah">Sarah Chen</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
              <SelectItem value="alex">Alex Wong</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All labels</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="enhancement">Enhancement</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="mt-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* To Do Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">To Do</h3>
                  <Badge variant="outline">{filteredIssues.todo.length}</Badge>
                </div>
                <Droppable droppableId="todo">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-muted/40 min-h-[500px] rounded-lg border p-4"
                    >
                      {filteredIssues.todo.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={String(issue.id)}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                            >
                              <IssueCard issue={issue} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* In Progress Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">In Progress</h3>
                  <Badge variant="outline">
                    {filteredIssues.inProgress.length}
                  </Badge>
                </div>
                <Droppable droppableId="inProgress">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-muted/40 min-h-[500px] rounded-lg border p-4"
                    >
                      {filteredIssues.inProgress.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={String(issue.id)}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                            >
                              <IssueCard issue={issue} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Done Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Done</h3>
                  <Badge variant="outline">{filteredIssues.done.length}</Badge>
                </div>
                <Droppable droppableId="done">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-muted/40 min-h-[500px] rounded-lg border p-4"
                    >
                      {filteredIssues.done.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={String(issue.id)}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                            >
                              <IssueCard issue={issue} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        </TabsContent>
        <TabsContent value="list" className="mt-0">
          <div className="rounded-lg border">
            <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b p-4 font-medium">
              <div>#</div>
              <div>Title</div>
              <div>Assignee</div>
              <div>Labels</div>
            </div>
            {[
              ...filteredIssues.todo,
              ...filteredIssues.inProgress,
              ...filteredIssues.done,
            ].map((issue) => (
              <div
                key={issue.id}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b p-4 last:border-0"
              >
                <div className="text-muted-foreground">{issue.number}</div>
                <div>{issue.title}</div>
                <div>
                  {issue.assignees ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={issue.assignee.avatar_url}
                        alt={issue.assignee.login}
                      />
                      <AvatarFallback>{issue.assignee.login}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {issue.labels.map((label, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className={`bg-${label.color}`}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      {createIssue && <IssueEditor onClose={() => setCreateIssue(false)} />}
    </div>
  );
}
