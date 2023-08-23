import { inject, TestBed } from '@angular/core/testing';

import { LoginResolverService } from './login-resolver.service';

describe('LoginResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginResolverService]
    });
  });

  it('should be created', inject([LoginResolverService], (service: LoginResolverService) => {
    expect(service).toBeTruthy();
  }));
});
