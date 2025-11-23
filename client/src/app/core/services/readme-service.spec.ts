import { TestBed } from '@angular/core/testing';

import { ReadmeService } from './readme-service';

describe('ReadmeService', () => {
  let service: ReadmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
