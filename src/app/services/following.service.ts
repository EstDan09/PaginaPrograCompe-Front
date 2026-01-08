import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FollowingService {
  URL = 'http://localhost:3000/following/get'
  async getFollowing() {
    return await fetch(this.URL, {
      credentials: 'include',
    });
  }

}
