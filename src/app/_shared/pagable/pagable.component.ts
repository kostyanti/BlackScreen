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
  private static readonly VIEWED_KEY = 'viewed-key';

  totalPages: number = 1;
  currentPage: number = 1;
  @Input() selectedPage: SelectPage = SelectPage.Main;
  @Input() selectedGenre: string = '';
  @Output() pageChange = new EventEmitter<number>();

  titles: TitleItem[] = [];

  ngOnInit() {
    this.loadContent();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.currentPage = page;
    this.pageChange.emit(page);
    this.loadContent();
  }

  loadContent() {
    switch(this.selectedPage) {
      case SelectPage.Main:
        this.titles = StorageUtil.load<TitleItem[]>(PagableComponent.VIEWED_KEY, []);
        break;
      case SelectPage.Applications:
        this.titles = this.loadApplications();
        break;
      default:
        this.titles = this.loadFromKodik(this.selectedPage, this.selectedGenre);
        break;
    }
  }

  loadApplications(): TitleItem [] {
    return [];
  }

  loadFromKodik(pageType: SelectPage, genre: string): TitleItem [] {
    return [];
  }
}
