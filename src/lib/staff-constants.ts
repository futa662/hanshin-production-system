import { StaffStatus } from '@/src/types/staff';

export const STATUS_LABELS: Record<StaffStatus, string> = {
  PROCESSING: '加工',
  ASSEMBLY: '組み立て',
  QUALITY_CHECK: '品質検査',
  INSPECTION: '点検',
  BREAK: '休憩',
  LEAVE: '休暇',
};

export const STATUS_COLORS: Record<StaffStatus, string> = {
  PROCESSING: '#10B981', // emerald-500
  ASSEMBLY: '#3B82F6', // blue-500
  QUALITY_CHECK: '#8B5CF6', // violet-500
  INSPECTION: '#F59E0B', // amber-500
  BREAK: '#6B7280', // gray-500
  LEAVE: '#EF4444', // red-500
};

export const GENDER_LABELS = {
  male: '男性',
  female: '女性',
};

export const SHIFT_LABELS = {
  morning: '早番',
  afternoon: '遅番',
  night: '夜勤',
};