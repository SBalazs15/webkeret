import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCompareComponent } from './component-compare.component';

describe('ComponentCompareComponent', () => {
  let component: ComponentCompareComponent;
  let fixture: ComponentFixture<ComponentCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCompareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
