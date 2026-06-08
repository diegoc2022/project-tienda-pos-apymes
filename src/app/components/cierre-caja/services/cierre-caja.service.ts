import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { EncabezadosServices } from '../../encabezados/encabezados';

@Injectable({
  providedIn: 'root',
})
export class CierreCajaService {
  encabezado: any[] = [];

  constructor(private enc: EncabezadosServices) { }

  functImprimeCuadreCajaService(ventasDia: any) {

    // ✅ Validación
    if (!ventasDia || !Array.isArray(ventasDia) || ventasDia.length === 0) {
      console.error('Datos inválidos para cuadre de caja', ventasDia);
      return;
    }

    const width = 100;
    const height = 200;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [width, height]
    });

    this.enc.funt_retorna_razon_social_encabezado().subscribe({
      next: (data: any) => {
        doc.setFontSize(14);
        doc.setFont("Courier", "Bold");
        doc.text(data[0].razon_social, data[0].posicion_x1, data[0].posicion_y1);
        doc.setFontSize(10)
        doc.text(data[0].direcion, data[0].posicion_x2, data[0].posicion_y2);
        doc.setFontSize(10)
        doc.text('NIT: ' + data[0].nit, data[0].posicion_x3, data[0].posicion_y3);
        doc.setFontSize(10)
        doc.text(data[0].nombre_titular, data[0].posicion_x4, data[0].posicion_y4);
        doc.setFontSize(10)
        doc.text('TEL: ' + data[0].Celular, data[0].posicion_x5, data[0].posicion_y5);
        doc.setFont("Courier", " ");
        doc.text('=======================================================', 3, 40);

        // ✅ Título
        doc.setFont('Courier', 'Bold');
        doc.text("CIERRE DE CAJA", 30, 51);

        doc.text("FECHA APERTURA:", 5, 58);
        doc.text(String(ventasDia[0]?.fecha || ''), 65, 58);

        doc.setFont('Courier', 'normal');
        doc.text('============================================', 3, 65);

        // ✅ Encabezado tabla
        doc.setFontSize(11);
        doc.setFont('Courier', 'Bold');
        doc.text("VENTAS VARIOS", 5, 73);
        doc.text("MONTO", 70, 73);

        doc.setFont('Courier', 'normal');
        doc.text('========================================', 3, 80);

        // ✅ Formateo seguro
        const formatCurrency = (value: any, currencySymbol = "$") => {
          return currencySymbol + Number(value || 0).toLocaleString();
        };

        const totalVarios = Number(ventasDia[0]?.total || 0);
        const totalBase = Number(ventasDia[0]?.base || 0);
        const totalFluver = Number(ventasDia[0]?.otrasv || 0);
        const totalGastos = Number(ventasDia[0]?.gastos || 0);

        const totalBruto = (totalVarios + totalBase + totalFluver) - totalGastos;

        // ✅ Valores formateados
        const totalVariosFmt = formatCurrency(totalVarios);
        const totalBaseFmt = formatCurrency(totalBase);
        const totalFluverFmt = formatCurrency(totalFluver);
        const totalFmt = formatCurrency(totalBruto);
        const totalGastosFmt = formatCurrency(totalGastos);

        // ✅ Contenido
        doc.setFontSize(10);
        doc.setFont('Courier', 'Bold');

        doc.text('BASE CAJA:', 5, 87);
        doc.text(totalBaseFmt, 70, 87);

        doc.text('VARIOS:', 5, 94);
        doc.text(totalVariosFmt, 70, 94);

        doc.text('FLUVER:', 5, 101);
        doc.text(totalFluverFmt, 70, 101);

        doc.text('GASTOS OPERATIVOS:', 5, 108);
        doc.text(totalGastosFmt, 70, 108);

        doc.setFont('Courier', 'normal');
        doc.text('============================================', 3, 115);

        doc.setFontSize(11);
        doc.setFont('Courier', 'Bold');
        doc.text('TOTAL VENTAS DEL DIA:', 4, 122);
        doc.text(totalFmt, 70, 122);

        doc.text('.', 5, 140);

        // ✅ Mostrar en pantalla (NO descargar)
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');

      }
    });

  }

}
