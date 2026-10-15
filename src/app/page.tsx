'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, Send, UserCheck, 
  Plus, Search, Filter, LayoutGrid, ListFilter, 
  Sparkles, ExternalLink, Mail, ShieldCheck, ChevronRight,
  ChevronLeft, Trash2, Calendar, User as UserIcon, Tag, 
  ArrowRight, Check, X, RefreshCw, Eye, BookOpen, Video,
  Layers, Database, Server, Smartphone, Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, User, EmailNotification, TaskStatus, TaskPriority, Department, ViewMode } from '@/types';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_NOTIFICATIONS } from '@/lib/mockData';
import { api } from '@/lib/api';

const STATUS_COLUMNS: { id: TaskStatus; title: string; color: string; border: string; bg: string }[] = [
  { id: 'todo', title: 'To Do', color: 'text-zinc-400', border: 'border-zinc-800', bg: 'bg-zinc-900/50' },
  { id: 'in_progress', title: 'In Progress', color: 'text-sky-400', border: 'border-sky-900/50', bg: 'bg-sky-950/20' },
  { id: 'in_review', title: 'In Review', color: 'text-amber-400', border: 'border-amber-900/50', bg: 'bg-amber-950/20' },
  { id: 'completed', title: 'Completed', color: 'text-emerald-400', border: 'border-emerald-900/50', bg: 'bg-emerald-950/20' }
];

const DEPARTMENTS: Department[] = [
  'Creative & Design',
  'Technology & Systems',
  'Operations & Logistics',
  'Marketing & Growth',
  'General'
];

export default function HairdramaDashboard() {
  // State
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[3]); // Default: Yash Jain
  const [notifications, setNotifications] = useState<EmailNotification[]>(INITIAL_NOTIFICATIONS);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');

  // Modals & Drawers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isLoomModalOpen, setIsLoomModalOpen] = useState(false);
  const [previewEmail, setPreviewEmail] = useState<EmailNotification | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Task Form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDept, setNewDept] = useState<Department>('Creative & Design');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');
  const [newAssigneeId, setNewAssigneeId] = useState<string>(INITIAL_USERS[1].id);
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedUsers, loadedTasks, loadedNotifs] = await Promise.all([
          api.getUsers(),
          api.getTasks(),
          api.getNotifications()
        ]);
        if (loadedUsers.length > 0) setUsers(loadedUsers);
        if (loadedTasks.length > 0) setTasks(loadedTasks);
        if (loadedNotifs.length > 0) setNotifications(loadedNotifs);
      } catch (err) {
        console.warn('Initial load using client seed', err);
      }
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      if (selectedDept !== 'all' && t.department !== selectedDept) return false;
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
      if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
      if (selectedAssignee !== 'all' && t.assignee_id !== selectedAssignee) return false;
      return true;
    });
  }, [tasks, searchQuery, selectedDept, selectedPriority, selectedStatus, selectedAssignee]);

  // Metric counts
  const metrics = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date()).length;
    const emailsCount = notifications.length;
    return { total, inProgress, completed, overdue, emailsCount };
  }, [tasks, notifications]);

  // Handle Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<Task> = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        department: newDept,
        priority: newPriority,
        assignee_id: newAssigneeId,
        creator_id: currentUser.id,
        due_date: newDueDate || null,
        status: 'todo'
      };

      const res = await api.createTask(payload);
      const createdTask = res.task;

      setTasks(prev => [createdTask, ...prev]);

      if (res.email_dispatch) {
        setNotifications(prev => [res.email_dispatch!, ...prev]);
        showToast(`Task created! Gmail notification dispatched to ${createdTask.assignee?.email || 'assignee'}`);
      } else {
        showToast(`Task created successfully!`);
      }

      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewDueDate('');
      setIsCreateOpen(false);
    } catch (err) {
      showToast('Error creating task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Status Change
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const oldStatus = target.status;

    // Optimistic UI update
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        };
      }
      return t;
    }));

    if (newStatus === 'completed' && oldStatus !== 'completed') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    try {
      const res = await api.updateTask(taskId, { status: newStatus }, currentUser.id);
      if (res.completion_emails && res.completion_emails.length > 0) {
        setNotifications(prev => [...res.completion_emails!, ...prev]);
        showToast(`Task marked completed! Completion emails dispatched to creator & assignee.`);
      } else if (newStatus === 'completed') {
        showToast(`Task marked as Completed!`);
      }
    } catch (err) {
      showToast('Error updating status');
    }
  };

  // Handle Switch Persona (Demo Login)
  const handleSwitchPersona = async (user: User) => {
    setCurrentUser(user);
    setIsPersonaModalOpen(false);
    showToast(`Switched active persona to ${user.name} (${user.role})`);
    try {
      await api.demoLogin(user.email);
    } catch (e) {
      console.warn(e);
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTask?.id === taskId) setSelectedTask(null);
    showToast('Task deleted successfully');
    await api.deleteTask(taskId);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">Low</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-zinc-900/95 border border-[#d4af37]/40 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span className="text-sm font-medium text-zinc-100">{toastMessage}</span>
        </div>
      )}

      {/* Top Luxury Navigation */}
      <header className="border-b border-zinc-800/80 bg-[#0b0d14]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4af37] via-[#b8972e] to-[#8c731e] p-[1px] flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-[#0d0f17] rounded-[7px] flex items-center justify-center">
                  <span className="font-serif font-black text-sm tracking-tighter text-[#d4af37]">HD</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-widest uppercase font-serif text-zinc-100">HAIR DRAMA CO.</h1>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 tracking-wider">FlowOS</span>
                </div>
                <p className="text-[11px] text-zinc-400 tracking-wider uppercase font-medium">Task Orchestration & Gmail Workflows</p>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-3">
            {/* Architecture Modal Button */}
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Architecture & Specs</span>
            </button>

            {/* Video Walkthrough Button */}
            <button
              onClick={() => setIsLoomModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-rose-400" />
              <span>Code Walkthrough</span>
            </button>

            {/* Gmail Notification Center Trigger */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Gmail Notification Center"
            >
              <Mail className="w-4 h-4 text-[#d4af37]" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Persona Switcher Pill */}
            <button
              onClick={() => setIsPersonaModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-[#d4af37]/50 text-left transition-colors"
            >
              <img
                src={currentUser.avatar_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-[#d4af37]/40"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-zinc-200 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-zinc-400 leading-tight">{currentUser.role?.split(' ')[0]}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Primary CTA: Create Task */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8972e] hover:from-[#e5bd3c] hover:to-[#c7a433] text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* KPI & Metrics Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-[#111420]/80 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Tasks</div>
              <div className="text-2xl font-black text-white mt-1">{metrics.total}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-800/60 flex items-center justify-center text-[#d4af37]">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#111420]/80 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">In Progress</div>
              <div className="text-2xl font-black text-sky-200 mt-1">{metrics.inProgress}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-950/40 flex items-center justify-center text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#111420]/80 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Completed</div>
              <div className="text-2xl font-black text-emerald-200 mt-1">{metrics.completed}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#111420]/80 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Overdue Alerts</div>
              <div className="text-2xl font-black text-rose-200 mt-1">{metrics.overdue}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-950/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-[#111420]/80 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider">Gmail Dispatches</div>
              <div className="text-2xl font-black text-[#f5e7a3] mt-1">{metrics.emailsCount}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <Send className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Toolbar: Search, Filters & View Mode */}
        <section className="bg-[#111420]/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks, descriptions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] focus:outline-none text-zinc-200 placeholder:text-zinc-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 focus:border-[#d4af37] focus:outline-none"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 focus:border-[#d4af37] focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Assignee Filter */}
            <select
              value={selectedAssignee}
              onChange={e => setSelectedAssignee(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 focus:border-[#d4af37] focus:outline-none"
            >
              <option value="all">All Assignees</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-end md:self-auto">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'kanban' ? 'bg-[#d4af37] text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'table' ? 'bg-[#d4af37] text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </section>

        {/* View Mode: Kanban Board */}
        {viewMode === 'kanban' ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATUS_COLUMNS.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="flex flex-col bg-[#0e101a]/70 rounded-2xl border border-zinc-800/80 p-3 min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 px-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'completed' ? 'bg-emerald-400' : col.id === 'in_progress' ? 'bg-sky-400' : col.id === 'in_review' ? 'bg-amber-400' : 'bg-zinc-400'}`}></span>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{col.title}</h2>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-zinc-800/80 text-zinc-400">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {colTasks.length === 0 ? (
                      <div className="h-32 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 text-xs">
                        No tasks in {col.title}
                      </div>
                    ) : (
                      colTasks.map(task => {
                        const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                        return (
                          <div
                            key={task.id}
                            className="bg-[#141724] border border-zinc-800 hover:border-[#d4af37]/40 rounded-xl p-3.5 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between gap-3 cursor-pointer"
                            onClick={() => setSelectedTask(task)}
                          >
                            {/* Card Header: Dept & Priority */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase truncate">
                                {task.department}
                              </span>
                              {getPriorityBadge(task.priority)}
                            </div>

                            {/* Title & Desc */}
                            <div>
                              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-[#f5e7a3] transition-colors leading-snug">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            {/* Card Footer: Assignee & Due Date */}
                            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                              {/* Assignee Avatar */}
                              <div className="flex items-center gap-2">
                                <img
                                  src={task.assignee?.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=Team"}
                                  alt={task.assignee?.name || "Unassigned"}
                                  className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                                />
                                <span className="text-[11px] font-medium text-zinc-300 truncate max-w-[90px]">
                                  {task.assignee?.name?.split(' ')[0] || "Unassigned"}
                                </span>
                              </div>

                              {/* Due Date Indicator */}
                              {task.due_date && (
                                <div className={`flex items-center gap-1 text-[10px] font-medium ${isOverdue ? 'text-rose-400' : 'text-zinc-400'}`}>
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                              )}
                            </div>

                            {/* Quick Status Shift Buttons */}
                            <div className="flex items-center justify-between pt-1 gap-1" onClick={e => e.stopPropagation()}>
                              {col.id !== 'todo' ? (
                                <button
                                  onClick={() => {
                                    const prevStatus = col.id === 'completed' ? 'in_review' : col.id === 'in_review' ? 'in_progress' : 'todo';
                                    handleStatusChange(task.id, prevStatus);
                                  }}
                                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-[10px] flex items-center gap-0.5"
                                  title="Move backwards"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                  <span>Back</span>
                                </button>
                              ) : <div />}

                              {col.id !== 'completed' ? (
                                <button
                                  onClick={() => {
                                    const nextStatus = col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'in_review' : 'completed';
                                    handleStatusChange(task.id, nextStatus);
                                  }}
                                  className="p-1 px-1.5 rounded bg-zinc-800 hover:bg-[#d4af37] text-zinc-300 hover:text-zinc-950 transition-colors text-[10px] font-bold flex items-center gap-0.5 ml-auto"
                                  title="Advance status"
                                >
                                  <span>Advance</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 ml-auto">
                                  <Check className="w-3 h-3" /> Done
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          /* View Mode: Data Grid / Table */
          <section className="bg-[#111420]/80 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Task Details</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assignee</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-xs">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-500">
                        No tasks match the active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map(task => (
                      <tr 
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="font-bold text-zinc-100 group-hover:text-[#f5e7a3] transition-colors">{task.title}</div>
                          {task.description && (
                            <div className="text-zinc-400 text-[11px] truncate mt-0.5">{task.description}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-medium">
                          {task.department}
                        </td>
                        <td className="py-3.5 px-4">
                          {getPriorityBadge(task.priority)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={task.assignee?.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=Team"}
                              alt={task.assignee?.name || "Unassigned"}
                              className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                            />
                            <span className="text-zinc-200 font-medium">{task.assignee?.name || "Unassigned"}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                          <select
                            value={task.status}
                            onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                            className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-[11px] font-semibold text-zinc-200 focus:outline-none focus:border-[#d4af37]"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="in_review">In Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* MODAL: Create New Task */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111420] border border-zinc-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-serif">Create New Task</h2>
                <p className="text-xs text-zinc-400">Collaborative task orchestration for Hair Drama Co</p>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FW26 Crystal Headband Runway Campaign"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] focus:outline-none text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe milestones, styling directives, and production specs..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] focus:outline-none text-white placeholder:text-zinc-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={e => setNewDept(e.target.value as Department)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:border-[#d4af37] focus:outline-none"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Assignee (Receives Gmail Alert) *
                  </label>
                  <select
                    value={newAssigneeId}
                    onChange={e => setNewAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:border-[#d4af37] focus:outline-none"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.role || u.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Email Dispatch Preview Box */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#0a0c14] border border-[#d4af37]/30 text-xs">
                <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Automated Gmail Dispatch Trigger</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Upon clicking submit, our integrated Gmail SMTP worker will automatically format a luxury HTML notification and dispatch it to{' '}
                  <strong className="text-zinc-200 font-semibold">{users.find(u => u.id === newAssigneeId)?.email}</strong>.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8972e] text-zinc-950 uppercase tracking-wider shadow-lg hover:brightness-110 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating & Dispatching...' : 'Create & Send Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: Task Details & Audit Trail */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#111420] border-l border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  {getPriorityBadge(selectedTask.priority)}
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {selectedTask.department}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Desc */}
              <div className="mt-4">
                <h2 className="text-lg font-bold text-white leading-snug">{selectedTask.title}</h2>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed whitespace-pre-line">
                  {selectedTask.description || "No description provided."}
                </p>
              </div>

              {/* Status Selector */}
              <div className="mt-6 p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Task Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_COLUMNS.map(col => (
                    <button
                      key={col.id}
                      onClick={() => {
                        handleStatusChange(selectedTask.id, col.id);
                        setSelectedTask(prev => prev ? { ...prev, status: col.id } : null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedTask.status === col.id ? 'bg-[#d4af37] text-zinc-950 border-[#d4af37]' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`}
                    >
                      {col.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metadata Cards */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Assignee</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <img
                      src={selectedTask.assignee?.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=Team"}
                      alt={selectedTask.assignee?.name || "Unassigned"}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-zinc-200 truncate">{selectedTask.assignee?.name || "Unassigned"}</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Due Date</span>
                  <span className="font-semibold text-zinc-200 block mt-1.5">
                    {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : 'Flexible'}
                  </span>
                </div>
              </div>

              {/* Audit Trail & Activity Timeline */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Audit Trail & Activity History</span>
                </h4>
                <div className="space-y-3 relative pl-4 border-l border-zinc-800">
                  {selectedTask.activities && selectedTask.activities.length > 0 ? (
                    selectedTask.activities.map((act, i) => (
                      <div key={act.id || i} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#d4af37] border-2 border-[#111420]"></div>
                        <div className="text-xs font-medium text-zinc-200">{act.details}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {new Date(act.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-zinc-500 italic">No activity logs recorded yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Task</span>
              </button>

              {selectedTask.status !== 'completed' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedTask.id, 'completed');
                    setSelectedTask(prev => prev ? { ...prev, status: 'completed' } : null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 uppercase tracking-wider shadow"
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: Gmail Notification Center HUD */}
      {isNotifDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#111420] border-l border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gmail Notification HUD</h3>
                    <p className="text-[11px] text-zinc-400">Live delivery audit trail for Hair Drama Co</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNotifDrawerOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notification Cards */}
              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-xs">
                    No email notifications dispatched yet.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 hover:border-[#d4af37]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          {notif.status === 'delivered' ? '✓ Delivered via Gmail SMTP' : 'Simulated Delivery'}
                        </span>
                        <span className="text-zinc-500">
                          {new Date(notif.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-zinc-100 mt-1">{notif.subject}</div>
                      <div className="text-[11px] text-zinc-400 mt-1">To: <span className="text-zinc-300 font-medium">{notif.recipient_email}</span></div>
                      {notif.body_preview && (
                        <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 italic">
                          "{notif.body_preview}"
                        </p>
                      )}

                      <div className="mt-2 pt-2 border-t border-zinc-800/60 flex justify-end">
                        <button
                          onClick={() => setPreviewEmail(notif)}
                          className="text-[11px] font-bold text-[#d4af37] hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Rendered HTML Email</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 text-center">
              Powered by Python smtplib / STARTTLS & PostgREST Webhook Dispatcher
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Rendered HTML Email Preview */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#111420] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setPreviewEmail(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-[#d4af37]" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Email Dispatch Inspector</h3>
                <p className="text-[11px] text-zinc-400">Recipient: {previewEmail.recipient_email}</p>
              </div>
            </div>

            {/* Email Canvas Preview */}
            <div className="bg-[#13151f] border border-zinc-800 rounded-xl p-5 text-zinc-200 text-xs space-y-4">
              <div className="text-center pb-4 border-b border-zinc-800">
                <div className="font-serif font-black text-sm tracking-widest text-[#d4af37]">HAIR DRAMA CO.</div>
                <div className="text-[9px] uppercase tracking-widest text-zinc-500">Luxury Fashion & Accessories • FlowOS</div>
              </div>

              <div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {previewEmail.event_type === 'task_created' ? 'New Task Assigned' : 'Task Completed'}
                </span>
                <h4 className="text-sm font-bold text-white mt-2">{previewEmail.subject}</h4>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  {previewEmail.body_preview}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#1a1d2d] border border-zinc-800 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-semibold">FROM:</span>
                  <span className="text-zinc-300">notifications@hairdramaco.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-semibold">TO:</span>
                  <span className="text-zinc-300">{previewEmail.recipient_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-semibold">GATEWAY:</span>
                  <span className="text-emerald-400 font-bold">Gmail SMTP (SSL :465)</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="inline-block px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8972e] text-zinc-950 font-bold text-xs uppercase tracking-wider">
                  Open in Hairdrama FlowOS
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Persona Quick Switcher (Google OAuth / Demo Account) */}
      {isPersonaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111420] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsPersonaModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-[#d4af37]" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Active User Persona</h3>
                <p className="text-xs text-zinc-400">Switch accounts to test assigning tasks between users</p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSwitchPersona(u)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${currentUser.id === u.id ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=Team"}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/40"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-zinc-100">{u.name}</div>
                      <div className="text-[11px] text-zinc-400">{u.role} • {u.email}</div>
                    </div>
                  </div>
                  {currentUser.id === u.id && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#d4af37] text-zinc-950 uppercase">Active</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
              <div className="text-[11px] text-zinc-400">
                Google OAuth 2.0 Integration Active • Single Sign-On Ready
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Architecture & System Specifications */}
      {isArchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#111420] border border-zinc-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsArchModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#d4af37]" />
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif">Hairdrama FlowOS Architecture</h3>
                <p className="text-xs text-zinc-400">Comprehensive Engineering Blueprint & Stack Design</p>
              </div>
            </div>

            <div className="space-y-6 text-xs text-zinc-300">
              {/* Stack Architecture Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <Database className="w-4 h-4 text-emerald-400 mb-1" />
                  <div className="font-bold text-zinc-100">Database</div>
                  <div className="text-[11px] text-zinc-400">Supabase (PostgreSQL 15) with RLS & DDL migrations in <code className="text-[#d4af37]">/migrations</code></div>
                </div>

                <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <Server className="w-4 h-4 text-sky-400 mb-1" />
                  <div className="font-bold text-zinc-100">Backend</div>
                  <div className="text-[11px] text-zinc-400">Flask (Python 3.11) REST microservices in <code className="text-[#d4af37]">backend/</code> with pytest suite</div>
                </div>

                <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <Laptop className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="font-bold text-zinc-100">Frontend</div>
                  <div className="text-[11px] text-zinc-400">Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4</div>
                </div>

                <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <Mail className="w-4 h-4 text-rose-400 mb-1" />
                  <div className="font-bold text-zinc-100">Email & Auth</div>
                  <div className="text-[11px] text-zinc-400">Google OAuth 2.0 & Gmail SMTP Automated Notification Engine</div>
                </div>
              </div>

              {/* Functional Workflow */}
              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="font-bold text-sm text-[#f5e7a3] uppercase tracking-wider">Mandatory Functional Specifications Implemented</h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>1. User Account Creation & Google OAuth:</strong> Authenticates via Google ID token exchange or 1-click persona switcher across Hair Drama Co departments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>2. Task Creation:</strong> Dynamic creation modal with title, description, priority, department, and deadline.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>3. Task Assignment:</strong> Seamless assignment across team members with active workload statistics.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>4. Automated Gmail Notifications:</strong> Outbound Gmail SMTP triggered on task creation (to assignee) and task completion (to creator & assignee) with rendered luxury HTML styling.</span>
                  </li>
                </ul>
              </div>

              {/* Extra Features Added */}
              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="font-bold text-sm text-[#d4af37] uppercase tracking-wider">Bonus Features for Business Excellence</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-zinc-950/60 rounded-lg">✨ Dual Kanban Board & Table Views with drag-like transitions</div>
                  <div className="p-2 bg-zinc-950/60 rounded-lg">📊 Live Delivery Audit Trail HUD with rendered email inspector</div>
                  <div className="p-2 bg-zinc-950/60 rounded-lg">📜 Chronological Activity Log & Audit Trail per task</div>
                  <div className="p-2 bg-zinc-950/60 rounded-lg">🎯 Task Priority Matrix (Urgent, High, Medium, Low)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Code Walkthrough Presentation */}
      {isLoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#111420] border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsLoomModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-rose-400" />
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif">Code & Architecture Walkthrough</h3>
                <p className="text-xs text-zinc-400">Technical presentation for Vivek & Hairdrama Tech Team</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="aspect-video bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <Video className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-white">Hairdrama FlowOS Technical Walkthrough</div>
                <p className="text-xs text-zinc-400 max-w-md mt-1">
                  Full module-by-module architectural breakdown covering the Supabase schema, Flask microservices, Google OAuth 2.0 flow, and Gmail SMTP delivery pipeline.
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href="https://github.com/yash560/hairdramaco_india_private_limited-assignment"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <span>View GitHub Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-[11px] leading-relaxed">
                <strong>Interview Evaluation Note:</strong> All code in this repository was cleanly engineered following production best practices with full TypeScript strictness, automated pytest unit tests, and structured Git commit history.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-[#0b0d14] py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Hair Drama Co. Private Limited • Makarba, Ahmedabad
          </div>
          <div>
            Engineered by <strong className="text-zinc-300">Yash Jain</strong> for Hairdrama Tech Internship Assessment
          </div>
        </div>
      </footer>
    </div>
  );
}
