import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsStockModalComponent } from './news-stock-modal.component';

describe('NewsStockModalComponent', () => {
  let component: NewsStockModalComponent;
  let fixture: ComponentFixture<NewsStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsStockModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
