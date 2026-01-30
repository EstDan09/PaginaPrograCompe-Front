import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResDialog } from './res-dialog';

describe('ResDialog', () => {
  let component: ResDialog;
  let fixture: ComponentFixture<ResDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
