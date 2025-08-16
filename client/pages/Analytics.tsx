import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useTaskStore } from '../hooks/useTaskStore';
import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  CheckCircle2,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';

const productivityData = [
  { day: 'Mon', completed: 8, total: 12 },
  { day: 'Tue', completed: 6, total: 10 },
  { day: 'Wed', completed: 12, total: 15 },
  { day: 'Thu', completed: 9, total: 11 },
  { day: 'Fri', completed: 15, total: 18 },
  { day: 'Sat', completed: 4, total: 6 },
  { day: 'Sun', completed: 2, total: 3 }
];

const categoryData = [
  { category: 'Development', tasks: 25, completed: 18, color: 'bg-blue-500' },
  { category: 'Design', tasks: 15, completed: 12, color: 'bg-purple-500' },
  { category: 'Marketing', tasks: 8, completed: 6, color: 'bg-green-500' },
  { category: 'Testing', tasks: 12, completed: 8, color: 'bg-yellow-500' },
  { category: 'Documentation', tasks: 6, completed: 5, color: 'bg-red-500' }
];

export default function Analytics() {
  const { tasks } = useTaskStore();

  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate category breakdown
    const categoryBreakdown = tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { total: 0, completed: 0 };
      }
      acc[task.category].total++;
      if (task.status === 'completed') {
        acc[task.category].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    const categoryData = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      tasks: data.total,
      completed: data.completed,
      color: getCategoryColor(category)
    }));

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
      categoryData,
      avgTasksPerDay: Math.round(totalTasks / 7),
      avgCompletedPerDay: Math.round(completedTasks / 7)
    };
  }, [tasks]);

  function getCategoryColor(category: string) {
    const colors = {
      'Development': 'bg-blue-500',
      'Design': 'bg-purple-500',
      'Marketing': 'bg-green-500',
      'Testing': 'bg-yellow-500',
      'Documentation': 'bg-red-500',
      'DevOps': 'bg-orange-500',
      'Backend': 'bg-indigo-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights into your productivity and task completion patterns.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </span>
                from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8%
                </span>
                from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completionRate}%</div>
              <Progress value={analytics.completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">
                Currently active tasks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Productivity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Productivity</CardTitle>
            <CardDescription>
              Task completion over the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productivityData.map((day) => {
                const percentage = Math.round((day.completed / day.total) * 100);
                
                return (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">
                          {day.completed}/{day.total} tasks
                        </span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
            <CardDescription>
              Breakdown of tasks and completion rates by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => {
                const percentage = Math.round((category.completed / category.tasks) * 100);
                
                return (
                  <div key={category.category} className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded ${category.color}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{category.category}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.completed}/{category.tasks}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>
                AI-powered recommendations based on your patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Peak Productivity Day</p>
                    <p className="text-xs text-muted-foreground">Friday shows highest completion rates (83%)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Focus Area</p>
                    <p className="text-xs text-muted-foreground">Testing tasks have lower completion rates</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Trend Analysis</p>
                    <p className="text-xs text-muted-foreground">12% improvement in task completion this week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>
                Milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Consistency Streak</p>
                    <p className="text-xs text-muted-foreground">7 days of meeting daily goals</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Milestone Reached</p>
                    <p className="text-xs text-muted-foreground">Completed 50 tasks this month</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Time Efficiency</p>
                    <p className="text-xs text-muted-foreground">Average task completion improved by 15%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
