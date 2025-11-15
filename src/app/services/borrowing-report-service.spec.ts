import { TestBed } from '@angular/core/testing';

import { BorrowingReportService } from './borrowing-report-service';

describe('BorrowingReportService', () => {
  let service: BorrowingReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BorrowingReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
