import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlatilloService } from '../../services/platillo.service';
import { Platillo } from '../../models/platillo.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
}



@Component({
  selector: 'app-platillos',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './platillos.component.html',
  styleUrl: './platillos.component.css'
})
export class PlatillosComponent implements OnInit {

  toasts: Toast[] = [];
  private toastCounter = 0;

  platillos: Platillo[] = [];
  subcategorias: any[] = [];

  imagenSeleccionada: File | null = null;
  previewImagen: string | null = null;

  nuevoPlatillo: Platillo = {
    nombre: '',
    descripcion: '',
    imagen: '',
    id_subcategoria: 0,
    activo: true
  };

  editando = false;
  idEditando: number | null = null;

  filtro: string = '';
  mostrarDrawer = false;

  constructor(private platilloService: PlatilloService) { }

  mostrarToast(mensaje: string, tipo: Toast['tipo']) {
    const id = this.toastCounter++;
    const duracion = 2000;

    this.toasts.push({ id, mensaje, tipo });

    setTimeout(() => {
      this.cerrarToast(id);
    }, duracion);
  }


  cerrarToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  
  ngOnInit() {
    this.cargarPlatillos();
    this.cargarSubcategorias();
  }

  /* ===============================
     CARGAS
  =============================== */

  cargarPlatillos() {
    this.platilloService.obtenerTodos().subscribe(data => {
      this.platillos = data;
    });
  }

  cargarSubcategorias() {
    this.platilloService.obtenerSubcategorias().subscribe(data => {
      this.subcategorias = data;
    });
  }

  /* ===============================
     IMAGEN
  =============================== */

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.imagenSeleccionada = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImagen = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /* ===============================
     GUARDAR
  =============================== */

  guardar() {

    const formData = new FormData();

    formData.append('nombre', this.nuevoPlatillo.nombre);
    formData.append('descripcion', this.nuevoPlatillo.descripcion);
    formData.append('id_subcategoria', this.nuevoPlatillo.id_subcategoria.toString());
    formData.append('activo', this.nuevoPlatillo.activo ? 'true' : 'false');

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    if (this.editando && this.idEditando) {

      this.platilloService.actualizar(this.idEditando, formData)
        .subscribe(() => {
          this.mostrarToast('Platillo actualizado correctamente', 'info');
          this.cerrarDrawer();
          this.cargarPlatillos();
          this.resetFormulario();
        });

    } else {

      this.platilloService.crear(formData)
        .subscribe(() => {
          this.mostrarToast('Platillo creado correctamente', 'success');
          this.cerrarDrawer();
          this.cargarPlatillos();
          this.resetFormulario();
        });

    }
  }

  /* ===============================
     EDITAR
  =============================== */

  editar(platillo: Platillo) {

    this.nuevoPlatillo = { ...platillo };

    // Mostrar imagen actual como preview
    if (platillo.imagen) {
      this.previewImagen = 'http://localhost:3000' + platillo.imagen;
    }

    this.editando = true;
    this.idEditando = platillo.id_platillo!;
    this.mostrarDrawer = true;
  }

  /* ===============================
     ELIMINAR
  =============================== */

  eliminar(id: number) {
    this.platilloService.eliminar(id)
      .subscribe(() => this.cargarPlatillos());
    this.mostrarToast('Platillo eliminado correctamente', 'warning');
  }

  /* ===============================
     UTILIDADES
  =============================== */

  get platillosFiltrados() {
    return this.platillos.filter(p =>
      p.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  abrirDrawer() {
    this.mostrarDrawer = true;
  }

  cerrarDrawer() {
    this.mostrarDrawer = false;
    this.resetFormulario();
  }

  resetFormulario() {
    this.nuevoPlatillo = {
      nombre: '',
      descripcion: '',
      imagen: '',
      id_subcategoria: 0,
      activo: true
    };

    this.imagenSeleccionada = null;
    this.previewImagen = null;

    this.editando = false;
    this.idEditando = null;
  }

  exportarPDFPlatillo(p: Platillo, incluirPrecioVenta: boolean = true) {
    this.platilloService.obtenerReportePlatillo(p.id_platillo!)
      .subscribe((data) => {
        this.generarPDF(data, incluirPrecioVenta);
      });
  }

  generarPDF(data: any, incluirPrecioVenta: boolean = true) {

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    const logo = new Image();
    logo.src = window.location.origin + '/logoposada.png';

    logo.onload = () => {

      // ===============================
      // 📄 PÁGINA 1
      // ===============================

      doc.addImage(logo, 'PNG', pageWidth / 2 - 25, y, 50, 25);
      y += 35;

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(
        data.platillo.nombre.toUpperCase(),
        pageWidth / 2,
        y,
        { align: 'center' }
      );

      y += 15;

      const continuarContenido = () => {

        // 🔥 PROCEDIMIENTO PLATILLO PADRE
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PROCEDIMIENTO:', 20, y);
        y += 8;

        doc.setFont('helvetica', 'normal');

        if (data.platillo.descripcion) {
          const texto = doc.splitTextToSize(
            data.platillo.descripcion,
            pageWidth - 40
          );
          doc.text(texto, 20, y);
          y += texto.length * 6;
        }

        // 🔥 SUB-PLATILLOS
        if (data.componentes?.length) {

          data.componentes.forEach((c: any) => {

            y += 10;

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(c.nombre.toUpperCase(), 20, y);
            y += 8;

            doc.setFontSize(12);
            doc.text('PROCEDIMIENTO:', 20, y);
            y += 8;

            doc.setFont('helvetica', 'normal');

            if (c.descripcion) {
              const texto = doc.splitTextToSize(
                c.descripcion,
                pageWidth - 40
              );
              doc.text(texto, 20, y);
              y += texto.length * 6;
            }
          });
        }

        // ===============================
        // 📄 PÁGINA 2 - TABLA EXCEL
        // ===============================

        doc.addPage();

        const startTableY = 55;

        // 🔹 TITULO CENTRADO
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(
          data.platillo.nombre.toUpperCase(),
          pageWidth / 2,
          30,
          { align: 'center' }
        );
        const body = [

          // 🔥 INGREDIENTES
          ...data.ingredientes.map((i: any) => [
            i.ingrediente,
            `$ ${Number(i.costo_presentacion).toFixed(2)}`,
            Number(i.cantidad_presentacion).toFixed(2),
            i.unidad_base || '',
            Number(i.cantidad_receta).toFixed(2),
            i.unidad_usada || '',
            `$ ${Number(i.costo_en_receta).toFixed(2)}`
          ]),

          // 🔥 PLATILLOS COMPONENTES (NO EL MISMO)
          ...(data.componentes || [])
            .filter((c: any) => c.id_platillo_hijo !== data.platillo.id_platillo)
            .map((c: any) => [
              c.nombre,
              `$ ${Number(c.costo_total).toFixed(2)}`,
              Number(c.cantidad).toFixed(2),
              'pza',   // 👈 ahora en minúscula
              Number(c.cantidad).toFixed(2),
              'pza',
              `$ ${Number(c.costo_en_combo).toFixed(2)}`
            ])

        ];
        autoTable(doc, {
          startY: startTableY,
          theme: 'grid',

          // 🔥 TABLA OCUPA TODO EL ANCHO CON MARGEN IGUAL
          margin: { left: 20, right: 20 },
          tableWidth: pageWidth - 40,

          head: [
            // 🔥 FILA 1 → INSUMOS y TOTAL COSTO (mitad y mitad real)
            [
              {
                content: 'INSUMOS',
                colSpan: 3,
                styles: { halign: 'left', fontStyle: 'bold' }
              },
              {
                content: `TOTAL COSTO  $ ${data.platillo.costo_total}`,
                colSpan: 4,
                styles: { halign: 'right', fontStyle: 'bold' }
              }
            ],

            // 🔥 FILA 2 → ENCABEZADO AGRUPADO
            [
              { content: 'INGREDIENTE', rowSpan: 2 },
              { content: 'PRESENTACIÓN', colSpan: 3, styles: { halign: 'center' } },
              { content: 'UTILIZADA EN RECETA', colSpan: 2, styles: { halign: 'center' } },
              { content: 'COSTO EN RECETA', rowSpan: 2 }
            ],

            // 🔥 FILA 3 → SUBENCABEZADO
            [
              'COSTO',
              'CANTIDAD',
              'UNIDAD',
              'CANTIDAD',
              'UNIDAD'
            ]
          ],

          body: body,

          styles: {
            fontSize: 9,
            cellPadding: 3,
            valign: 'middle',
            lineColor: [0, 0, 0],
            lineWidth: 0.3
          },

          headStyles: {
            fillColor: [255, 204, 0],
            textColor: 0,
            fontStyle: 'bold'
          },

          // 🔥 DISTRIBUCIÓN AUTOMÁTICA PARA QUE LLENE TODO
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'right' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' },
            6: { halign: 'right' }
          }
        });


        // PRECIO VENTA OPCIONAL
        if (incluirPrecioVenta && data.platillo.precio_venta) {

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(
            `PRECIO VENTA: $ ${Number(data.platillo.precio_venta).toFixed(2)}`,
            pageWidth - 20,
            (doc as any).lastAutoTable.finalY + 15,
            { align: 'right' }
          );

        }

        doc.save(`${data.platillo.nombre}.pdf`);
      };

      // 🔥 IMAGEN DEL PLATILLO
      if (data.platillo.imagen) {

        const imgPlatillo = new Image();
        imgPlatillo.src =
          'http://localhost:3000' +
          data.platillo.imagen +
          '?t=' + new Date().getTime();

        imgPlatillo.onload = () => {

          const imgWidth = 100;
          const imgHeight = 70;

          doc.addImage(
            imgPlatillo,
            'JPEG',
            pageWidth / 2 - imgWidth / 2,
            y,
            imgWidth,
            imgHeight
          );

          y += imgHeight + 15;

          continuarContenido();
        };

        imgPlatillo.onerror = () => {
          continuarContenido();
        };

      } else {
        continuarContenido();
      }
    };
  }





  exportarRecetarioCompleto() {
    this.platilloService.obtenerRecetarioCompleto()
      .subscribe((data) => {
        this.generarRecetarioPDF(data);
        console.log('Recetario completo generado:', data);
      });
  }


  generarRecetarioPDF(data: any[]) {

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 🔥 ORDENAR POR CATEGORÍA
    data.sort((a, b) => {
      if (a.platillo.categoria === b.platillo.categoria) {
        return a.platillo.nombre.localeCompare(b.platillo.nombre);
      }
      return a.platillo.categoria.localeCompare(b.platillo.categoria);
    });

    // =========================
    // 🔥 PORTADA CON LOGO
    // =========================

    const logo = new Image();
    logo.src = window.location.origin + '/logoposada.png';

    logo.onload = () => {

      const pxToMm = 0.264583;

      const imgWidth = 206 * pxToMm;
      const imgHeight = 100 * pxToMm;

      doc.addImage(
        logo,
        'PNG',
        pageWidth / 2 - imgWidth / 2,
        20,
        imgWidth,
        imgHeight
      );
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('RECETARIO GENERAL', pageWidth / 2, 70, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Generado el ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        80,
        { align: 'center' }
      );

      // =========================
      // 🔥 ÍNDICE
      // =========================

      doc.addPage();
      const paginaIndice = doc.getCurrentPageInfo().pageNumber;

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('ÍNDICE', pageWidth / 2, 20, { align: 'center' });

      const indice: {
        categoria: string,
        nombre: string,
        pagina: number
      }[] = [];

      let categoriaActual = '';

      // =========================
      // 🔥 TU LÓGICA ORIGINAL
      // =========================

      const procesarPlatillo = (index: number) => {

        if (index >= data.length) {

          // 🔥 ESCRIBIR ÍNDICE
          doc.setPage(paginaIndice);

          let yIndice = 35;
          let cat = '';

          doc.setFontSize(12);

          indice.forEach(item => {

            if (item.categoria !== cat) {
              cat = item.categoria;
              doc.setFont('helvetica', 'bold');
              doc.text(cat.toUpperCase(), 20, yIndice);
              yIndice += 8;
              doc.setFont('helvetica', 'normal');
            }

            const texto = item.nombre;
            const textoWidth = doc.getTextWidth(texto);
            const paginaTexto = `${item.pagina}`;

            const margenDerecho = 20;
            const inicioTexto = 30;

            const paginaWidth = doc.getTextWidth(paginaTexto);

            // Posición real donde empieza el número
            const xNumero = pageWidth - margenDerecho - paginaWidth;

            // Espacio real disponible para puntos
            const espacioDisponible = xNumero - (inicioTexto + textoWidth);

            const anchoPunto = doc.getTextWidth('.');
            const cantidadPuntos = Math.floor(espacioDisponible / anchoPunto);
            const puntos = '.'.repeat(cantidadPuntos > 0 ? cantidadPuntos : 0);

            doc.text(texto, inicioTexto, yIndice);
            doc.text(puntos, inicioTexto + textoWidth + 2, yIndice);

            // Dibujar número EXACTAMENTE en xNumero
            doc.text(paginaTexto, xNumero + 2, yIndice);

            yIndice += 8;
          });

          // 🔥 NUMERACIÓN SIMPLE ABAJO DERECHA
          const totalPages = doc.getNumberOfPages();

          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);

            if (i === 1) continue; // portada sin número

            doc.setFontSize(10);
            doc.text(
              `${i - 1}`,
              pageWidth - 15,
              pageHeight - 10
            );
          }

          doc.save('RECETARIO_COMPLETO.pdf');
          return;
        }

        const item = data[index];
        let y = 20;

        // 🔥 SEPARADOR POR CATEGORÍA
        if (item.platillo.categoria !== categoriaActual) {

          categoriaActual = item.platillo.categoria;

          doc.addPage();
          doc.setFontSize(28);
          doc.setFont('helvetica', 'bold');
          doc.text(
            categoriaActual.toUpperCase(),
            pageWidth / 2,
            pageHeight / 2,
            { align: 'center' }
          );
        }

        // 🔥 SOLO AGREGAR PÁGINA SI NO ES LA PRIMERA DESPUÉS DEL SEPARADOR
        doc.addPage();

        const paginaInicio = doc.getCurrentPageInfo().pageNumber;

        indice.push({
          categoria: item.platillo.categoria,
          nombre: item.platillo.nombre,
          pagina: paginaInicio - 1
        });

        // =========================
        // 🔹 DESDE AQUÍ NO SE TOCÓ NADA
        // =========================

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(
          item.platillo.nombre.toUpperCase(),
          pageWidth / 2,
          y,
          { align: 'center' }
        );

        y += 15;

        const continuarContenido = () => {

          if (item.platillo.descripcion) {

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('PROCEDIMIENTO:', 20, y);
            y += 8;

            doc.setFont('helvetica', 'normal');

            const texto = doc.splitTextToSize(
              item.platillo.descripcion,
              pageWidth - 40
            );

            doc.text(texto, 20, y);
            y += texto.length * 6 + 10;
          }

          if (item.componentes?.length) {

            item.componentes.forEach((c: any) => {

              doc.setFontSize(13);
              doc.setFont('helvetica', 'bold');
              doc.text(c.nombre.toUpperCase(), 20, y);
              y += 8;

              if (c.descripcion) {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');

                const textoComp = doc.splitTextToSize(
                  c.descripcion,
                  pageWidth - 40
                );

                doc.text(textoComp, 20, y);
                y += textoComp.length * 6 + 8;
              }
            });
          }

          doc.addPage();

          // 🔥 TU TABLA EXACTA
          const body = [
            ...item.ingredientes.map((i: any) => [
              i.ingrediente,
              `$ ${Number(i.costo_presentacion).toFixed(2)}`,
              Number(i.cantidad_presentacion).toFixed(2),
              i.unidad_base || '',
              Number(i.cantidad_receta).toFixed(2),
              i.unidad_usada || '',
              `$ ${Number(i.costo_en_receta).toFixed(2)}`
            ]),
            ...(item.componentes || [])
              .filter((c: any) => c.id_platillo_hijo !== item.platillo.id_platillo)
              .map((c: any) => [
                c.nombre,
                `$ ${Number(c.costo_total).toFixed(2)}`,
                Number(c.cantidad).toFixed(2),
                'pza',
                Number(c.cantidad).toFixed(2),
                'pza',
                `$ ${Number(c.costo_en_combo).toFixed(2)}`
              ])
          ];

          autoTable(doc, {
            startY: 55,
            theme: 'grid',
            margin: { left: 20, right: 20 },
            tableWidth: pageWidth - 40,
            head: [
              [
                {
                  content: 'INSUMOS',
                  colSpan: 3,
                  styles: { halign: 'left', fontStyle: 'bold' }
                },
                {
                  content: `TOTAL COSTO  $ ${Number(item.platillo.costo_total).toFixed(2)}`,
                  colSpan: 4,
                  styles: { halign: 'right', fontStyle: 'bold' }
                }
              ],
              [
                { content: 'INGREDIENTE', rowSpan: 2 },
                { content: 'PRESENTACIÓN', colSpan: 3, styles: { halign: 'center' } },
                { content: 'UTILIZADA EN RECETA', colSpan: 2, styles: { halign: 'center' } },
                { content: 'COSTO EN RECETA', rowSpan: 2 }
              ],
              ['COSTO', 'CANTIDAD', 'UNIDAD', 'CANTIDAD', 'UNIDAD']
            ],
            body: body,
            styles: {
              fontSize: 9,
              cellPadding: 3,
              valign: 'middle',
              lineColor: [0, 0, 0],
              lineWidth: 0.3
            },
            headStyles: {
              fillColor: [255, 204, 0],
              textColor: 0,
              fontStyle: 'bold'
            }
          });

          procesarPlatillo(index + 1);
        };

        if (item.platillo.imagen) {

          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = 'http://localhost:3000' + item.platillo.imagen;

          img.onload = () => {
            doc.addImage(img, 'JPEG', pageWidth / 2 - 40, y, 80, 50);
            y += 60;
            continuarContenido();
          };

          img.onerror = () => continuarContenido();

        } else {
          continuarContenido();
        }
      };

      procesarPlatillo(0);
    };
  }

}




