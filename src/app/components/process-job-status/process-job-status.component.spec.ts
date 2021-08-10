import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessJobStatusComponent } from './process-job-status.component';

describe('ProcessJobStatusComponent', () => {
  let component: ProcessJobStatusComponent;
  let fixture: ComponentFixture<ProcessJobStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessJobStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessJobStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
