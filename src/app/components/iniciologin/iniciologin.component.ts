import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule]
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

  ngOnInit() {
    this.getRandomMembers();
    this.loadUserData();
  }

  getRandomMembers() {
    this.topMembers = [...this.allMembers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }

  loadUserData() {
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

  async saveChanges() {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/userprofile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(this.userProfile)
      });

      const result = await response.json();
      if (response.ok) {
        alert('Perfil actualizado correctamente');
      } else {
        alert('Error al actualizar el perfil: ' + result.message);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error al actualizar el perfil');
    }
  }
}