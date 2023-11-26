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

  private canvas: HTMLCanvasElement;
  private canvas2d;

  constructor(private readonly ref: ElementRef) {}

  ngOnInit() {
    // this.activeEventType$$.asObservable().subscribe((eventType: EventType) => {
    //   console.log('sub', eventType);
    //   eventType === EventType.PointerEvent
    //     ? this.addPointerEventListeners()
    //     : this.addTouchEventListeners();
    // });
  }

  ngOnDestroy() {
    this.activeEventType$$.unsubscribe();
  }

  ngAfterViewInit() {
    this.canvas = document.querySelector('#Canvas');
    this.canvas2d = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
