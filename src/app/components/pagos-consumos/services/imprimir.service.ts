import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { PagosConsumosServices } from './pagos-consumos.services';

@Injectable({
  providedIn: 'root',
})
export class ImprimirService {
  subTotal: number = 0;

  constructor(
    private ventas_x_c: PagosConsumosServices
  ) { }

  funct_imprime_factura_detalle(data: any, pagos: any, monto_restante: any) {
    this.ventas_x_c.funct_consulta_ventas_x_cliente(data).subscribe({
      next: (data: any) => {
        const obj = JSON.stringify(data);
        const objData = JSON.parse(obj);
        let yPos = 75;
        const margin = 10;
        const width = 100;
        const height = 5000;
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [width, height]
        });
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(14);
        doc.setFont("Courier", "Bold");
        doc.text('Variedades Mariangel', 15, 10);
        doc.setFontSize(9)
        doc.text('RAMIRO OSORIO', 30, 16);
        doc.setFontSize(10)
        doc.text('NIT: 71994132', 30, 21);
        doc.text('CALLE 57DD # 22B - 04', 20, 26);
        doc.text('TEL: 6043874825 - 3146596015', 12, 31);
        doc.setFont("Courier", " ");
        doc.text('==================================================', 3, 40);
        doc.setFont("Courier", " ");
        doc.text('CLIENTE: ?CONSUMIDOR FINAL', 5, 45);
        doc.text('CODIGO: ' + objData[0].codigo_cliente_v, 5, 50);
        doc.text('ID VENTAS: ' + objData[0].codigo_venta, 5, 55);
        doc.text('FECHA:', 5, 60);
        doc.setFont("Courier", " ");
        doc.text('=================================================', 3, 65);
        doc.setFontSize(11)
        doc.setFont("Courier", "Bold");
        doc.text("ARTICULOS", 5, 70);
        doc.text("CANT", 55, 70);
        doc.text("MONTO", 75, 70);
        doc.setFont("Courier", " ");
        this.subTotal = 0;
        objData.forEach((item: any, index: any) => {
          this.subTotal += item.subtotal;
          doc.setFontSize(10);
          doc.setFont("Courier", " ");
          doc.text(item.descripcion.slice(0, 25), 5, yPos);
          doc.text(item.cantidad.toString(), 60, yPos);
          doc.text('$' + item.subtotal.toString(), 75, yPos);
          yPos += 6;
        });
        doc.setFont("Courier", " ");
        doc.text('=================================================', 3, yPos);
        function formatCurrency(value: any, currencySymbol = "$") {
          return currencySymbol + parseInt(value).toLocaleString();
        }
        const valorFormateado = formatCurrency(this.subTotal);
        const pagos_r = formatCurrency(pagos);
        const saldo_r = formatCurrency(monto_restante);
        doc.setFontSize(11)
        doc.setFont("Courier", "Bold");
        doc.text('CONSUMO:', 4, yPos + 5);
        doc.text(valorFormateado, 65, yPos + 5);
        doc.text('PAGOS REALIZADOS:', 4, yPos + 10);
        doc.text(`${pagos_r}`, 65, yPos + 10);
        doc.text('DEBE:', 4, yPos + 15);
        doc.text(`${saldo_r}`, 65, yPos + 15);
        doc.setFont("Courier", " ");
        doc.text('=================================================', 3, yPos + 22);
        doc.setFontSize(11)
        doc.setFont("Courier", "Bold");
        doc.text('¡Gracias por su compra!', 25, yPos + 35);
        doc.text('.', 25, yPos + 50);
        doc.output('dataurlnewwindow');
      }
    })
  }
}
