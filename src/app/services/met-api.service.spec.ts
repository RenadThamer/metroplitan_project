import { TestBed } from '@angular/core/testing';

import { MetApiService } from './met-api.service';

describe('MetApiService', () => {
  let service: MetApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
