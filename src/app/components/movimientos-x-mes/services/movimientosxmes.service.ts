import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { EncabezadosServices } from '../../encabezados/encabezados';

@Injectable({
  providedIn: 'root',
})
export class MovimientosxmesService {
  constructor(private enc: EncabezadosServices) { }

  funct_imprime_movimientos_s(data: any) {
    const width = 100;
    const height = 150;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [width, height]
    });

    this.enc.funt_retorna_razon_social_encabezado().subscribe({
      next: (data2: any) => {
        doc.setFontSize(14);
        doc.setFont("Courier", "Bold");
        doc.text(data2[0].razon_social, data2[0].posicion_x1, data2[0].posicion_y1);
        doc.setFontSize(10)
        doc.text(data2[0].direcion, data2[0].posicion_x2, data2[0].posicion_y2);
        doc.setFontSize(10)
        doc.text('NIT: ' + data2[0].nit, data2[0].posicion_x3, data2[0].posicion_y3);
        doc.setFontSize(10)
        doc.text('TEL: ' + data2[0].telefono, data2[0].posicion_x4, data2[0].posicion_y4);
        doc.setFont("Courier", " ");
        doc.text('==================================================', 3, 40);
        doc.setFont("Courier", "Bold");
        doc.text('CORTE MOVIMIENTO', 27, 45);
        doc.setFont("Courier", " ");
        doc.text('MES:', 10, 50);
        doc.text('AÑO:', 70, 50);
        doc.text(`${data[0].num_mes}`, 13, 56);
        doc.text(`${data[0].num_year}`, 71, 56);
        doc.setFont("Courier", " ");
        doc.text('==================================================', 3, 62);
        doc.setFont("Courier", "Bold");
        doc.text('MOVIMIENTOS DEL MES', 26, 70);
        doc.setFont("Courier", " ");
        function formatCurrency(value: any, currencySymbol = "$") {
          return currencySymbol + parseInt(value).toLocaleString();
        }
        const total_ventas = formatCurrency(data[0].ventas);
        const total_compras = formatCurrency(data[0].compras);
        const total_gastos = formatCurrency(data[0].gastos);
        const total_nomina = formatCurrency(data[0].nomina);
        const utilidad = formatCurrency(data[0].utilidad);
        doc.setFontSize(11)
        doc.setFont("Courier", "");
        doc.text('TOTAL VENTAS:', 10, 80);
        doc.text(total_ventas, 67, 80);
        doc.text('TOTAL COMPRAS:', 10, 90);
        doc.text(total_compras, 67, 90);
        doc.text('TOTAL GASTOS:', 10, 100);
        doc.text(total_gastos, 67, 100);
        doc.text('TOTAL NOMINA:', 10, 110);
        doc.text(total_nomina, 67, 110);
        doc.text('UTILIDAD:', 10, 120);
        doc.text(utilidad, 67, 120);
        doc.text('=================================================', 3, 127);
        doc.output('dataurlnewwindow');
      }
    });
  }
}
