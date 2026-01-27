import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../../../services/group.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-group',
  imports: [CommonModule, RouterLink],
  templateUrl: './group.html',
  styleUrl: './group.scss',
})
export class Group {
  route = inject(ActivatedRoute);
  groupService = inject(GroupService);
  groupDetails = this.groupService.groupDetails;

  constructor() {
    const id = this.route.snapshot.params['id'];

    console.log('Group ID:', id);

    this.groupService.getGroupDetails(id).subscribe();

  }

  trackAssignment = (_: number, a: { _id: string }) => a._id;




}
