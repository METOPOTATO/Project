import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffMydashboardComponent } from './staff-mydashboard.component';

describe('StaffMydashboardComponent', () => {
  let component: StaffMydashboardComponent;
  let fixture: ComponentFixture<StaffMydashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffMydashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffMydashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
