import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBatchComponent } from './image-batch.component';

describe('ImageBatchComponent', () => {
  let component: ImageBatchComponent;
  let fixture: ComponentFixture<ImageBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageBatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
