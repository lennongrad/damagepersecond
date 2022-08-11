import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterTooltipComponent } from './character-tooltip.component';

describe('CharacterTooltipComponent', () => {
  let component: CharacterTooltipComponent;
  let fixture: ComponentFixture<CharacterTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
