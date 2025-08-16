import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  category: string;
  tags: string[];
  dueDate?: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

// Initial mock tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design user authentication flow',
    description: 'Create wireframes and prototypes for the login and signup process',
    priority: 'high',
    status: 'in-progress',
    category: 'Design',
    tags: ['UI/UX', 'Auth'],
    dueDate: '2024-01-15',
    assignee: 'Sarah Chen',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z'
  },
  {
    id: '2',
    title: 'Implement task drag and drop',
    description: 'Add drag and drop functionality for task reordering',
    priority: 'medium',
    status: 'todo',
    category: 'Development',
    tags: ['Frontend', 'React'],
    dueDate: '2024-01-18',
    createdAt: '2024-01-11T09:00:00Z',
    updatedAt: '2024-01-11T09:00:00Z'
  },
  {
    id: '3',
    title: 'Set up CI/CD pipeline',
    priority: 'high',
    status: 'completed',
    category: 'DevOps',
    tags: ['CI/CD', 'Automation'],
    dueDate: '2024-01-10',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-10T16:45:00Z'
  },
  {
    id: '4',
    title: 'Write API documentation',
    priority: 'low',
    status: 'todo',
    category: 'Documentation',
    tags: ['API', 'Docs'],
    dueDate: '2024-01-20',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z'
  }
];

// Global state
let globalTasks: Task[] = initialTasks;
let subscribers: Array<(tasks: Task[]) => void> = [];

// Subscribe to task changes
const subscribe = (callback: (tasks: Task[]) => void) => {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
};

// Notify all subscribers
const notify = () => {
  subscribers.forEach(callback => callback([...globalTasks]));
};

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>(globalTasks);

  useEffect(() => {
    const unsubscribe = subscribe(setTasks);
    return unsubscribe;
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    globalTasks = [newTask, ...globalTasks];
    notify();
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    globalTasks = globalTasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    notify();
  };

  const deleteTask = (id: string) => {
    globalTasks = globalTasks.filter(task => task.id !== id);
    notify();
  };

  const toggleTaskStatus = (id: string) => {
    const task = globalTasks.find(t => t.id === id);
    if (task) {
      const statusOrder: Task['status'][] = ['todo', 'in-progress', 'completed'];
      const currentIndex = statusOrder.indexOf(task.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      updateTask(id, { status: statusOrder[nextIndex] });
    }
  };

  const duplicateTask = (id: string) => {
    const task = globalTasks.find(t => t.id === id);
    if (task) {
      const duplicatedTask = {
        ...task,
        title: `${task.title} (Copy)`,
        status: 'todo' as const
      };
      delete (duplicatedTask as any).id;
      delete (duplicatedTask as any).createdAt;
      delete (duplicatedTask as any).updatedAt;
      
      return addTask(duplicatedTask);
    }
  };

  const setTaskPriority = (id: string, priority: Task['priority']) => {
    updateTask(id, { priority });
  };

  const archiveTask = (id: string) => {
    // For now, just delete the task. In a real app, you'd move it to archived state
    deleteTask(id);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    duplicateTask,
    setTaskPriority,
    archiveTask
  };
};
