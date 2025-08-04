import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { 
  Plus,
  Users,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  UserPlus,
  MessageSquare,
  Activity
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  tasksCompleted: number;
  tasksTotal: number;
  joinDate: string;
}

interface TeamActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'completed' | 'assigned' | 'commented' | 'updated';
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@taskflow.ai',
    role: 'Product Designer',
    status: 'online',
    tasksCompleted: 24,
    tasksTotal: 28,
    joinDate: '2023-08-15'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael@taskflow.ai',
    role: 'Frontend Developer',
    status: 'online',
    tasksCompleted: 18,
    tasksTotal: 22,
    joinDate: '2023-09-01'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily@taskflow.ai',
    role: 'Backend Developer',
    status: 'away',
    tasksCompleted: 15,
    tasksTotal: 20,
    joinDate: '2023-07-20'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@taskflow.ai',
    role: 'QA Engineer',
    status: 'offline',
    tasksCompleted: 12,
    tasksTotal: 16,
    joinDate: '2023-10-05'
  }
];

const recentActivity: TeamActivity[] = [
  {
    id: '1',
    user: 'Sarah Chen',
    action: 'completed',
    target: 'User authentication wireframes',
    time: '2 hours ago',
    type: 'completed'
  },
  {
    id: '2',
    user: 'Michael Rodriguez',
    action: 'commented on',
    target: 'React component refactoring',
    time: '4 hours ago',
    type: 'commented'
  },
  {
    id: '3',
    user: 'Emily Johnson',
    action: 'was assigned',
    target: 'Database optimization task',
    time: '6 hours ago',
    type: 'assigned'
  },
  {
    id: '4',
    user: 'David Kim',
    action: 'updated',
    target: 'Test automation suite',
    time: '1 day ago',
    type: 'updated'
  }
];

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400'
};

const activityIcons = {
  completed: CheckCircle2,
  assigned: UserPlus,
  commented: MessageSquare,
  updated: Activity
};

const activityColors = {
  completed: 'text-green-600',
  assigned: 'text-blue-600',
  commented: 'text-purple-600',
  updated: 'text-orange-600'
};

export default function Team() {
  const totalTeamTasks = teamMembers.reduce((sum, member) => sum + member.tasksTotal, 0);
  const totalCompletedTasks = teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0);
  const teamCompletionRate = Math.round((totalCompletedTasks / totalTeamTasks) * 100);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team</h1>
            <p className="text-muted-foreground mt-1">Collaborate with your team members and track progress together.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground sm:w-auto w-full">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                {teamMembers.filter(m => m.status === 'online').length} online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompletedTasks}/{totalTeamTasks}</div>
              <p className="text-xs text-muted-foreground">
                Completed tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Progress</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamCompletionRate}%</div>
              <Progress value={teamCompletionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage team members and track their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => {
                const completionRate = Math.round((member.tasksCompleted / member.tasksTotal) * 100);
                
                return (
                  <div key={member.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusColors[member.status]}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{member.tasksCompleted}/{member.tasksTotal} tasks</span>
                          <span>{completionRate}% completed</span>
                          <span className="capitalize">{member.status}</span>
                        </div>
                      </div>
                      
                      <Progress value={completionRate} className="mt-2 h-1" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest team actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activityIcons[activity.type];
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${activityColors[activity.type]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collaboration Tools</CardTitle>
              <CardDescription>
                Quick access to team features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Team Chat
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Create Team Project
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  View Team Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
