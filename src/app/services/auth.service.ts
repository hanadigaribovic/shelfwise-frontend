import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  uid: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(data: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/register`, data)
      .pipe(tap((res) => this.saveToken(res.token, res.uid)));
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, data)
      .pipe(tap((res) => this.saveToken(res.token, res.uid)));
  }

  private saveToken(token: string, uid: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('uid', uid);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('uid');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
  }
}
