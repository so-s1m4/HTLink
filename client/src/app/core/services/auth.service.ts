import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: WritableSignal<string | null> = signal(null);


  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    this.token.set(token);
  }

  async login(data: {email: string, code: string}): Promise<void> {
    this.http.post('/api/verify-code', data).subscribe({
      next: (response: any) => {
        this.token.set(response.token);
        this.router.navigate(['/more']);
        localStorage.setItem('token', response.token);
      },
      error: (error) => {
        throw error;
      }
    });
  }

  async loginWithPassword(data: {mail: string, password: string}): Promise<void> {
    this.http.post('/api/login', data).subscribe({
      next: (response: any) => {
        this.token.set(response.token);
        this.router.navigate(['/more']);
        localStorage.setItem('token', response.token);
      },
      error: (error) => {
        throw error;
      }
    });
  }

  get isAuthed() {
    return !!this.token();
  }
  
  logout(): void {
    console.log('logged out');
    this.token.set(null)
    localStorage.removeItem('token');
    this.router.navigate(['/more/login']);
    console.log('logged out 2');
  }

  askForCode(value: { email: string }) {
    return this.http.post('/api/send-code', value);
  }
}
