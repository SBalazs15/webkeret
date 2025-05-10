import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCompareComponent } from './config-compare.component';

describe('ConfigCompareComponent', () => {
  let component: ConfigCompareComponent;
  let fixture: ComponentFixture<ConfigCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigCompareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
