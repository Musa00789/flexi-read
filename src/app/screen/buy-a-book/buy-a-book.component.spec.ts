import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyABookComponent } from './buy-a-book.component';

describe('BuyABookComponent', () => {
  let component: BuyABookComponent;
  let fixture: ComponentFixture<BuyABookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyABookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyABookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
