import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../shared/posts.service";
import {Post} from "../shared/interfaces";
import {Observable} from "rxjs";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  posts$: Observable<Post> = new Observable<Post>()

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService

  ) { }

  ngOnInit(): void {
    this.posts$ = this.route.params
      .pipe(switchMap((params: Params) => {
        return this.postsService.getById(params['id'])
      }))
  }

}
