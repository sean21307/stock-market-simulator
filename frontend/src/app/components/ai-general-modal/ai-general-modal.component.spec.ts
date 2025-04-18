import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiGeneralModalComponent } from './ai-general-modal.component';

describe('AiGeneralModalComponent', () => {
  let component: AiGeneralModalComponent;
  let fixture: ComponentFixture<AiGeneralModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiGeneralModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiGeneralModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
