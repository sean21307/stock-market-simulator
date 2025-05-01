import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNavBarComponent } from './table-nav-bar.component';

describe('TableNavBarComponent', () => {
  let component: TableNavBarComponent;
  let fixture: ComponentFixture<TableNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
