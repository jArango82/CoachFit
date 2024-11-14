import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-groups',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GroupsComponent implements OnInit {
  showModal = false;
  groups: any[] = [];
  searchText = '';
  
  constructor() {}

  ngOnInit() {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      const user = JSON.parse(userData);
      // User role logic will be handled in template
    }
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  createGroup(event: Event) {
    event.preventDefault();
    // Group creation logic
  }

  toggleDetails(group: any) {
    group.showDetails = !group.showDetails;
  }
}