import { Observable, of, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { PostService } from '../post.service';

import { Post } from '../post';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({

  selector: 'app-index',

  templateUrl: './index.component.html',

  styleUrls: ['./index.component.css']

})

export class IndexComponent implements OnInit {
  curPage!: number;
  pageSize!: number;
  posts: Post[]  = [];
  searchText!: string;
  postlist$!: Observable<Post[]>;
  private searchedSubject = new Subject<string>();
  constructor(public postService: PostService) { }

title: any;



  search(searchedString: string): void {
    console.log(`searchedString = ${searchedString}`);
    this.searchedSubject.next(searchedString);
    
  }

  ngOnInit(): void {

    this.postService.getAll().subscribe((data: Post[]) => {

      this.posts = data;

      // console.log(this.posts);

    })
    this.curPage = 1;
    this.pageSize = 10; // any page size you want
    

    this.postlist$ = this.searchedSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchedString: string) => this.postService.searchPost(searchedString))
    
      )

      
  }


Search(){
  if(this.title == ""){
    this.ngOnInit();
  }
  else{
    this.posts = this.posts.filter(res => {
      return res.title.toLocaleLowerCase().match(this.title.toLocaleLowerCase());
    })
  }
}
  deletePost(id: number) {

    this.postService.delete(id).subscribe(res => {

      this.posts = this.posts.filter(item => item.id !== id);

      console.log('Post deleted successfully!');

    })

  }
  numberOfPages() {
    return Math.ceil(this.posts.length / this.pageSize);
  }


}