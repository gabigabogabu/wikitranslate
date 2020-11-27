import { TestBed } from '@angular/core/testing';

import { WikipediaService } from './wikipedia.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('WikipediaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
  })});

  it('should be created', () => {
    const service: WikipediaService = TestBed.get(WikipediaService);
    expect(service).toBeTruthy();
  });
});
