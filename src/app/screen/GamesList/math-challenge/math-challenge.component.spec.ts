import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathChallengeComponent } from './math-challenge.component';

describe('MathChallengeComponent', () => {
  let component: MathChallengeComponent;
  let fixture: ComponentFixture<MathChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathChallengeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MathChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
