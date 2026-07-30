import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  CircleDashed,
  Cpu,
  Database,
  FileText,
  Layers,
  Lightbulb,
  Lock,
  MessageSquare,
  Moon,
  PieChart,
  Search,
  Send,
  Shield,
  Settings,
  Sparkles,
  Star,
  Upload,
  User,
} from 'lucide-react'

export const navLinks = [
  { label: 'Home', to: '/', icon: Star },
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'Upload PDF', to: '/upload', icon: Upload },
  { label: 'AI Chat', to: '/chat', icon: MessageSquare },
  { label: 'Documents', to: '/documents', icon: FileText },
  { label: 'Analytics', to: '/analytics', icon: PieChart },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export const features = [
  {
    title: 'Instant PDF insights',
    description: 'Turn lecture notes into searchable answers instantly with PDF RAG.',
    icon: FileText,
  },
  {
    title: 'Smart learning workflows',
    description: 'Track progress and analytics with premium study dashboards.',
    icon: Activity,
  },
  {
    title: 'AI-assisted summaries',
    description: 'Get concise engineering explanations based on your uploaded documents.',
    icon: Lightbulb,
  },
]

export const stats = [
  { label: 'Uploaded PDFs', value: 18, change: '+28%', icon: Upload },
  { label: 'Questions Asked', value: 134, change: '+15%', icon: MessageSquare },
  { label: 'AI Responses', value: 184, change: '+23%', icon: MessageSquare },
  { label: 'Recent Chats', value: 6, change: 'Live', icon: CheckCircle2 },
]

export const dashboardCards = [
  {
    label: 'Indexed PDFs',
    value: '24',
    detail: 'Full course archives ready for retrieval.',
    icon: FileText,
    gradient: 'from-[#6366F1] to-[#7C3AED]',
  },
  {
    label: 'Study Interactions',
    value: '482',
    detail: 'Conversations and search sessions.',
    icon: MessageSquare,
    gradient: 'from-[#22D3EE] to-[#0EA5E9]',
  },
  {
    label: 'Answer Confidence',
    value: '98%',
    detail: 'AI answers grounded in your notes.',
    icon: CheckCircle2,
    gradient: 'from-[#10B981] to-[#34D399]',
  },
  {
    label: 'Workflow Stages',
    value: '7',
    detail: 'PDF upload to AI response pipeline.',
    icon: Layers,
    gradient: 'from-[#F59E0B] to-[#F97316]',
  },
]

export const activityTrend = [
  { name: 'Mon', activity: 32 },
  { name: 'Tue', activity: 48 },
  { name: 'Wed', activity: 42 },
  { name: 'Thu', activity: 60 },
  { name: 'Fri', activity: 68 },
  { name: 'Sat', activity: 52 },
  { name: 'Sun', activity: 74 },
]

export const recentActivity = [
  { title: 'Thermodynamics Q&A', subtitle: 'Discussed entropy and efficiency', time: '2h ago' },
  { title: 'Control Systems Review', subtitle: 'Clarified PID tuning workflows', time: '5h ago' },
  { title: 'Digital Logic Notes', subtitle: 'Summarized combinational circuits', time: 'Yesterday' },
]

export const recentChats = recentActivity

export const recentDocuments = [
  { name: 'Computer Networks.pdf', pages: 58, status: 'Indexed' },
  { name: 'Database Systems.pdf', pages: 46, status: 'Indexed' },
  { name: 'Fluid Mechanics.pdf', pages: 34, status: 'Processing' },
]

export const quickActions = [
  { label: 'Upload PDF', icon: Upload },
  { label: 'Start AI Chat', icon: Send },
  { label: 'Browse Documents', icon: Search },
  { label: 'Review Analytics', icon: BarChart3 },
]

export const workflowSteps = [
  { label: 'Upload PDF', icon: Upload, status: 'Complete' },
  { label: 'Text Extraction', icon: FileText, status: 'Complete' },
  { label: 'Chunking', icon: Layers, status: 'Complete' },
  { label: 'Embeddings', icon: Database, status: 'Complete' },
  { label: 'Vector DB', icon: CircleDashed, status: 'Active' },
  { label: 'AI Response', icon: Sparkles, status: 'Queued' },
]

export const uploadedPdfs = [
  { name: 'Digital Signal Processing.pdf', pages: 54, status: 'Indexed', progress: 100 },
  { name: 'Embedded Systems.pdf', pages: 40, status: 'Processing', progress: 72 },
  { name: 'Thermal Engineering.pdf', pages: 38, status: 'Pending', progress: 44 },
]

export const chatHistory = [
  { title: 'State Space Exam prep', preview: 'What are the key steps for model reduction?' },
  { title: 'Machine Learning notes', preview: 'Summarize gradient descent in simple terms.' },
  { title: 'Power Systems Q&A', preview: 'Explain fault analysis with examples.' },
]

export const chatMessages = [
  {
    role: 'ai',
    text: 'I reviewed the uploaded Control Systems PDF. Would you like a summary of frequency response or PID tuning first?',
    time: '10:22 AM',
  },
  {
    role: 'user',
    text: 'Summarize the main difference between open-loop and closed-loop control.',
    time: '10:23 AM',
  },
  {
    role: 'ai',
    text: 'Open-loop control does not use feedback and cannot correct disturbances automatically. Closed-loop control monitors output and adjusts the input to reach the desired result.',
    time: '10:24 AM',
  },
]

export const suggestedPrompts = [
  'Explain phase margin in control theory',
  'Summarize key formulas from fluid dynamics',
  'Compare ADC and DAC performance metrics',
]

export const documents = [
  { name: 'Signal Processing.pdf', pages: 48, status: 'Indexed', date: '2026-06-24' },
  { name: 'Electromagnetics.pdf', pages: 36, status: 'Processing', date: '2026-06-25' },
  { name: 'Advanced AI.pdf', pages: 60, status: 'Indexed', date: '2026-06-26' },
  { name: 'Operating Systems.pdf', pages: 42, status: 'Pending', date: '2026-06-27' },
]

export const analyticsData = [
  { name: 'Week 1', progress: 48 },
  { name: 'Week 2', progress: 62 },
  { name: 'Week 3', progress: 74 },
  { name: 'Week 4', progress: 88 },
]

export const heatmapData = [
  { day: 'Mon', value: 62 },
  { day: 'Tue', value: 74 },
  { day: 'Wed', value: 68 },
  { day: 'Thu', value: 82 },
  { day: 'Fri', value: 77 },
  { day: 'Sat', value: 58 },
  { day: 'Sun', value: 65 },
]

export const topicsCovered = [
  { topic: 'Control Systems', progress: 86 },
  { topic: 'Signals', progress: 72 },
  { topic: 'Power Electronics', progress: 54 },
  { topic: 'ML Fundamentals', progress: 68 },
]

export const settingsOptions = [
  { label: 'Profile', icon: User, description: 'Update your name, photo and account details.' },
  { label: 'Theme & Appearance', icon: Moon, description: 'Manage dashboard theme, fonts and colors.' },
  { label: 'API Settings', icon: Lock, description: 'Configure AI access keys and integrations.' },
  { label: 'Notifications', icon: Bell, description: 'Control email and in-app alerts.' },
  { label: 'Security', icon: Shield, description: 'Manage passwords, MFA and device access.' },
]
