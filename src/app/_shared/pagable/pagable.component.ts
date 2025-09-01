import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectPage } from './selectPage';
import { StorageUtil } from '../StorageUtil';
import { TitleItem } from './titleItem';

@Component({
  selector: 'app-pagable',
  imports: [CommonModule],
  templateUrl: './pagable.component.html',
  styleUrl: './pagable.component.scss'
})
export class PagableComponent {
  private static readonly HISTORY_KEY = 'history-key';

  totalPages: number = 1;
  currentPage: number = 1;
  selectedPage: SelectPage = SelectPage.History;

  titles: TitleItem[] = [];

  ngOnInit() {
    this.selectedPage = StorageUtil.load<SelectPage>('selected-page', SelectPage.History, sessionStorage);
    this.loadContent();
  }

  get pages(): number[] {
    const maxVisible = 7;
    const half = Math.floor(maxVisible / 2);

    let start = this.currentPage - half;
    let end = this.currentPage + half;

    if (start < 1) {
      start = 1;
      end = Math.min(this.totalPages, start + maxVisible - 1);
    }
    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.currentPage = page;
    this.loadContent();
  }

  loadContent() {
    switch(this.selectedPage) {
      case SelectPage.History: this.loadHistory(); break;
      case SelectPage.Applications: this.loadApplications(); break;
      default: this.loadList(); break;
    }
  }

  loadHistory() {
    this.titles = StorageUtil.load<TitleItem[]>(PagableComponent.HISTORY_KEY, []);
  }

  loadApplications() {
    this.titles = [];
  }

  loadList() {
    this.titles = [];
  }
}
