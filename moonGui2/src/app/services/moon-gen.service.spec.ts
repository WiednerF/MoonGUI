/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MoonGenService } from './moon-gen.service';

describe('Service: MoonGen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoonGenService]
    });
  });

  it('should ...', inject([MoonGenService], (service: MoonGenService) => {
    expect(service).toBeTruthy();
  }));
});
