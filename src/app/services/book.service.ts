import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http'; // ✅ Uncomment when switching to backend

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  rating: number;
  description: string;
}

type SortOption = 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc';

interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  category?: string;
  availableOnly?: boolean;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private booksSubject = new BehaviorSubject<Book[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');
  private sortOptionSubject = new BehaviorSubject<SortOption>('title-asc');
  private filterOptionsSubject = new BehaviorSubject<FilterOptions>({});
  private initialized = false;

  // constructor(private http: HttpClient) {} // ✅ Use this when enabling backend
  constructor() {} // 👈 Mock only

  private loadBooks(): void {
    if (this.initialized) return;

    const mockData: Book[] = [
      {
        id: '1',
        title: 'Atomic Habits',
        author: 'James Clear',
        price: 80,
        imageUrl: '/our-books-1.png',
        rating: 4.5,
        description:
          'Bestselling guide to building good habits and breaking bad ones.',
      },
      {
        id: '2',
        title: 'Deep Work',
        author: 'Cal Newport',
        price: 72,
        imageUrl: '/our-books-1.png',
        rating: 4.4,
        description: 'Rules for focused success in a distracted world.',
      },
      {
        id: '3',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        price: 65,
        imageUrl: '/our-books-1.png',
        rating: 4.2,
        description:
          'A journey of self-discovery through mystical storytelling.',
      },
    ];

    this.booksSubject.next(mockData);
    this.initialized = true;
  }

  getBooks(): Observable<Book[]> {
    this.loadBooks();
    return this.booksSubject.asObservable();

    // ✅ Use this version when backend is ready
    // return this.http.get<Book[]>('/api/books');
  }

  getFilteredBooks(): Observable<Book[]> {
    this.loadBooks();

    return combineLatest([
      this.booksSubject.asObservable(),
      this.searchTermSubject.asObservable(),
      this.sortOptionSubject.asObservable(),
      this.filterOptionsSubject.asObservable(),
    ]).pipe(
      map(([books, search, sort, filters]) => {
        const term = search.toLowerCase();

        let result = books.filter(
          (book) =>
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term)
        );

        if (filters.minPrice != null) {
          result = result.filter((b) => b.price >= filters.minPrice!);
        }
        if (filters.maxPrice != null) {
          result = result.filter((b) => b.price <= filters.maxPrice!);
        }
        if (filters.minRating != null) {
          result = result.filter((b) => b.rating >= filters.minRating!);
        }
        if (filters.category) {
          result = result.filter((b) =>
            b.description
              ?.toLowerCase()
              .includes(filters.category!.toLowerCase())
          );
        }

        if (filters.availableOnly) {
          result = result.filter((b) => b.price < 100);
        }

        switch (sort) {
          case 'title-asc':
            result = result.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'title-desc':
            result = result.sort((a, b) => b.title.localeCompare(a.title));
            break;
          case 'price-asc':
            result = result.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            result = result.sort((a, b) => b.price - a.price);
            break;
        }

        return result;
      })
    );
  }

  getBookById(id: string): Observable<Book | undefined> {
    this.loadBooks();
    return this.booksSubject.pipe(
      map((books) => books.find((book) => book.id === id))
    );

    // ✅ Use this version when backend is ready
    // return this.http.get<Book>(`/api/books/${id}`);
  }

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  setSortOption(option: SortOption) {
    this.sortOptionSubject.next(option);
  }

  setFilterOptions(options: FilterOptions) {
    this.filterOptionsSubject.next(options);
  }
}
