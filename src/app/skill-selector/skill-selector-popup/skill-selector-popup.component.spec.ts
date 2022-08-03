import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillSelectorPopupComponent } from './skill-selector-popup.component';

describe('SkillSelectorPopupComponent', () => {
  let component: SkillSelectorPopupComponent;
  let fixture: ComponentFixture<SkillSelectorPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillSelectorPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillSelectorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
