import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeChart } from './time-chart';

describe('TimeChart', () => {
  let component: TimeChart;
  let fixture: ComponentFixture<TimeChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
