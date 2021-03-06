import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../../shared/posts.service";
import {switchMap} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({})
  post: Post = {
    title: '',
    text: '',
    id: '',
    author: '',
    date: new Date()
  }
  submitted: boolean = false

  uSub: Subscription = new Subscription()

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap((params: Params) => {
          return this.postService.getById(params['id'])
        })
      ).subscribe((post: Post) => {
        this.post = post
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required)
        })
    })
  }

  submit() {
    if(this.form.invalid) {
      return
    }

    this.submitted = true

    this.uSub = this.postService.update({
      // id: this.post.id,
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
      // author: this.post.author,
      // date: this.post.date
    }).subscribe(() => {
      this.submitted = false
      this.alert.success('You have changed the post successfully!')
    })
  }

  ngOnDestroy() {
    if(this.uSub) {
      this.uSub.unsubscribe()
    }
  }
}
