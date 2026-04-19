import {
  X,
  Check,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  LogOut,
  Settings,
  Bell,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  Wifi,
  WifiOff,
  QrCode,
  Copy,
  RefreshCw,
  Home,
  Activity,
  Users,
  MessageSquare,
  Send,
  ArrowLeft,
  type LucideProps,
} from 'lucide-react';
import styles from './Icon.module.css';

const iconMap = {
  X,
  Check,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  LogOut,
  Settings,
  Bell,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  Wifi,
  WifiOff,
  QrCode,
  Copy,
  RefreshCw,
  Home,
  Activity,
  Users,
  MessageSquare,
  Send,
  ArrowLeft,
} as const;

export type IconName = keyof typeof iconMap;
export type IconSize = 16 | 20 | 24 | 32;

const sizeClass: Record<IconSize, string> = {
  16: styles.size16,
  20: styles.size20,
  24: styles.size24,
  32: styles.size32,
};

interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName;
  size?: IconSize;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export function Icon({
  name,
  size = 20,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  ...props
}: IconProps) {
  const LucideIcon = iconMap[name];

  const accessibilityProps = ariaLabel
    ? { role: 'img' as const, 'aria-label': ariaLabel, 'aria-hidden': undefined }
    : { 'aria-hidden': ariaHidden ?? ('true' as const) };

  return (
    <span
      className={[styles.icon, sizeClass[size], className].filter(Boolean).join(' ')}
      {...accessibilityProps}
    >
      <LucideIcon width={size} height={size} {...props} />
    </span>
  );
}