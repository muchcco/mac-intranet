import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionValidationModalComponent } from './connection-validation-modal.component';

describe('ConnectionValidationModalComponent', () => {
  let component: ConnectionValidationModalComponent;
  let fixture: ComponentFixture<ConnectionValidationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionValidationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionValidationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
