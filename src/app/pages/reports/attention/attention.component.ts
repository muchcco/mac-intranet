import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AttentionService } from './services/attention.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LoadingService } from './services/loading.service';
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-attention',
  templateUrl: './attention.component.html',
  styleUrls: ['./attention.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AttentionComponent implements OnInit {

  fecha_inicio: string = '';
  fecha_fin: string = '';
  nom_mac: string = '';
  servicio: number = 0;
  resultados: any[] = [];

  centrosMac: any[] = [];
  servicios: any[] = [];

  //paginamos 
  page: number = 1;
  pageSize: number = 20;

  isLoading: boolean = false;
  loadPercentage: number = 0;
  loadingPercentage: number = 0;

  constructor(private attentionService: AttentionService, public loadingService: LoadingService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.loadFormDetails();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    this.fecha_inicio = this.formatDate(yesterday);
    this.fecha_fin = this.formatDate(yesterday);
  }

  formatDate(date: Date): string {  
    return date.toISOString().substring(0, 10);
  }

  loadFormDetails(): void {
    this.attentionService.getFormDetails().subscribe(data => {
      if (data.status) {
        // console.log(data.servicio)
        this.centrosMac = data.nom_mac;
        this.servicios = data.servicio;
      }
    });
  }

  buscar(): void {

    if(!this.servicio){
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe seleccionar una entidad antes de buscar.'
      });
      return;
    }

    this.loadingService.show();
    this.spinner.show();

    const totalSteps = 100; // Número total de pasos para la carga
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < totalSteps) {
        currentStep++;
        this.loadingPercentage = currentStep;
      } else {
        clearInterval(interval);
      }
    }, 50); // Intervalo de tiempo para actualizar el porcentaje de carga

    this.attentionService.getAttentionData(this.fecha_inicio, this.fecha_fin, this.nom_mac, this.servicio)
      .subscribe(data => {
        this.resultados = data.data;
        console.log(this.resultados);
        this.loadingService.hide();
        this.spinner.hide();
        clearInterval(interval);
        this.loadingPercentage = 0;

        if(this.resultados.length === 0){
          Swal.fire({
            icon: 'warning',
            title: 'Sin resultados',
            text: 'No se encontrarón resultados para la búsqueda.'
        });
        }
      },
      (error) => {
        console.error('Error al buscar atenciones:', error);
        this.loadingService.hide();
        this.spinner.hide();
        clearInterval(interval);
        this.loadingPercentage = 0;

        if (error.status === 500) {
            Swal.fire({
                icon: 'info',
                title: 'Tamaño de búsqueda',
                text: 'El tamaño de carga de la búsqueda es demasiado grande. Intente con un rango de fechas más pequeño.'
            });
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Tamaño de búsqueda',
                text: 'El tamaño de carga de la búsqueda es demasiado grande. Intente con un rango de fechas más pequeño.'
            });
        }
      });
  }

  limpiar(): void {
    this.fecha_inicio = '';
    this.fecha_fin = '';
    this.nom_mac = '';
    this.servicio = 0;
    this.resultados = [];
  }

  exportToExcel(): void {

    this.loadingService.show();
    this.spinner.show();

    const totalSteps = 100; // Número total de pasos para la carga
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < totalSteps) {
        currentStep++;
        this.loadingPercentage = currentStep;
      } else {
        clearInterval(interval);
      }
    }, 50); // Intervalo de tiempo para actualizar el porcentaje de carga


    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(this.resultados, { header: ['Nom_mac', 'nom_ent', 'Hra_llg'], skipHeader: true });

    // Insertar encabezado complejo
    XLSX.utils.sheet_add_aoa(worksheet, [
      ['','', 'REPORTE DE ATENCIONES', '', '', '', '', '', '', '', '', 'TIPO', 'REPORTERIA', ''],
      ['', '', '', '', '', '', '', '', '', '','', 'Versión', '1.2.0', ''],
      ['','','Centro MAC', '', '', 'Entidad', '', '', 'Fecha:', `De: ${this.fecha_inicio} hasta ${this.fecha_fin}`, '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Centro MAC', 'Entidad', 'Hora Llegada', 'Hora Llamado', 'Tiempo Espera', 'Hora Inicio', 'Tiempo Atención', 'Fin de Atención', 'Tiempo Total', 'Número de Ticket', 'Estado Atención', 'Fecha de Atención', 'Canal de Atención', 'Tipo de Atención']
    ], { origin: 'A1' });

    // Ajustar estilo de las columnas
    const wscols = [
      { wch: 20 }, // Centro MAC
      { wch: 30 }, // Entidad
      { wch: 20 }, // Hora Llegada
      { wch: 20 }, // Hora Llamado
      { wch: 20 }, // Tiempo Espera
      { wch: 20 }, // Hora Inicio
      { wch: 20 }, // Tiempo Atención
      { wch: 20 }, // Fin de Atención
      { wch: 20 }, // Tiempo Total
      { wch: 20 }, // Número de Ticket
      { wch: 20 }, // Estado Atención
      { wch: 20 }, // Fecha de Atención
      { wch: 20 }, // Canal de Atención
      { wch: 20 }  // Tipo de Atención
    ];
    worksheet['!cols'] = wscols;

    // Fusionar celdas para el encabezado complejo
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 2, c: 1 } }, // Fusionar para la celda de imagen (vacía por ahora)
      { s: { r: 0, c: 2 }, e: { r: 1, c: 10 } }, // Fusionar para "REPORTE DE ATENCIONES"
      { s: { r: 0, c: 11 }, e: { r: 0, c: 11 } }, // Fusionar para "TIPO"
      { s: { r: 0, c: 12 }, e: { r: 0, c: 13 } }, // Fusionar para "REPORTERIA"
      { s: { r: 1, c: 11 }, e: { r: 1, c: 11 } }, // Fusionar para "Versión"
      { s: { r: 1, c: 12 }, e: { r: 1, c: 13 } }, // Fusionar para "1.2.0"
      { s: { r: 2, c: 2 }, e: { r: 2, c: 2 } }, // Fusionar para "Centro MAC"
      { s: { r: 2, c: 3 }, e: { r: 2, c: 4 } }, // Fusionar para "RESULTADOS DEL CENTRO MAC"
      { s: { r: 2, c: 5 }, e: { r: 2, c: 5 } }, // Fusionar para "Entidad"
      { s: { r: 2, c: 6 }, e: { r: 2, c: 7 } }, // Fusionar para RESULTADOS
      { s: { r: 2, c: 8 }, e: { r: 2, c: 8 } }, // Fusionar para "Fecha"
      { s: { r: 2, c: 9 }, e: { r: 2, c: 13 } } // Fusionar para "Fecha"
    ];

    

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Atenciones');
    
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'reporte_atencion.xlsx');

    this.loadingService.hide();
    this.spinner.hide();
  }
}
