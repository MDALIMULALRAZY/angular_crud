import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map} from 'rxjs/operators';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private apiURL = "https://jsonplaceholder.typicode.com";
  private searchURL = "https://jsonplaceholder.typicode.com/posts";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  constructor(private httpClient: HttpClient) { }
  getAll(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.apiURL + '/posts/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(post:any): Observable<Post> {

    return this.httpClient.post<Post>(this.apiURL + '/posts/', JSON.stringify(post), this.httpOptions)

      .pipe(

        catchError(this.errorHandler)

      )

  }

  find(id:number): Observable<Post> {

    return this.httpClient.get<Post>(this.apiURL + '/posts/' + id)

      .pipe(

        catchError(this.errorHandler)

      )

  }

  update(id:number, post:any): Observable<Post> {

    return this.httpClient.put<Post>(this.apiURL + '/posts/' + id, JSON.stringify(post), this.httpOptions)

      .pipe(

        catchError(this.errorHandler)

      )

  }

  delete(id:number) {

    return this.httpClient.delete<Post>(this.apiURL + '/posts/' + id, this.httpOptions)

      .pipe(

        catchError(this.errorHandler)

      )

  }
  searchPost(typedString: string): Observable<Post[]>{
    if (!typedString.trim){
        return of([]);
    }
     return this.httpClient.get<Post[]>(`${this.searchURL}?title=${typedString}`).pipe(
      tap(foundedPosts => console.log(`posts are = ${JSON.stringify(foundedPosts)}`)),
      map((posts: any) => {
        return posts.map((post: any) => { 
          return {
            title: post.title, 
            body: post.body
          }
        })
      }),
      catchError(this.errorHandler)
     )
    }

  errorHandler(error:any) {

    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {

      errorMessage = error.error.message;

    } else {

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

    }

    return throwError(errorMessage);

  }

}