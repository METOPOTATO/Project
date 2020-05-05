import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffReallocateComponent } from './staff-reallocate.component';

describe('StaffReallocateComponent', () => {
  let component: StaffReallocateComponent;
  let fixture: ComponentFixture<StaffReallocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffReallocateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffReallocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
