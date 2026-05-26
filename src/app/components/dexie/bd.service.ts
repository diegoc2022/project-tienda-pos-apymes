import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface Productos {
  codProd: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  existencia: number;
}

export interface Vinculos {
  codigoInicial: string;
  codigoVinculo: string;

}

@Injectable({
  providedIn: 'root',
})
export class BdService extends Dexie {
  productos!: Table<Productos, string>;
  vinculos!: Table<Vinculos, [string, string]>;

  constructor() {
    super('POS_DB');

    this.version(1).stores({
      productos: '&codProd, descripcion',
      vinculos: '&[codigoInicial+codigoVinculo], codigoInicial, codigoVinculo'
    });

    this.productos = this.table('productos');
    this.vinculos = this.table('vinculos');
  }

  // 🚀 FLUJO PRINCIPAL: SCAN → PRODUCTOS RELACIONADOS
  async obtenerProductosDesdeScan(codigoInicial: string): Promise<Productos[]> {

    const vinculos = await this.vinculos
      .where('codigoInicial')
      .equals(codigoInicial)
      .toArray();

    // Si no hay vínculos, devolver producto directo
    if (vinculos.length === 0) {
      const producto = await this.productos.get(codigoInicial);
      return producto ? [producto] : [];
    }

    const codigos = vinculos.map(v => v.codigoVinculo);

    return await this.productos
      .where('codProd')
      .anyOf(codigos)
      .toArray();
  }

  // 🔗 VALIDAR EXISTENCIA DE VÍNCULO (usa PK compuesta)
  async existeVinculo(codigoInicial: string, codigoVinculo: string) {
    return await this.vinculos.get([codigoInicial, codigoVinculo]);
  }

  // 🔥 CREAR VÍNCULO CON VALIDACIÓN DE INTEGRIDAD
  async crearVinculo(codigoInicial: string, codigoVinculo: string, tipo?: string) {

    // validar que el producto vinculado exista
    const producto = await this.productos.get(codigoVinculo);

    if (!producto) {
      throw new Error('El producto vinculado no existe');
    }

    // validar que no exista el vínculo
    const existe = await this.existeVinculo(codigoInicial, codigoVinculo);

    if (existe) {
      console.warn('El vínculo ya existe');
      return;
    }

    // insertar vínculo
    await this.vinculos.add({
      codigoInicial,
      codigoVinculo
    });
  }

  // 🗑️ ELIMINAR PRODUCTO Y LIMPIAR RELACIONES
  async eliminarProducto(codProd: string) {
    await this.transaction('rw', this.productos, this.vinculos, async () => {

      await this.productos.delete(codProd);

      await this.vinculos
        .where('codigoInicial')
        .equals(codProd)
        .delete();

      await this.vinculos
        .where('codigoVinculo')
        .equals(codProd)
        .delete();
    });
  }
}
