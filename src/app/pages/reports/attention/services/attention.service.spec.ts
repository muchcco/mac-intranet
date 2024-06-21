import { TestBed } from '@angular/core/testing';

import { AttentionService } from './attention.service';

describe('AttentionService', () => {
  let service: AttentionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttentionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
