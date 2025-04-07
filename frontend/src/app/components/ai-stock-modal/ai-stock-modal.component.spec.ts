import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiStockModalComponent } from './ai-stock-modal.component';

describe('AiStockModalComponent', () => {
  let component: AiStockModalComponent;
  let fixture: ComponentFixture<AiStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiStockModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
