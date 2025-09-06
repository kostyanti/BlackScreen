import { Component } from '@angular/core';
import { StorageUtil } from '../StorageUtil';
import { SelectPage } from '../pagable/selectPage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  SelectPage = SelectPage;
  selectedPage: SelectPage = SelectPage.History;

  constructor(){
    this.selectedPage = StorageUtil.load<SelectPage>('selected-page',  SelectPage.History, sessionStorage)
  }
  
  selectPage(sp: SelectPage) {
    StorageUtil.save<SelectPage>('selected-page', sp, sessionStorage);
    window.location.href = './';
  }
}
