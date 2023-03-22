import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Application } from 'app/pages/applications/application.model';
import { ApplicationProvider } from 'app/pages/applications/application.provider';
import { ApiResponse } from 'app/providers/provider';
import { Dashboard } from '../dashboard.model';
import { DashboardProvider } from '../dashboard.provider';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public data = new Dashboard();
  public source: MatTableDataSource<Application>;
  public displayedColumns: string[] = ['status', 'name', 'processes', 'support', 'actions'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public isBusy = false;
  constructor(
    public providerApplication: ApplicationProvider,
    public router: Router,
    private snackBar: MatSnackBar,
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

    this.providerApplication.getAll().subscribe((response: any) => {
      this.isBusy = false;
      this.snackBar.dismiss();
      this.source = new MatTableDataSource(response.data);
      this.source.sort = this.sort;
      this.source.paginator = this.paginator;
    });
  }

  goesToDashboard(item?: Application) {
    this.providerApplication.application = item;
    if (item) {
      this.router.navigate(['/application-dashboard', item._id]);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.filter = filterValue.trim().toLowerCase();
  }
}
