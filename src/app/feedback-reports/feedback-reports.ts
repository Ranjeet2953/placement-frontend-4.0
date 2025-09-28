import { Component, OnInit } from '@angular/core';
import { Api } from '../api';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-reports',
  templateUrl: './feedback-reports.html',
  styleUrls: ['./feedback-reports.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FeedbackReports implements OnInit {
  feedbackList: any[] = [];

  constructor(private api: Api, private location: Location) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.api.getAllFeedbacks().subscribe(
      feedbacks => {
        this.feedbackList = feedbacks;
      },
      error => {
        console.error('Failed to load feedback reports', error);
      }
    );
  }

  deleteFeedback(id: number): void {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.api.deleteFeedback(id.toString()).subscribe(
        () => {
          this.feedbackList = this.feedbackList.filter(fb => fb.id !== id);
        },
        error => {
          console.error('Failed to delete feedback', error);
        }
      );
    }
  }
  

  goBack(): void {
    this.location.back();
  }
}
