import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBatchListComponent } from './image-batch-list.component';

describe('ImageBatchListComponent', () => {
  let component: ImageBatchListComponent;
  let fixture: ComponentFixture<ImageBatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageBatchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageBatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
