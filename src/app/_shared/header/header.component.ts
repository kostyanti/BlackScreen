import { Component } from '@angular/core';
import { StorageUtil } from '../StorageUtil';
import { SelectPage } from '../pagable/selectPage';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  SelectPage = SelectPage;
  
  selectPage(sp: SelectPage) {
    StorageUtil.save<SelectPage>('selected-page', sp, sessionStorage);
    window.location.href = './';
  }
}
