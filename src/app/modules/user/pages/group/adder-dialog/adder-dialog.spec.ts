import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdderDialog } from './adder-dialog';

describe('AdderDialog', () => {
  let component: AdderDialog;
  let fixture: ComponentFixture<AdderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdderDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
