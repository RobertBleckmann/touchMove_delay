import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export enum EventType {
  PointerEvent,
  TouchEvent,
}

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
  private pointerActive: boolean = false;
  public activeEventType$$: Subject<EventType> = new Subject<EventType>();

  private canvas: HTMLCanvasElement;
  private canvas2d;

  private lastCoordinates: LastCoordinates;

  constructor() {}

  ngOnInit() {
    this.activeEventType$$.asObservable().subscribe((eventType: EventType) => {
      console.log('sub', eventType);
      eventType === EventType.PointerEvent
        ? this.addPointerEventListeners()
        : this.addTouchEventListeners();
    });
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

  private addPointerEventListeners(): void {
    this.removeAllEventListeners();
    document.addEventListener('pointerdown', (event: PointerEvent) => {
      this.pointerActive = true;
      this.setStartOrEndPoint(event.x, event.y, 'red');
    });

    document.addEventListener('pointermove', (event: PointerEvent) => {
      if (this.pointerActive) {
        console.log('pointer move', event.x, event.y);
        this.drawOnCanvas(event.x, event.y, 'green');
      }
    });

    document.addEventListener('pointerup', (event: PointerEvent) => {
      this.pointerActive = false;
      this.setStartOrEndPoint(event.x, event.y, 'blue');
    });
  }

  private addTouchEventListeners(): void {
    this.removeAllEventListeners();
    document.addEventListener('touchstart', (event: TouchEvent) => {
      event.preventDefault();
      this.setStartOrEndPoint(
        event.touches[0].clientX,
        event.touches[0].clientY,
        'red'
      );
    });

    document.addEventListener('touchmove', (event: TouchEvent) => {
      event.preventDefault();
      console.log('touchmove');
      this.drawOnCanvas(
        event.touches[0].clientX,
        event.touches[0].clientY,
        'green'
      );
    });

    document.addEventListener('touchend', (event: TouchEvent) => {
      this.setStartOrEndPoint(
        this.lastCoordinates.lastX,
        this.lastCoordinates.lastY,
        'blue'
      );
    });
  }

  private removeAllEventListeners(): void {
    document.removeAllListeners();
  }

  private setStartOrEndPoint(x: number, y: number, color: string) {
    this.canvas2d.fillStyle = color;
    this.canvas2d.fillRect(x, y, 3, 3);
    this.lastCoordinates = { lastX: x, lastY: y };
  }

  private drawOnCanvas(x: number, y: number, color: string) {
    this.canvas2d.beginPath();
    this.canvas2d.moveTo(
      this.lastCoordinates.lastX,
      this.lastCoordinates.lastY
    );
    this.canvas2d.lineTo(x, y);
    this.canvas2d.strokeStyle = '#000000';
    this.canvas2d.stroke();

    this.lastCoordinates = { lastX: x, lastY: y };
  }
}
