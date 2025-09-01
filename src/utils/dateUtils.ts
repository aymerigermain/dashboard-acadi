import { format, startOfWeek, parseISO, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(dateObj, 'dd/MM/yyyy', { locale: fr });
};

export const formatDateLong = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(dateObj, 'dd MMMM yyyy', { locale: fr });
};

export const getWeekLabel = (weekString: string): string => {
  const weekDate = parseISO(weekString);
  const endOfWeek = addDays(weekDate, 6);
  
  return `${format(weekDate, 'dd MMMM', { locale: fr })} - ${format(endOfWeek, 'dd MMMM', { locale: fr })}`;
};

export const getWeekStartDate = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = getWeekStartDate(now);
  const end = addDays(start, 6);
  
  return { start, end };
};

export const getLast8WeeksRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const end = now;
  const start = new Date();
  start.setDate(now.getDate() - 56); // 8 weeks = 56 days
  
  return { start, end };
};