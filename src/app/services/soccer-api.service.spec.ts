import { TestBed } from '@angular/core/testing';

import { SoccerAPIService } from './soccer-api.service';

describe('SoccerAPIService', () => {
  let service: SoccerAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoccerAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
