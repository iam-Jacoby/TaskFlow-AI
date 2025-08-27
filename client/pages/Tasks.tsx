import { useState } from "react";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TaskCreationModal } from "../components/TaskCreationModal";
import { TaskActionsDropdown } from "../components/TaskActionsDropdown";
import { useTaskStore, Task } from "../hooks/useTaskStore";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Circle,
  ArrowUpDown,
} from "lucide-react";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusIcons = {
  todo: Circle,
  "in-progress": Clock,
  completed: CheckCircle2,
};

export default function Tasks() {
  const {
    tasks,
    addTask,
    toggleTaskStatus,
    deleteTask,
    duplicateTask,
    setTaskPriority,
    archiveTask,
  } = useTaskStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleTaskCreate = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => {
    addTask(taskData);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
              Tasks
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage and organize all your tasks in one place.
            </p>
          </div>
          <TaskCreationModal
            onTaskCreate={handleTaskCreate}
            trigger={
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground sm:w-auto w-full whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            }
          />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Task List ({filteredTasks.length})
            </CardTitle>
            <CardDescription className="text-sm">
              {filteredTasks.length === 0
                ? "No tasks match your current filters."
                : "Tap on task status to update, or use the menu for more actions."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const StatusIcon = statusIcons[task.status];

                return (
                  <div
                    key={task.id}
                    className="flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 flex-shrink-0 mt-1 sm:mt-0"
                      onClick={() => toggleTaskStatus(task.id)}
                    >
                      <StatusIcon
                        className={`w-4 h-4 ${
                          task.status === "completed"
                            ? "text-green-600"
                            : task.status === "in-progress"
                              ? "text-blue-600"
                              : "text-muted-foreground"
                        }`}
                      />
                    </Button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3
                          className={`font-medium text-sm sm:text-base ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.title}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`${priorityColors[task.priority]} text-xs`}
                          >
                            {task.priority}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {task.category}
                          </Badge>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {task.dueDate && (
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {task.dueDate}
                            </span>
                          )}
                          {task.assignee && (
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-24">
                                {task.assignee}
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {task.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{task.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                      <TaskActionsDropdown
                        taskId={task.id}
                        onDelete={deleteTask}
                        onDuplicate={duplicateTask}
                        onSetPriority={setTaskPriority}
                        onArchive={archiveTask}
                      />
                    </div>
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
