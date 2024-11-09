import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserProfile {
  datosPhysicos: {
    altura: number;
    peso: number;
    imc: number;
    grasaCorporal: number;
  };
  medidas: {
    pecho: number;
    cintura: number;
    cadera: number;
    biceps: number;
    muslos: number;
  };
  objetivos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/userprofile`, {
      headers: this.getHeaders()
    });
  }

  updateUserProfile(profile: UserProfile): Observable<any> {
    return this.http.post(`${this.apiUrl}/userprofile/update`, profile, {
      headers: this.getHeaders()
    });
  }
}