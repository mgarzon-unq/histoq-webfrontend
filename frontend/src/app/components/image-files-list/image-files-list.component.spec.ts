import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageFilesListComponent } from './image-files-list.component';

describe('ImageFilesListComponent', () => {
  let component: ImageFilesListComponent;
  let fixture: ComponentFixture<ImageFilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageFilesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
