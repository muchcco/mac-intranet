import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from "ngx-spinner";
import { StatusService } from './services/status.service';
import { LoadingService } from './services/loading.service';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
  encapsulation: ViewEncapsulation.None
})
export class StatusComponent {
  fecha_inicio: string = '';
  fecha_fin: string = '';
  nom_mac: string = '';
  resultados: any[] = [];

  centrosMac: any[] = [];

  //paginamos 
  page: number = 1;
  pageSize: number = 20;

  isLoading: boolean = false;
  loadPercentage: number = 0;
  loadingPercentage: number = 0;  

  constructor(private statusService: StatusService, public loadingService: LoadingService, private spinner: NgxSpinnerService ) {}

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
    this.statusService.getFormDetails().subscribe(data => {
      if (data.status) {
        this.centrosMac = data.nom_mac;
      }
    })
  }

  buscar(): void {

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

    this.statusService.getStatusData(this.fecha_inicio, this.fecha_fin, this.nom_mac)
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
    const worksheet = XLSX.utils.json_to_sheet(this.resultados, { header: ['Nom_mac', 'TotalRegistros', 'Abandono'], skipHeader: true });

    // Insertar encabezado complejo
    XLSX.utils.sheet_add_aoa(worksheet, [
      ['','', 'REPORTE DE ATENCIONES', '', '', '', '', '', '', 'TIPO', 'REPORTERIA', ''],
      ['', '', '',  '', '', '', '','', 'Versión', '1.1.0', ''],
      ['','','CENTROS MAC', '', 'FECHA:','', `De: ${this.fecha_inicio} hasta ${this.fecha_fin}`, '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', ''],
      ['N°', 'CENTRO MAC', 'TOTAL', 'ESTADOS', '', '', '', '', '', '', ''],
      ['', '', '', 'TERMINADO', 'ABANDONO', 'LLAMANDO', 'CANCELADO', 'ATENCIÓN CERRADA', 'EN ESPERA', 'ERROR DE SELECCION', 'ATENCIÓN INICIADA']
    ], { origin: 'A1' });

    // Ajustar estilo de las columnas
    const wscols = [
      { wch: 20 }, 
      { wch: 30 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 } 
    ];
    worksheet['!cols'] = wscols;

    // Fusionar celdas para el encabezado complejo
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 2, c: 1 } }, // Fusionar para la celda de imagen (vacía por ahora)
      { s: { r: 0, c: 2 }, e: { r: 1, c: 7 } }, // Fusionar para "REPORTE DE ATENCIONES"
      { s: { r: 0, c: 8 }, e: { r: 0, c: 8 } }, // Fusionar para "TIPO"
      { s: { r: 0, c: 9 }, e: { r: 0, c: 10 } }, // Fusionar para "REPORTERIA"
      { s: { r: 1, c: 8 }, e: { r: 1, c: 8 } }, // Fusionar para "Versión"
      { s: { r: 1, c: 9 }, e: { r: 1, c: 10 } }, // Fusionar para "1.2.0"
      { s: { r: 2, c: 2 }, e: { r: 2, c: 2 } }, // Fusionar para "Centro MAC"
      { s: { r: 2, c: 3 }, e: { r: 2, c: 3 } }, // Fusionar para "RESULTADOS DEL CENTRO MAC"
      { s: { r: 2, c: 4 }, e: { r: 2, c: 5 } }, // Fusionar para "Fecha"
      { s: { r: 2, c: 6 }, e: { r: 2, c: 10 } }, // Fusionar para "Fecha"

      { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } }, // Fusionar para "N°"
      { s: { r: 4, c: 1 }, e: { r: 5, c: 1 } }, // Fusionar para "CENTRO MAC"
      { s: { r: 4, c: 2 }, e: { r: 5, c: 2 } }, // Fusionar para "TOTAL"
      { s: { r: 4, c: 3 }, e: { r: 4, c: 10 } } // Fusionar para "ESTADOS"
    ];

    

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Atenciones');
    
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'REPORTE DE ESTADOS.xlsx');

    this.loadingService.hide();
    this.spinner.hide();
  }
}
