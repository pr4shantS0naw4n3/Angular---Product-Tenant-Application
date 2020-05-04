import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RssoLoginComponent } from './rsso-login.component';

describe('RssoLoginComponent', () => {
  let component: RssoLoginComponent;
  let fixture: ComponentFixture<RssoLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RssoLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RssoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
