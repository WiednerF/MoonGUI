/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MoonConnectServiceService } from './moon-connect-service.service';

describe('Service: MoonConnectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoonConnectServiceService]
    });
  });

  it('should ...', inject([MoonConnectServiceService], (service: MoonConnectServiceService) => {
    expect(service).toBeTruthy();
  }));
});
