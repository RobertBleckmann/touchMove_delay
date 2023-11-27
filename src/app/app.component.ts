import {Component, ElementRef, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription, withLatestFrom} from 'rxjs';
import {UserActionManager} from "./user-action-manager";
import {EventType} from "./models";

export interface LastCoordinates {
  lastX: number;
  lastY: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  public EventType = EventType;

  @Output()
  public activeEventType$$: Subject<EventType> = new Subject<EventType>();

  constructor(private readonly ref: ElementRef) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.activeEventType$$.unsubscribe();
  }
}
