import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersManagementButtonComponent } from './users-management-button.component';

describe('UsersManagementButtonComponent', () => {
  let component: UsersManagementButtonComponent;
  let fixture: ComponentFixture<UsersManagementButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersManagementButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersManagementButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
