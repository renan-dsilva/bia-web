import { Component, ViewChild, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'environments/environment';
import { MatAccordion } from '@angular/material/expansion';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [DatePipe]
})
export class SidebarComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  public menuFeatured: RouteInfo[];
  public menuEntries: RouteInfo[];
  public menuSettigns: RouteInfo[];
  public menuLogout: RouteInfo;

  public pageTitle = '';
  private today: string = ''

  constructor(private datePipe: DatePipe) {
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-01');
    // let financeMenuItem = { path: '/finance-list/' + today, title: 'Financeiro', icon: 'attach_money', class: '' };
    // ROUTES.push(financeMenuItem);
  }

  ngOnInit() {
    this.pageTitle = environment.appName;
    this.menuFeatured = [
      { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
      // { path: '/support', title: 'Vídeos/Suporte', icon: 'video_library', class: '' },
      // { path: '/enrollment', title: 'Matrícula', icon: 'group_add', class: '' },
    ];
    this.menuEntries = [
      { path: '/application-list', title: 'Applications', icon: 'memory', class: '' },
      { path: '/area-list', title: 'Areas', icon: 'location_on', class: '' },
      { path: '/integration-list', title: 'Integrations', icon: 'link', class: '' },
      { path: '/process-list', title: 'Processes', icon: 'sync', class: '' },
      { path: '/support-list', title: 'Support Levels', icon: 'headset_mic', class: '' },
    ];
    this.menuSettigns = [
      // { path: '/school-form', title: 'Escola', icon: 'home', class: '' },
      { path: '/profile-list', title: 'Perfis', icon: 'settings', class: '' },
      { path: '/staff-list', title: 'Usuários', icon: 'settings', class: '' },
    ];
    this.menuLogout = { path: '/logout', title: 'Sair', icon: 'unarchive', class: 'active-pro-' };
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
