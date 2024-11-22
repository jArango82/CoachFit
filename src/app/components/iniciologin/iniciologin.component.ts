import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Member {
  name: string;
  group: string;
  image: string;
}

interface UserProfile {
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

@Component({
  selector: 'app-home',
  templateUrl: './iniciologin.component.html',
  styleUrls: ['./iniciologin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class HomeComponent implements OnInit {
  allMembers: Member[] = [
    { name: "Ana García", group: "Nutrición y Dieta", image: "./assets/user-avatar.png" },
    { name: "Carlos Ruiz", group: "Fuerza Total", image: "./assets/user-avatar.png" },
    { name: "Laura Martínez", group: "Cardio Elite", image: "./assets/user-avatar.png" },
    { name: "Miguel Sánchez", group: "CrossFit Pro", image: "./assets/user-avatar.png" },
    { name: "Isabel Torres", group: "Yoga Avanzado", image: "./assets/user-avatar.png" }
  ];

  topMembers: Member[] = [];
  userName: string = 'Usuario no encontrado';
  userId: string = '';
  isLoading: boolean = true;
  userProfile: UserProfile = {
    datosPhysicos: {
      altura: 0,
      peso: 0,
      imc: 0,
      grasaCorporal: 0
    },
    medidas: {
      pecho: 0,
      cintura: 0,
      cadera: 0,
      biceps: 0,
      muslos: 0
    },
    objetivos: ['Aumentar masa muscular', 'Reducir % grasa al 15%']
  };
  isSaving: boolean = false; // Indicador de guardado

    constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRandomMembers();
    this.loadUserData();
  }

  getRandomMembers() {
    this.topMembers = [...this.allMembers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }

  loadUserData(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const userData = JSON.parse(usuario);
      this.userName = `${userData.nombre} ${userData.apellido}`;
    }
  }

  getRankClass(index: number): string {
    return index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
  }

  addObjetivo() {
    this.userProfile.objetivos.push('Nuevo objetivo');
  }

  saveUserData(): void {
    const userId = localStorage.getItem('userId'); // Obtén el ID del usuario desde el localStorage o desde tu sistema de autenticación
  
    if (!userId) {
      alert('Usuario no autenticado');
      return;
    }

    this.isLoading = true;
    this.http.put(`http://localhost:5000/api/datos-usuario/${userId}`, {
      datosPhysicos: this.userProfile.datosPhysicos,
      medidas: this.userProfile.medidas,
    }).subscribe({
      next: (response: any) => {
        console.log('Datos guardados:', response.data);
        alert('Datos actualizados correctamente');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al guardar los datos del usuario:', error);
        alert('Hubo un problema al guardar los datos. Intenta nuevamente.');
        this.isLoading = false;
      },
    });
  }
  
}