import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletFormComponent } from './wallet-form.component';

describe('WalletFormComponent', () => {
  let component: WalletFormComponent;
  let fixture: ComponentFixture<WalletFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
