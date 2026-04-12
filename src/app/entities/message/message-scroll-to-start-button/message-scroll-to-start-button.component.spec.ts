import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageScrollToStartButtonComponent } from './message-scroll-to-start-button.component';

describe('MessageScrollToStartButtonComponent', () => {
  let component: MessageScrollToStartButtonComponent;
  let fixture: ComponentFixture<MessageScrollToStartButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageScrollToStartButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageScrollToStartButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
