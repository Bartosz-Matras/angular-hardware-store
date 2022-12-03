import { TestBed } from '@angular/core/testing';

import { CorrelationServiceService } from './correlation-service.service';

describe('CorrelationServiceService', () => {
  let service: CorrelationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrelationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
