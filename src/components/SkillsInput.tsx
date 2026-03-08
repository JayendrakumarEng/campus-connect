import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const SkillsInput = ({ skills, onChange }: SkillsInputProps) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!skills.includes(input.trim())) {
        onChange([...skills, input.trim()]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  };

  const remove = (skill: string) => onChange(skills.filter(s => s !== skill));

  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border bg-background p-2 focus-within:ring-2 focus-within:ring-ring">
      {skills.map(skill => (
        <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {skill}
          <button type="button" onClick={() => remove(skill)} className="hover:text-destructive">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={skills.length === 0 ? "Type a skill and press Enter" : "Add more..."}
        className="min-w-[120px] flex-1 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
      />
    </div>
  );
};

export default SkillsInput;
