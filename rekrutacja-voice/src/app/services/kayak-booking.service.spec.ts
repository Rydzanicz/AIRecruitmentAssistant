import {TestBed} from '@angular/core/testing';

import {KayakBookingService} from './kayak-booking.service';

describe('KayakBookingService', () => {
  let service: KayakBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KayakBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
