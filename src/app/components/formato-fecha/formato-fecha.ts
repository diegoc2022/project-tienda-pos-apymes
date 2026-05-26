import { MatDateFormats } from '@angular/material/core';

export const FORMATO_FECHA_CUSTOM: MatDateFormats = {
    parse: {
        dateInput: 'DD-MM-YYYY',
    },
    display: {
        dateInput: 'DD-MM-YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

/**
 * Formatea una fecha ISO a formato de fecha legible
 * @param fechaISO - Fecha en formato ISO (ej: "2024-11-09T22:57:42.199Z")
 * @param formato - Formato de salida (por defecto: 'DD/MM/YYYY')
 * @returns Fecha formateada
 */
export function formatearFecha(fechaISO: string, formato: string = 'DD/MM/YYYY'): string {
    if (!fechaISO) return '';

    const fecha = new Date(fechaISO);

    if (isNaN(fecha.getTime())) return '';

    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();

    switch (formato) {
        case 'DD/MM/YYYY':
            return `${dia}/${mes}/${anio}`;
        case 'DD-MM-YYYY':
            return `${dia}-${mes}-${anio}`;
        case 'YYYY-MM-DD':
            return `${anio}-${mes}-${dia}`;
        case 'DD/MM/YY':
            return `${dia}/${mes}/${anio.toString().slice(-2)}`;
        default:
            return `${dia}/${mes}/${anio}`;
    }
}

/**
 * Formatea una fecha ISO a formato de fecha con hora
 * @param fechaISO - Fecha en formato ISO
 * @returns Fecha y hora formateada
 */
export function formatearFechaHora(fechaISO: string): string {
    if (!fechaISO) return '';

    const fecha = new Date(fechaISO);

    if (isNaN(fecha.getTime())) return '';

    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
}