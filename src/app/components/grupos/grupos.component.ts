import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Group {
  name: string;
  description: string;
  capacity: number;
  price: number;
  creator?: string;
  showDetails?: boolean;
}

@Component({
  selector: 'app-groups',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class GroupsComponent implements OnInit {
  private apiUrl = 'http://localhost:5000/api/groups';
  showModal = false;
  groups: Group[] = [];
  searchText = '';
  
  newGroup: Group = {
    name: '',
    description: '',
    capacity: 0,
    price: 0
  };
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.http.get(this.apiUrl).subscribe({
      next: (response: any) => {
        console.log('Grupos cargados:', response);
        this.groups = response;
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
      }
    });
  }

  createGroup(event: Event) {
    event.preventDefault();
    
    const userData = localStorage.getItem('usuario');
    if (!userData) {
      console.error('No se encontró información del usuario');
      return;
    }
    
    const user = JSON.parse(userData);
    
    const groupData = {
      name: this.newGroup.name,
      description: this.newGroup.description,
      capacity: Number(this.newGroup.capacity),
      price: Number(this.newGroup.price),
      creatorId: user.id
    };

    console.log('Enviando datos del grupo:', groupData);

    this.http.post(`${this.apiUrl}/create`, groupData).subscribe({
      next: (response: any) => {
        console.log('Grupo creado exitosamente:', response);
        this.loadGroups();
        this.toggleModal();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear el grupo:', error);
      }
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.resetForm();
    }
  }

  resetForm() {
    this.newGroup = {
      name: '',
      description: '',
      capacity: 0,
      price: 0
    };
  }

  toggleDetails(group: any) {
    group.showDetails = !group.showDetails;
  }
}