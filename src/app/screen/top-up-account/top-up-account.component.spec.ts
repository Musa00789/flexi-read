import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUpAccountComponent } from './top-up-account.component';

describe('TopUpAccountComponent', () => {
  let component: TopUpAccountComponent;
  let fixture: ComponentFixture<TopUpAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopUpAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopUpAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
