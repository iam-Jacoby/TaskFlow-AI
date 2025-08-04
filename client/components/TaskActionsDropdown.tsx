import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { 
  MoreHorizontal,
  Edit,
  Copy,
  Archive,
  Trash2,
  Flag,
  Calendar,
  User
} from 'lucide-react';

interface TaskActionsDropdownProps {
  taskId: string;
  onEdit?: (taskId: string) => void;
  onDuplicate?: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onSetPriority?: (taskId: string, priority: 'low' | 'medium' | 'high') => void;
}

export function TaskActionsDropdown({ 
  taskId, 
  onEdit, 
  onDuplicate, 
  onArchive, 
  onDelete,
  onSetPriority 
}: TaskActionsDropdownProps) {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit?.(taskId)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Task
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onDuplicate?.(taskId)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onSetPriority?.(taskId, 'high')}>
          <Flag className="mr-2 h-4 w-4 text-red-500" />
          Set High Priority
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onSetPriority?.(taskId, 'medium')}>
          <Flag className="mr-2 h-4 w-4 text-yellow-500" />
          Set Medium Priority
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onSetPriority?.(taskId, 'low')}>
          <Flag className="mr-2 h-4 w-4 text-blue-500" />
          Set Low Priority
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <Calendar className="mr-2 h-4 w-4" />
          Change Due Date
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Assign to...
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onArchive?.(taskId)}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600"
          onClick={() => onDelete?.(taskId)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
