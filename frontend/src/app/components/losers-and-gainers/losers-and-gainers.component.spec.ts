import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LosersAndGainersComponent } from './losers-and-gainers.component';

describe('LosersAndGainersComponent', () => {
  let component: LosersAndGainersComponent;
  let fixture: ComponentFixture<LosersAndGainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LosersAndGainersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LosersAndGainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
