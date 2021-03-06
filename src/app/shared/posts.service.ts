import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FbCreateResponse, Post} from "./interfaces";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private http: HttpClient) {

  }

  create(post: Post): Observable<Post | any> {
    return this.http.post<Post | any>(`${environment.fbDBUrl}posts.json`, post)
      .pipe(map((response: FbCreateResponse) => {
        const newPost: Post = {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
        return newPost
      }))
  }

  getAll(): Observable<Post[]> {
    return this.http.get(`${environment.fbDBUrl}posts.json`)
      .pipe(map((response: {[key: string]: any}) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
              id: key,
              date: new Date(response[key].date)
          }))
      }))
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDBUrl}posts/${id}.json`)
      .pipe(map((post: Post) => {
        const newPost: Post = {
          ...post,
          id,
          date: new Date(post.date)
        };
        return newPost
      }))
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDBUrl}posts/${id}.json`)
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDBUrl}posts/${post.id}.json`, post)
  }

}
