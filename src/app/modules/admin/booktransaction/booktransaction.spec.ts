import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Booktransaction } from './booktransaction';

describe('Booktransaction', () => {
  let component: Booktransaction;
  let fixture: ComponentFixture<Booktransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Booktransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Booktransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
