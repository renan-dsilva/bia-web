import { ProcessProvider } from '../process.provider';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Process } from '../process.model';
import { Router } from '@angular/router';
import { ApiResponse } from 'app/providers/provider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/pages/components/dialog/dialog-confirmation.component';

@Component({
  styleUrls: ['./process-list.component.css'],
  templateUrl: './process-list.component.html',
})

export class ProcessListComponent implements OnInit {
  public source: MatTableDataSource<Process>;
  public displayedColumns: string[] = ['name', 'area', 'actions'];
  public isBusy = false;

  public listTitle = 'Processs';
  public listIcon = 'sync';

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private provider: ProcessProvider,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.setUp();
  }

  setUp() {
    this.fetch();
  }

  fetch() {
    this.isBusy = true;
    this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

    this.provider.getAll().subscribe((response: any) => {
      this.isBusy = false;
      this.snackBar.dismiss();
      this.source = new MatTableDataSource(response.data);
      console.log(response.data)
      this.source.sort = this.sort;
      this.source.paginator = this.paginator;
    });
  }

  goesToForm(item?: Process) {
    this.provider.process = item;
    if (item) {
      this.router.navigate(['/process-form', item._id]);
    } else {
      this.router.navigate(['/process-form']);
    }
  }

  delete(item: Process) {
    if (item) {

      let dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: {
          title: 'Delete',
          message: 'Are you sure?'
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.removeFromServer(item);
        }
      });
    }
  }

  removeFromServer(item: Process) {
    this.isBusy = true;
    this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

    this.provider.delete(item).subscribe((response: any) => {
      let res = response as ApiResponse;
      this.isBusy = false;

      this.removeRow(item);

      if (res.success) {
        this.snackBar.open(res.message, '', { duration: 5000, panelClass: ['alert', 'alert-success'] });
      } else {
        this.snackBar.open(res.message, 'Close', { panelClass: ['alert', 'alert-danger'] });
      }
    });
  }

  removeRow(process: Process) {
    const itemIndex = this.source.data.findIndex(s => s._id === process._id);
    this.source.data.splice(itemIndex, 1);
    this.source.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.filter = filterValue.trim().toLowerCase();
  }
}
