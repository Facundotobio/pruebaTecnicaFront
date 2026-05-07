export interface Customer {
  customerId: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  fechaCreacion: string;
}

export interface InvoiceItem {
  invoiceItemId?: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Invoice {
  invoiceId?: number;
  customerId: number;
  numero?: string;
  fecha?: string;
  total: number;
  items: InvoiceItem[];
  customerNombre?: string;
  customerEmail?: string;
}