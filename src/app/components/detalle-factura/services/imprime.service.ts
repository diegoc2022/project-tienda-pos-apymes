import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { VentasSerivice } from '../../form-ventas/services/ventas.serivice';

@Injectable({
  providedIn: 'root',
})
export class ImprimeService {
  dataProductos: any[] = [];
  subTotal: number = 0;


  constructor(
    private ventas: VentasSerivice
  ) { }

  ngOnInit(): void {

  }


  funct_imprime_facturas(id: any) {
    let numFactura = id;

    this.ventas.funct_retorna_ventas_facturas(numFactura).subscribe({
      next: (data: any) => {

        const objData = data;

        // ✅ Validaciones básicas
        if (!objData || !Array.isArray(objData) || objData.length === 0) {
          console.error('No hay datos para imprimir', objData);
          return;
        }

        let yPos = 97;
        const width = 100;
        const height = 10000;

        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [width, height]
        });

        // ✅ Encabezado
        doc.setFontSize(14);
        doc.setFont("Courier", "Bold");
        doc.text('Minimercado Casa Blanca', 15, 10);
        doc.setFontSize(9)
        doc.text('JUAN CAMILO PANESO', 30, 15);
        doc.setFontSize(10)
        doc.text('NIT: 1000781521', 32, 21);
        doc.text('CALLE 57EB # 22B - 102', 25, 26);
        doc.text('TEL: 3217532446', 32, 31);
        doc.setFont("Courier", " ");
        doc.text('=======================================================', 3, 40);

        doc.setFontSize(10);
        doc.setFont("Courier", "Bold");

        if (objData[0]?.origen_venta === 'Ventas-1') {
          doc.text('NUM TICKET: ' + objData[0].factura, 5, 47);
        }

        doc.text('FECHA: ' + objData[0].fecha_registro, 54, 47);

        doc.setFont("Courier", "normal");
        doc.text('==================================================', 3, 54);

        // Cliente
        doc.text('CLIENTE: CONSUMIDOR FINAL', 5, 60);
        doc.text('CÉDULA: 1234', 5, 65);
        doc.text('DIRECCIÓN:', 5, 70);
        doc.text('TELÉFONO:', 5, 75);

        doc.text('=================================================', 3, 83);

        // Encabezado tabla
        doc.setFontSize(11);
        doc.setFont("Courier", "Bold");
        doc.text("ARTICULOS", 5, 90);
        doc.text("CANT", 55, 90);
        doc.text("MONTO", 75, 90);

        // ✅ Inicializar subtotal
        this.subTotal = 0;

        if (objData[0]?.origen_venta === 'Ventas-1') {

          objData.forEach((item: any) => {
            this.subTotal += Number(item.subtotal || 0);

            doc.setFontSize(10);
            doc.setFont("Courier", "Bold");

            doc.text((item.descripcion || '').slice(0, 25), 5, yPos);
            doc.text(String(item.cantidad || 0), 60, yPos);
            doc.text('$' + Number(item.subtotal || 0).toLocaleString(), 75, yPos);

            yPos += 6;
          });
        }

        doc.text('=================================================', 3, yPos);

        // ✅ Formateo seguro
        const formatCurrency = (value: any, currencySymbol = "$") => {
          return currencySymbol + Number(value || 0).toLocaleString();
        };

        const valorFormateado = formatCurrency(this.subTotal);

        doc.setFontSize(11);
        doc.setFont("Courier", "Bold");

        doc.text('SUBTOTAL:', 4, yPos + 5);
        doc.text(valorFormateado, 72, yPos + 5);

        doc.text('EFECTIVO:', 4, yPos + 10);
        doc.text('$0', 72, yPos + 10);

        doc.text('CAMBIO:', 4, yPos + 15);
        doc.text('$0', 72, yPos + 15);

        doc.text('=================================================', 3, yPos + 22);

        doc.setFontSize(11);
        doc.setFont("Courier", "Bold");
        doc.text('¡Gracias por su compra!', 25, yPos + 35);

        // ✅ Evitar bloqueo de popup
        // Mostrar en pantalla en lugar de descargar
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');
      },

      error: (err: any) => {
        console.error('Error al obtener datos de la factura:', err);
      }
    });
  }

}
