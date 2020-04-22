import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyImageDialogComponent } from './buy-image-dialog.component';

describe('BuyImageDialogComponent', () => {
  let component: BuyImageDialogComponent;
  let fixture: ComponentFixture<BuyImageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyImageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
