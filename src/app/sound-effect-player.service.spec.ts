import { TestBed } from '@angular/core/testing';

import { SoundEffectPlayerService } from './sound-effect-player.service';

describe('SoundEffectPlayerService', () => {
  let service: SoundEffectPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundEffectPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
