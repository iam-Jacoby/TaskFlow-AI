import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { TaskCreationModal } from '../components/TaskCreationModal';
import { TaskActionsDropdown } from '../components/TaskActionsDropdown';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Flag,
  User,
  Clock,
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  category: string;
  tags: string[];
  dueDate?: string;
  assignee?: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user authentication flow',
    description: 'Create wireframes and prototypes for the login and signup process',
    priority: 'high',
    status: 'in-progress',
    category: 'Design',
    tags: ['UI/UX', 'Auth'],
    dueDate: '2024-01-15',
    assignee: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'Implement task drag and drop',
    description: 'Add drag and drop functionality for task reordering',
    priority: 'medium',
    status: 'todo',
    category: 'Development',
    tags: ['Frontend', 'React'],
    dueDate: '2024-01-18'
  },
  {
    id: '3',
    title: 'Set up CI/CD pipeline',
    priority: 'high',
    status: 'completed',
    category: 'DevOps',
    tags: ['CI/CD', 'Automation'],
    dueDate: '2024-01-10'
  },
  {
    id: '4',
    title: 'Write API documentation',
    priority: 'low',
    status: 'todo',
    category: 'Documentation',
    tags: ['API', 'Docs'],
    dueDate: '2024-01-20'
  }
];

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const statusIcons = {
  todo: Circle,
  'in-progress': Clock,
  completed: CheckCircle2
};

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const statusOrder = ['todo', 'in-progress', 'completed'] as const;
        const currentIndex = statusOrder.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...task, status: statusOrder[nextIndex] };
      }
      return task;
    }));
  };

  const handleTaskCreate = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back! 👋</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your tasks today.</p>
          </div>
          <TaskCreationModal
            onTaskCreate={handleTaskCreate}
            trigger={
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground sm:w-auto w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            }
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+1</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(task => task.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">Active</span> tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              AI Suggestions
            </CardTitle>
            <CardDescription>
              Based on your patterns, here are some recommendations to boost your productivity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium">Schedule focus time</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Block 2 hours tomorrow morning for deep work on design tasks
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium">Break down large tasks</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider splitting "Design user authentication flow" into smaller subtasks
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium">Set reminders</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  3 tasks are due this week - would you like me to create calendar reminders?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Your latest tasks and their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => {
                const StatusIcon = statusIcons[task.status];
                
                return (
                  <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleTaskStatus(task.id)}
                    >
                      <StatusIcon className={`w-4 h-4 ${
                        task.status === 'completed' ? 'text-green-600' : 
                        task.status === 'in-progress' ? 'text-blue-600' : 
                        'text-muted-foreground'
                      }`} />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge variant="outline" className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {task.dueDate}
                        </span>
                        {task.assignee && (
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {task.assignee}
                          </span>
                        )}
                        <div className="flex gap-1">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
