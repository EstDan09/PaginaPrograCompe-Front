import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeDialog } from './code-dialog';

describe('CodeDialog', () => {
  let component: CodeDialog;
  let fixture: ComponentFixture<CodeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
