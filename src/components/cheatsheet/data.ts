import {
  GraduationCap,
  Landmark,
  Gem,
  Database,
  Atom,
  Container,
  type LucideIcon,
} from 'lucide-react'

export type LevelId = 'school' | 'college' | 'expert'

export type Level = {
  id: LevelId
  title: string
  subtitle: string
  icon: LucideIcon
  iconWrap: string
  iconColor: string
  disabled?: boolean
}

export const LEVELS: Level[] = [
  {
    id: 'school',
    title: 'School',
    subtitle: 'Basics & Fundamentals',
    icon: GraduationCap,
    iconWrap: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'college',
    title: 'College',
    subtitle: 'In-depth Concepts',
    icon: Landmark,
    iconWrap: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: 'expert',
    title: 'Expert',
    subtitle: 'Coming Soon',
    icon: Gem,
    iconWrap: 'bg-slate-100', // Making it look disabled
    iconColor: 'text-slate-400', // Making it look disabled
    disabled: true,
  },
]

export const SUBJECTS = [
  'Science',
  'Mathematics',
  'History',
  'Geography',
  'Programming',
  'Business',
  'Medicine',
  'Law',
  'Literature',
  'Economics',
  'Psychology',
  'Engineering',
]

export type BadgeLevel = 'School' | 'College' | 'Expert'

export type Cheatsheet = {
  id: string
  name: string
  level: BadgeLevel
  date: string
  size: string
  icon: LucideIcon
  iconWrap: string
  iconColor: string
}

export const RECENT_CHEATSHEETS: Cheatsheet[] = [
  {
    id: 'redis',
    name: 'Redis Cheatsheet',
    level: 'Expert',
    date: 'May 20, 2025',
    size: '24 KB',
    icon: Database,
    iconWrap: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    id: 'react',
    name: 'React Cheatsheet',
    level: 'College',
    date: 'May 18, 2025',
    size: '32 KB',
    icon: Atom,
    iconWrap: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    id: 'docker',
    name: 'Docker Cheatsheet',
    level: 'School',
    date: 'May 15, 2025',
    size: '18 KB',
    icon: Container,
    iconWrap: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
]

export const BADGE_STYLES: Record<BadgeLevel, string> = {
  School: 'bg-emerald-100 text-emerald-700',
  College: 'bg-amber-100 text-amber-700',
  Expert: 'bg-red-100 text-red-700',
}
