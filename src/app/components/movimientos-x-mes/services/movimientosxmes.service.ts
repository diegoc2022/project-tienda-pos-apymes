import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class MovimientosxmesService {
  constructor() { }

  funct_imprime_movimientos_s(data: any) {
    const width = 100;
    const height = 150;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [width, height]
    });

    doc.setFontSize(14);
    doc.setFont("Courier", "Bold");
    doc.text('Variedades Mariangel', 17, 10);
    doc.setFontSize(9)
    doc.text('RAMIRO OSORIO', 35, 16);
    doc.setFontSize(10)
    doc.text('NIT: 71994132', 35, 21);
    doc.text('CALLE 57DD # 22B - 04', 30, 26);
    doc.text('TEL: 6043874825 - 3146596015', 20, 31);
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
}
