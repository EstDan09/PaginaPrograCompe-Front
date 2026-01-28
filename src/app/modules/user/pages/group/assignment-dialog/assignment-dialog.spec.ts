import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentDialog } from './assignment-dialog';

describe('AssignmentDialog', () => {
  let component: AssignmentDialog;
  let fixture: ComponentFixture<AssignmentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
