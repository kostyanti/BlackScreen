import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectPage } from './selectPage';
import { StorageUtil } from '../StorageUtil';
import { TitleItem } from './titleItem';
import { FormsModule } from '@angular/forms';
import { CategoryGenres, ContentCategory, ContentTypeToCategory, Genre } from './genres';
import { Result, Root } from './model';

@Component({
  selector: 'app-pagable',
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './pagable.component.html',
  styleUrl: './pagable.component.scss'
})
export class PagableComponent {
  private static readonly HISTORY_KEY = 'history-key';
  private static readonly API_URL = 'https://kodikapi.com';

  totalPages: number = 1;
  currentPage: number = 1;
  selectedPage: SelectPage = SelectPage.History;
  SelectPage = SelectPage;

  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;

  searchQuery: string = '';
  titles: TitleItem[] = [];
  results: Result[] = [];

  isLoading: boolean = false;

  contentCategories = Object.values(ContentCategory);
  selectedCategory: ContentCategory | null = null;
  selectedGenre: Genre | null = null;

  constructor(private http: HttpClient) {}

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
      default: this.titles = []; break;
    }
  }

  loadHistory() {
    this.titles = StorageUtil.load<TitleItem[]>(PagableComponent.HISTORY_KEY, []);
  }

  loadApplications() {
    this.titles = [];
  }

  onSearch(pageUrl?: string) {
    if (this.isLoading) return;

    this.isLoading = true;
    console.log('[SEARCH] Запит:', this.searchQuery);

    const isSearch = this.searchQuery.trim().length > 0;

    const params: Record<string, string> = {
      token: 'd84d9c90aa079d0846d1bce9a8837dc4',
      with_material_data: 'true',
      limit: '100', 
      translation_type: 'voice',
      sort: 'year',
      year: '2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025',
    };

    if (isSearch) params['title'] = this.searchQuery;
    if (this.selectedCategory) {
      const types = Object.entries(ContentTypeToCategory)
        .filter(([type, cat]) => cat === this.selectedCategory)
        .map(([type]) => type);
      if (types.length) params['types'] = types.join(',');
    }
    if (this.selectedGenre) params['genres'] = this.selectedGenre;

    const queryString = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');

    const url = pageUrl || (isSearch
      ? `${PagableComponent.API_URL}/search?${queryString}`
      : `${PagableComponent.API_URL}/list?${queryString}`);

    this.http.get<Root>(url).subscribe({
      next: (response) => {
        if (response?.results) {
          const seen = new Set<string>();
          const uniqueResults = response.results.filter((item: Result) => {
            const lowerTitle = (item.title || '').toLowerCase().trim();
            if (seen.has(lowerTitle)) return false;
            seen.add(lowerTitle);
            return true;
          });

          this.results = uniqueResults;
          this.titles = this.mapResultsToTitles(uniqueResults);
        } else {
          this.titles = [];
        }

        this.nextPageUrl = response.next_page || null;
        this.prevPageUrl = response.prev_page || null;

        console.log('[SEARCH TITLES]', this.titles);
        console.log('Next page:', this.nextPageUrl, 'Prev page:', this.prevPageUrl);
      },
      error: (err) => console.error('[SEARCH ERROR]', err),
      complete: () => this.isLoading = false
    });
  }

  get availableGenres(): Genre[] {
    return this.selectedCategory 
      ? CategoryGenres[this.selectedCategory] 
      : [];
  }

  selectCategory(cat: ContentCategory) {
    this.selectedCategory = cat;
    this.selectedGenre = null;
    console.log('[FILTER] Selected category:', cat);
  }

  selectGenre(genre: Genre) {
    this.selectedGenre = genre;
    console.log('[FILTER] Selected genre:', genre);
  }

  private mapResultsToTitles(results: Result[]): TitleItem[] {
    return results.map(result => ({
      id: result.id,
      img: result.material_data?.poster_url || '',
      name: result.title || result.material_data?.title || '',
      shortInfo: this.buildShortInfo(result),
      
      episode: 1,
      season: 1,
      lasturl: result.link || '',
    }));
  }

  private buildShortInfo(result: Result): string {
    const year = result.year || result.material_data?.year || '';
    const genre = result.material_data?.genres?.[0] || '';
    const country = result.material_data?.countries?.[0] || '';
    return [year, genre, country].filter(Boolean).join(', ');
  }

  goToNextPage() {
    if (this.nextPageUrl) {
      this.onSearch(this.nextPageUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPrevPage() {
    if (this.prevPageUrl) {
      this.onSearch(this.prevPageUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
