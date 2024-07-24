import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetApiService } from '../services/met-api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  painting: any;
  comments: any[] = [];
  commentCount: number = 0;
  newComment = { username: '', comment: '' };
  showCommentForm: boolean = false;
  commentName: string = '';
  commentText: string = '';
  validationMessage: string = '';
  isFormValid: boolean = false; 


  constructor(
    private route: ActivatedRoute,
    private metApiService: MetApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchPaintingDetails(Number(id));
      this.fetchComments(Number(id));
    } else {
      console.error('No ID found in route parameters');
    }
  }

  fetchPaintingDetails(id: number) {
    this.metApiService.getPaintingDetails(id).subscribe((data: any) => {
      this.painting = data;
    });
  }

  fetchComments(id: number) {
    this.metApiService.getCommentsForPainting(id).subscribe(
      (data: any) => {
        if (data && Array.isArray(data)) {
          this.comments = data;
          this.commentCount = this.comments.length;
        } else {
          this.comments = [];
          this.commentCount = 0;
        }
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  addComment() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.metApiService.addComment(id, this.newComment).subscribe(
      () => {
        this.fetchComments(id); // Refresh comments after adding a new one
        this.newComment = { username: '', comment: '' }; // Reset the form
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  }

  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  submitComment() {
    if (this.validateForm()) {
      this.addComment();
      this.resetCommentForm();
    }
  }
/*
  validateForm(): boolean {
    const username = this.newComment.username.trim();
    const comment = this.newComment.comment.trim();
    const namePattern =  /^[a-zA-Z\s!?]+$/; // Allows letters, spaces, !, and ?

    if (!username || !comment) {
      this.validationMessage = 'Name and comment must not be null.';
      return false;
    } else if (username.length < 2 || comment.length < 2) {
      this.validationMessage = 'Name and comment must not be less than two letters.';
      return false;
    } else if (!namePattern.test(username) || !namePattern.test(comment)) {
      this.validationMessage = 'Name and comment must not contain numbers.';
      return false;
    }

    this.validationMessage = ''; // Clear any previous validation messages
    return true;
  }*/

    validateForm(): boolean {
      const username = this.newComment.username.trim();
      const comment = this.newComment.comment.trim();
      const namePattern = /^[a-zA-Z\s!?]+$/; // Allows letters, spaces, !, and ?
  
      if (!username || !comment) {
        this.validationMessage = 'Name and comment must not be null.';
        this.isFormValid = false;
        return false;
      } else if (username.length < 2 || comment.length < 2) {
        this.validationMessage = 'Name and comment must not be less than two letters.';
        this.isFormValid = false;
        return false;
      } else if (!namePattern.test(username) || !namePattern.test(comment)) {
        this.validationMessage = 'Name and comment must not contain numbers.';
        this.isFormValid = false;
        return false;
      }
  
      this.validationMessage = ''; // Clear any previous validation messages
      this.isFormValid = true;
      return true;
    }
  
    onInputChange() {
      this.validateForm();
    }

  cancelComment() {
    this.resetCommentForm();
  }

  resetCommentForm() {
    this.newComment = { username: '', comment: '' };
    this.showCommentForm = false; // Ensures the form is hidden after cancel or submit
    this.validationMessage = ''; // Clear validation message
  }
}