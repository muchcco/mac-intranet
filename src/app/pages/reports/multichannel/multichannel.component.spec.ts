import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultichannelComponent } from './multichannel.component';

describe('MultichannelComponent', () => {
  let component: MultichannelComponent;
  let fixture: ComponentFixture<MultichannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultichannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultichannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
