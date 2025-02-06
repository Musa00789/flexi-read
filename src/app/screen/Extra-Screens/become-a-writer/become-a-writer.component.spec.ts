import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAWriterComponent } from './become-a-writer.component';

describe('BecomeAWriterComponent', () => {
  let component: BecomeAWriterComponent;
  let fixture: ComponentFixture<BecomeAWriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeAWriterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeAWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
