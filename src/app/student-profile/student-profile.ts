import { Component, OnInit } from '@angular/core';
import { Api } from '../api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarStudentComponent } from '../navbar-student/navbar-student';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.html',
  styleUrls: ['./student-profile.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarStudentComponent]
})
export class StudentProfile implements OnInit {
  student: any = null;
  username = '';
  mode: 'fill' | 'view' | 'edit' = 'fill';
  success = '';
  error = '';

  // Tabs
  activeTab: 'profile' | 'skills' | 'projects' | 'internships' | 'achievements' = 'profile';
  skills: any[] = [];
  projects: any[] = [];
  internships: any[] = [];
  achievements: any[] = [];

  // For adding new items
  newSkill = '';
  newProject = { title: '', description: '', link: '' };
  newInternship = { company: '', role: '', duration: '' };
  newAchievement = { title: '', description: '' };

  constructor(private api: Api, private router: Router) {}

  ngOnInit() {
    this.api.getMe().subscribe({ next: (me: any) => this.username = me.username });
    this.loadProfile();
  }

  // ----------------- PROFILE -----------------
  loadProfile() {
    console.log('Loading profile...');  // Debug line
    this.api.getProfile().subscribe({
      next: data => {
        console.log('Profile loaded:', data);  // Debug line
        this.student = data;
        this.mode = (this.student.fullName && this.student.email) ? 'view' : 'fill';
      },
      error: () => {
        console.log('Profile load error');  // Debug line
        this.student = {};
        this.mode = 'fill';
      }
    });
  }
  

  updateProfile() {
    this.success = '';
    this.error = '';
    this.api.updateProfile(this.student).subscribe({
      next: () => { this.success = 'Profile updated successfully!'; this.loadProfile(); },
      error: () => this.error = 'Update failed, please try again.'
    });
  }

  editProfile() { this.mode = 'edit'; }
  cancelEdit() { this.mode = 'view'; }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.api.uploadResume(formData).subscribe({
        next: (res: any) => { this.student.resumePath = res.path; this.success = 'Resume uploaded!'; },
        error: () => this.error = 'Resume upload failed.'
      });
    }
  }

  // ----------------- TAB NAV -----------------
  selectTab(tab: 'profile' | 'skills' | 'projects' | 'internships' | 'achievements') {
    this.activeTab = tab;
    if (tab === 'skills') this.loadSkills();
    if (tab === 'projects') this.loadProjects();
    if (tab === 'internships') this.loadInternships();
    if (tab === 'achievements') this.loadAchievements();
  }

  // ----------------- SKILLS -----------------
  loadSkills() {
    this.api.getSkills().subscribe({ next: data => this.skills = data });
  }

  addSkill() {
    if (!this.newSkill) return;
    this.api.addSkill({ name: this.newSkill }).subscribe({
      next: skill => { this.skills.push(skill); this.newSkill = ''; },
      error: () => this.error = 'Failed to add skill.'
    });
  }

  deleteSkill(id: number) {
    this.api.deleteSkill(id).subscribe({ next: () => this.skills = this.skills.filter(s => s.id !== id) });
  }

  // ----------------- PROJECTS -----------------
  loadProjects() {
    this.api.getProjects().subscribe({ next: data => this.projects = data });
  }

  addProject() {
    this.api.addProject(this.newProject).subscribe({
      next: p => { this.projects.push(p); this.newProject = { title: '', description: '', link: '' }; },
      error: () => this.error = 'Failed to add project.'
    });
  }

  deleteProject(id: number) {
    this.api.deleteProject(id).subscribe({ next: () => this.projects = this.projects.filter(p => p.id !== id) });
  }

  // ----------------- INTERNSHIPS -----------------
  loadInternships() {
    this.api.getInternships().subscribe({ next: data => this.internships = data });
  }

  addInternship() {
    this.api.addInternship(this.newInternship).subscribe({
      next: i => { this.internships.push(i); this.newInternship = { company: '', role: '', duration: '' }; },
      error: () => this.error = 'Failed to add internship.'
    });
  }

  deleteInternship(id: number) {
    this.api.deleteInternship(id).subscribe({ next: () => this.internships = this.internships.filter(i => i.id !== id) });
  }

  // ----------------- ACHIEVEMENTS -----------------
  loadAchievements() {
    this.api.getAchievements().subscribe({ next: data => this.achievements = data });
  }

  addAchievement() {
    this.api.addAchievement(this.newAchievement).subscribe({
      next: a => { this.achievements.push(a); this.newAchievement = { title: '', description: '' }; },
      error: () => this.error = 'Failed to add achievement.'
    });
  }

  deleteAchievement(id: number) {
    this.api.deleteAchievement(id).subscribe({ next: () => this.achievements = this.achievements.filter(a => a.id !== id) });
  }
}
export interface Student {
  id: number;
  username: string;
  name: string;
  email: string;
  imageUrl?: string; // optional
}
