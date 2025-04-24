import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { getLabels } from '@/api/fetchIssue';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface SelectLabelsProps {
  onChange: (labels: string[]) => void;
}

export const SelectLabels = ({ onChange }: SelectLabelsProps) => {
  const [labels, setLabels] = useState<
    { name: string; id: number; color: string }[]
  >([]);
  const [selected, setSelected] = useState<string[]>([]);

  const fetchLabels = useCallback(async () => {
    try {
      const response = await getLabels();
      setLabels(response.data);
    } catch (error) {
      console.error('error', error);
    }
  }, []);

  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  const toggleLabel = (label: string) => {
    const updated = selected.includes(label)
      ? selected.filter((l) => l !== label)
      : [...selected, label];

    setSelected(updated);
    onChange(updated);
  };

  const removeLabel = (label: string) => {
    const updated = selected.filter((l) => l !== label);
    setSelected(updated);
    onChange(updated);
  };

  return (
    <div className="w-[200px] space-y-2">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Label" />
        </SelectTrigger>
        <SelectContent>
          {labels.map(({ name, id, color }) => (
            <SelectItem
              key={id}
              onClick={() => toggleLabel(name)}
              value={name}
              style={{
                backgroundColor: selected.includes(name)
                  ? `#${color}`
                  : 'transparent',
                color: selected.includes(name) ? '#fff' : '#000',
              }}
              className="rounded-none"
            >
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2">
        {selected.map((label) => (
          <Badge
            key={label}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm"
          >
            {label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeLabel(label)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
