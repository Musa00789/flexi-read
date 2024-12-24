import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellABookComponent } from './sell-a-book.component';

describe('SellABookComponent', () => {
  let component: SellABookComponent;
  let fixture: ComponentFixture<SellABookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellABookComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SellABookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
