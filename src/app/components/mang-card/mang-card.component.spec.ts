import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangCardComponent } from './mang-card.component';

describe('MangCardComponent', () => {
  let component: MangCardComponent;
  let fixture: ComponentFixture<MangCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MangCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
