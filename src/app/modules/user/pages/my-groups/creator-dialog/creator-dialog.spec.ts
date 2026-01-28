import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorDialog } from './creator-dialog';

describe('CreatorDialog', () => {
  let component: CreatorDialog;
  let fixture: ComponentFixture<CreatorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatorDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
