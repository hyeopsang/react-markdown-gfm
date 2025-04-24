import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { getAssignees } from '@/api/fetchIssue';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface SelectAssigneesProps {
  onChange: (assignees: string[]) => void;
}

export const SelectAssignees = ({ onChange }: SelectAssigneesProps) => {
  const [assignees, setAssignees] = useState<
    { login: string; avatar_url: string }[]
  >([]);
  const [selected, setSelected] = useState<string[]>([]);

  const fetchAssignees = useCallback(async () => {
    try {
      const response = await getAssignees();
      setAssignees(response.data);
    } catch (error) {
      console.error('assignees 어딨누:', error);
    }
  }, []);

  useEffect(() => {
    fetchAssignees();
  }, [fetchAssignees]);

  const toggleAssignee = (login: string) => {
    const updated = selected.includes(login)
      ? selected.filter((a) => a !== login)
      : [...selected, login];

    setSelected(updated);
    onChange(updated);
  };

  const removeAssignee = (login: string) => {
    const updated = selected.filter((a) => a !== login);
    setSelected(updated);
    onChange(updated);
  };

  return (
    <div className="w-[200px] space-y-2">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          {assignees.map(({ login, avatar_url }) => (
            <SelectItem
              value={login}
              key={login}
              onClick={() => toggleAssignee(login)}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={avatar_url} alt={login} />
                  <AvatarFallback>{login[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{login}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        {selected.map((login) => (
          <Badge
            key={login}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm"
          >
            {login}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeAssignee(login)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
