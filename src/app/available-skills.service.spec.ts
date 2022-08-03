import { TestBed } from '@angular/core/testing';

import { AvailableSkillsService } from './available-skills.service';

describe('AvailableSkillsService', () => {
  let service: AvailableSkillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableSkillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
