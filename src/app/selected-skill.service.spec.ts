import { TestBed } from '@angular/core/testing';

import { SelectedSkillService } from './selected-skill.service';

describe('SelectedSkillService', () => {
  let service: SelectedSkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedSkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
