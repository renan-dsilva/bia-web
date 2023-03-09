import { IntegrationProvider } from '../integration.provider';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Integration } from '../integration.model';
import { Router } from '@angular/router';
import { ApiResponse } from 'app/providers/provider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/pages/components/dialog/dialog-confirmation.component';

@Component({
  styleUrls: ['./integration-list.component.css'],
  templateUrl: './integration-list.component.html',
})

export class IntegrationListComponent implements OnInit {
  public source: MatTableDataSource<Integration>;
  public displayedColumns: string[] = ['name', 'source_application', 'target_application', 'actions'];
  public isBusy = false;

  public listTitle = 'Integrations';
  public listIcon = 'link';

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private provider: IntegrationProvider,
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
      this.source.sort = this.sort;
      this.source.paginator = this.paginator;
    });
  }

  goesToForm(item?: Integration) {
    this.provider.integration = item;
    if (item) {
      this.router.navigate(['/integration-form', item._id]);
    } else {
      this.router.navigate(['/integration-form']);
    }
  }

  delete(item: Integration) {
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

  removeFromServer(item: Integration) {
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

  removeRow(integration: Integration) {
    const itemIndex = this.source.data.findIndex(s => s._id === integration._id);
    this.source.data.splice(itemIndex, 1);
    this.source.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.filter = filterValue.trim().toLowerCase();
  }
}
