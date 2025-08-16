import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Smartphone, Download, Trash2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export function ChangePasswordModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Simulate password change
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update your account password. Make sure it's strong and unique.
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-600 mb-4" />
            <p className="text-green-600 font-medium">Password changed successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Change Password
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function TwoFactorModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">SMS Authentication</h4>
              <p className="text-sm text-muted-foreground">Receive codes via text message</p>
            </div>
            <Button 
              variant={enabled ? "destructive" : "default"}
              onClick={() => setEnabled(!enabled)}
            >
              {enabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
            <div>
              <h4 className="font-medium">Authenticator App</h4>
              <p className="text-sm text-muted-foreground">Use Google Authenticator or similar</p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DataDownloadModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);

    // Generate PDF content
    setTimeout(() => {
      const profile = JSON.parse(localStorage.getItem('taskflow_user') || '{}');
      const tasks = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
      const settings = JSON.parse(localStorage.getItem('taskflow_settings') || '{}');
      const exportDate = new Date().toLocaleDateString();

      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>TaskFlow AI - Personal Data Export</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #6366f1; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #4f46e5; border-left: 4px solid #6366f1; padding-left: 15px; }
            .profile-info { background: #f8fafc; padding: 15px; border-radius: 8px; }
            .task-item { background: #fff; border: 1px solid #e2e8f0; margin: 10px 0; padding: 15px; border-radius: 8px; }
            .task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .task-title { font-weight: bold; color: #1e293b; }
            .task-status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .status-todo { background: #f1f5f9; color: #475569; }
            .status-progress { background: #dbeafe; color: #1d4ed8; }
            .status-completed { background: #dcfce7; color: #166534; }
            .priority { padding: 2px 6px; border-radius: 3px; font-size: 11px; }
            .priority-high { background: #fecaca; color: #991b1b; }
            .priority-medium { background: #fef3c7; color: #92400e; }
            .priority-low { background: #bfdbfe; color: #1e40af; }
            .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .setting-group { background: #f8fafc; padding: 12px; border-radius: 6px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #666; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f1f5f9; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 TaskFlow AI</h1>
            <p>Personal Data Export</p>
            <p>Generated on ${exportDate}</p>
          </div>

          <div class="section">
            <h2>👤 Profile Information</h2>
            <div class="profile-info">
              <table>
                <tr><th>Name</th><td>${profile.name || 'Not provided'}</td></tr>
                <tr><th>Email</th><td>${profile.email || 'Not provided'}</td></tr>
                <tr><th>Role</th><td>${profile.role || 'Not provided'}</td></tr>
                <tr><th>Plan</th><td>${profile.plan || 'Not provided'}</td></tr>
                <tr><th>Member Since</th><td>${profile.joinDate || 'Not provided'}</td></tr>
              </table>
            </div>
          </div>

          <div class="section">
            <h2>📋 Tasks Summary</h2>
            <div class="settings-grid">
              <div class="setting-group">
                <strong>Total Tasks:</strong> ${tasks.length || 0}
              </div>
              <div class="setting-group">
                <strong>Completed:</strong> ${tasks.filter(t => t.status === 'completed').length || 0}
              </div>
              <div class="setting-group">
                <strong>In Progress:</strong> ${tasks.filter(t => t.status === 'in-progress').length || 0}
              </div>
              <div class="setting-group">
                <strong>To Do:</strong> ${tasks.filter(t => t.status === 'todo').length || 0}
              </div>
            </div>
          </div>

          <div class="section">
            <h2>📝 All Tasks</h2>
            ${tasks.length > 0 ? tasks.map(task => `
              <div class="task-item">
                <div class="task-header">
                  <span class="task-title">${task.title}</span>
                  <div>
                    <span class="task-status status-${task.status.replace('-', '')}">${task.status.toUpperCase()}</span>
                    <span class="priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                  </div>
                </div>
                ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
                <p><strong>Category:</strong> ${task.category || 'None'}</p>
                ${task.dueDate ? `<p><strong>Due Date:</strong> ${task.dueDate}</p>` : ''}
                ${task.assignee ? `<p><strong>Assignee:</strong> ${task.assignee}</p>` : ''}
                ${task.tags && task.tags.length > 0 ? `<p><strong>Tags:</strong> ${task.tags.join(', ')}</p>` : ''}
                <p><strong>Created:</strong> ${task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
            `).join('') : '<p>No tasks found.</p>'}
          </div>

          <div class="section">
            <h2>⚙️ Settings & Preferences</h2>
            <div class="settings-grid">
              <div class="setting-group">
                <h4>Theme Preferences</h4>
                <p><strong>Theme:</strong> ${settings.preferences?.theme || 'System'}</p>
                <p><strong>Date Format:</strong> ${settings.preferences?.dateFormat || 'MM/dd/yyyy'}</p>
                <p><strong>Time Format:</strong> ${settings.preferences?.timeFormat || '12h'}</p>
              </div>
              <div class="setting-group">
                <h4>Notifications</h4>
                <p><strong>Email:</strong> ${settings.notifications?.email ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Push:</strong> ${settings.notifications?.push ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Task Reminders:</strong> ${settings.notifications?.taskReminders ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This export contains all your personal data from TaskFlow AI.</p>
            <p>For questions about your data, contact: privacy@taskflow.ai</p>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TaskFlow-AI-Data-Export-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download Your Data</DialogTitle>
          <DialogDescription>
            Export all your TaskFlow AI data as a well-organized, printable document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">What's included:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Profile information & account details</li>
              <li>• Complete task list with status & priorities</li>
              <li>• Settings and preferences summary</li>
              <li>• Task analytics and statistics</li>
              <li>• Professionally formatted for printing</li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? 'Preparing Download...' : 'Download Data'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAccountModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { logout } = useAuth();

  const handleDelete = () => {
    if (confirmText === 'DELETE') {
      // Clear all data
      localStorage.clear();
      logout();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and all data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Warning:</strong> All your tasks, settings, and account data will be permanently lost.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="confirmDelete">
              Type <strong>DELETE</strong> to confirm:
            </Label>
            <Input
              id="confirmDelete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE'}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
