/**
 * Utilidades para formateo de fechas en la aplicación veterinaria
 */

/**
 * Formatea una fecha con hora en formato local español
 * @param dateTimeString - String de fecha en formato ISO o similar
 * @returns Fecha formateada como "DD/MM/YYYY, HH:mm"
 */
export const formatDateTime = (dateTimeString: string): string => {
    return new Date(dateTimeString).toLocaleString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Formatea solo la fecha en formato local español
 * @param dateString - String de fecha en formato ISO o similar
 * @returns Fecha formateada como "DD/MM/YYYY"
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES');
};

/**
 * Formatea solo la hora en formato local español
 * @param dateTimeString - String de fecha con hora en formato ISO o similar
 * @returns Hora formateada como "HH:mm"
 */
export const formatTime = (dateTimeString: string): string => {
    return new Date(dateTimeString).toLocaleTimeString('es-ES', { 
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Convierte formato datetime-local (YYYY-MM-DDTHH:mm) a formato backend (YYYY-MM-DD HH:mm)
 * @param datetimeLocalValue - Valor de input datetime-local
 * @returns Fecha formateada para el backend
 */
export const formatDateTimeForBackend = (datetimeLocalValue: string): string => {
    return datetimeLocalValue.replace('T', ' ');
};

/**
 * Convierte formato backend (YYYY-MM-DD HH:mm) a formato datetime-local (YYYY-MM-DDTHH:mm)
 * @param backendDateTime - Fecha del backend
 * @returns Fecha formateada para input datetime-local
 */
export const formatDateTimeForInput = (backendDateTime: string): string => {
    return backendDateTime.replace(' ', 'T');
};