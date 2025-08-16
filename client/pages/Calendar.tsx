import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { TaskCreationModal } from '../components/TaskCreationModal';
import { useTaskStore, Task } from '../hooks/useTaskStore';
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'task' | 'meeting' | 'deadline';
  priority?: 'low' | 'medium' | 'high';
}

const mockEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Team Standup',
    date: '2024-01-15',
    time: '09:00',
    type: 'meeting'
  },
  {
    id: 'e2',
    title: 'Project Review',
    date: '2024-01-16',
    time: '14:00',
    type: 'meeting'
  },
  {
    id: 'e3',
    title: 'Client Presentation',
    date: '2024-01-20',
    time: '10:00',
    type: 'deadline',
    priority: 'high'
  }
];

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export default function Calendar() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [events] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleTaskCreate = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
  };

  // Get tasks and events for selected date
  const selectedDateItems = [
    ...tasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate)),
    ...events.filter(event => isSameDay(parseISO(event.date), selectedDate))
  ];

  // Get dates that have tasks or events
  const datesWithItems = [
    ...tasks.filter(task => task.dueDate).map(task => parseISO(task.dueDate!)),
    ...events.map(event => parseISO(event.date))
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">View and manage your tasks and events in calendar format.</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Click on a date to view tasks and events for that day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border w-full"
                modifiers={{
                  hasItems: datesWithItems
                }}
                modifiersStyles={{
                  hasItems: { 
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '6px'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                {selectedDateItems.length === 0 ? 'No items scheduled' : `${selectedDateItems.length} item(s) scheduled`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedDateItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks or events for this date</p>
                  </div>
                ) : (
                  selectedDateItems.map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      {'dueDate' in item ? (
                        // Task
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge variant="outline" className={priorityColors[item.priority]}>
                              {item.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            Task Due
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            {item.category}
                          </Badge>
                        </div>
                      ) : (
                        // Event
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{item.title}</h4>
                            {item.priority && (
                              <Badge variant="outline" className={priorityColors[item.priority]}>
                                {item.priority}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.time}
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            {item.type}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks & Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming This Week</CardTitle>
            <CardDescription>
              Tasks and events scheduled for the next 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.filter(task => task.dueDate).slice(0, 3).map((task) => (
                <div key={task.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant="outline" className={priorityColors[task.priority]}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {task.dueDate}
                  </div>
                </div>
              ))}
              
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant="secondary">
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {format(parseISO(event.date), 'MMM d')} at {event.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
