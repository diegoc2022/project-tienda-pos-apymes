import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { InventarioService } from '../inventario/services/inventario.service';
import { EncabezadosServices } from '../encabezados/encabezados';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  dataProductos: any[] = [];
  subTotal: number = 0;


  constructor(
    private invent: InventarioService,
    private enc: EncabezadosServices
  ) { }


  funct_descarga_inventario(id: any, tipo: any) {
    this.invent.funct_retorna_inventario_x_id(id, tipo).subscribe({
      next: (data: any) => {
        const objData = data;

        if (!objData || !Array.isArray(objData) || objData.length === 0) {
          console.error('No hay datos para imprimir', objData);
          return;
        }

        this.enc.funt_retorna_razon_social_encabezado().subscribe({
          next: (data2: any) => {

            let yPos = 75;
            const doc = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: [216, 279]
            });
            const img = new Image();
            img.src = 'assets/img/img3.png'
            const pageHeight = doc.internal.pageSize.getHeight();
            // ✅ Encabezado
            function funct_crea_encabezado() {
              doc.addImage(img, 'PNG', 10, 3, 35, 32);
              doc.setFontSize(14);
              doc.setFont("Courier", "Bold");
              doc.text(data2[0].razon_social, 200, 10);
              doc.setFontSize(10)
              doc.text(data2[0].direcion, 208, 21);
              doc.setFontSize(10)
              doc.text('NIT: ' + data2[0].nit, 215, 15);
              doc.setFontSize(10)
              doc.text('TEL: ' + data2[0].telefono, 215, 27);
              doc.setFont("Courier", " ");
              doc.text('==========================================================================================================================', 5, 40);
              doc.setFontSize(14);
              doc.text('Fecha inventario:', 5, 50);
              doc.setFontSize(12);
              doc.text(data[0].created_at, 42, 50);
              doc.setFontSize(14);
              doc.text('Id inventario:', 110, 50);
              doc.setFontSize(12);
              doc.text(String(data[0].id_inventario), 140, 50);
              doc.setFontSize(14);
              doc.text('Colaborador:', 160, 50);
              doc.setFontSize(12);
              doc.text(String(data[0].vendedor), 190, 50);
              doc.text('=====================================================================================================', 5, 60);

              // Encabezado tabla
              doc.setFontSize(12);
              doc.setFont("Courier", "Bold");
              doc.text("Código", 5, 70);
              doc.text("Nombre", 50, 70);
              doc.text("Id tipo", 100, 70);
              doc.text("Nombre tipo", 130, 70);
              doc.text("Stock antes", 200, 70);
              doc.text("Stock despues", 235, 70);
            }
            funct_crea_encabezado();

            data.map((resp: any) => {
              doc.text(resp.codprod, 5, yPos);
              doc.text('Prueba', 50, yPos);
              doc.text(resp.id_tipo, 100, yPos);
              doc.text(resp.nombre_tipo, 130, yPos);
              doc.text(String(resp.stock_actual), 200, yPos);
              doc.text(String(resp.stock_despues), 235, yPos);
              yPos += 7;
              if (yPos > pageHeight - 20) {
                doc.addPage();
                funct_crea_encabezado();
                yPos = 75; // reiniciar posición en la nueva página 
              }

            })
            const blobUrl = doc.output('bloburl');
            window.open(blobUrl, '_blank');
          }
        });
      },

      error: (err: any) => {
        console.error('Error al obtener datos de la factura:', err);
      }
    });
  }

}
