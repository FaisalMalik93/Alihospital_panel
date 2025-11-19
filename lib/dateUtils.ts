import { format, formatInTimeZone } from 'date-fns-tz'

// Pakistan Standard Time timezone
const PKT_TIMEZONE = 'Asia/Karachi'

/**
 * Format date in PKT timezone
 * @param date - Date to format
 * @param formatStr - Format string (e.g., 'dd-MM-yyyy', 'hh:mm a')
 * @returns Formatted date string in PKT
 */
export function formatPKT(date: Date | string, formatStr: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatInTimeZone(dateObj, PKT_TIMEZONE, formatStr)
}

/**
 * Get current date/time in PKT
 * @returns Current Date object
 */
export function nowPKT(): Date {
  return new Date()
}

/**
 * Format date as 'dd-MM-yyyy' in PKT
 */
export function formatDatePKT(date: Date | string): string {
  return formatPKT(date, 'dd-MM-yyyy')
}

/**
 * Format time as 'hh:mm a' in PKT
 */
export function formatTimePKT(date: Date | string): string {
  return formatPKT(date, 'hh:mm a')
}

/**
 * Format date and time as 'dd-MM-yyyy hh:mm a' in PKT
 */
export function formatDateTimePKT(date: Date | string): string {
  return formatPKT(date, 'dd-MM-yyyy hh:mm a')
}

/**
 * Format date as 'EEEE, dd MMMM yyyy' in PKT (e.g., "Monday, 18 November 2025")
 */
export function formatLongDatePKT(date: Date | string): string {
  return formatPKT(date, 'EEEE, dd MMMM yyyy')
}

/**
 * Format for PDF filename (e.g., "18112025")
 */
export function formatPDFDatePKT(date: Date | string): string {
  return formatPKT(date, 'ddMMyyyy')
}
