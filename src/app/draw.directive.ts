import {AfterViewInit, Directive, ElementRef, Input, OnInit} from "@angular/core";
import {UserActionManager} from "./user-action-manager";
import {filter, Observable, Subscription, withLatestFrom} from "rxjs";
import {LastCoordinates} from "./app.component";
import {EventType} from "./models";

@Directive({
    selector: "[draw]"
})
export class DrawDirective implements AfterViewInit {

    @Input()
    public activeEventType$: Observable<EventType>;

    private subscriptions: Subscription[] = [];
    private lastCoordinates: LastCoordinates;
    private canvas2d;

    constructor(
        private readonly elementRef: ElementRef
    ) {

    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.width = window.innerWidth - window.innerWidth *0.05;
        this.elementRef.nativeElement.height = window.innerHeight - window.innerHeight *0.05;
        this.canvas2d = this.elementRef.nativeElement.getContext("2d");
        this.activeEventType$.subscribe((eventType: EventType) => {
            console.log("type")
            eventType === EventType.PointerEvent
                ? this.addPointerEventListeners()
                : this.addTouchEventListeners();
        })
        console.log("HÖHE", this.elementRef.nativeElement.offsetTop)
        console.log("HÖHE", this.elementRef.nativeElement.offsetLeft)
    }

    private addPointerEventListeners() {
        this.unsubscribeAll(this.subscriptions);
        this.subscriptions.push(
            UserActionManager.getPointerDownEvent(this.elementRef.nativeElement).subscribe(
                val => {
                    console.log("pointerDown", val);
                    this.setStartOrEndPoint(val.x, val.y, 'red');
                }
            )
        )

        this.subscriptions.push(
            UserActionManager.getPointerMoveEvent(this.elementRef.nativeElement).subscribe(
                val => {
                    console.log("pointerMove", val);
                    this.drawOnCanvas(val.x, val.y, 'black');
                }
            )
        )

        this.subscriptions.push(
            UserActionManager.getPointerUpEvent(this.elementRef.nativeElement).subscribe(
                val => {
                    console.log("pointerUp", val);
                    this.setStartOrEndPoint(val.x, val.y, 'blue');
                }
            )
        )
    }

    private addTouchEventListeners(): void {
        this.unsubscribeAll(this.subscriptions);
        this.subscriptions.push(
            UserActionManager.getTouchStartEvent(this.elementRef.nativeElement).subscribe(
                val => {
                    console.log("touchStart", val);
                    this.setStartOrEndPoint(val.touches[0].clientX, val.touches[0].clientY, 'red');
                }
            )
        )

        this.subscriptions.push(
            UserActionManager.getTouchMoveEvent(this.elementRef.nativeElement).subscribe(
                val => {
                    console.log("touchMove", val);
                    this.drawOnCanvas(val.touches[0].clientX, val.touches[0].clientY, 'black');
                }
            )
        )

        this.subscriptions.push(
            UserActionManager.getTouchEndEvent(this.elementRef.nativeElement).pipe(withLatestFrom(UserActionManager.getTouchMoveEvent(this.elementRef.nativeElement))).subscribe(
                ([_, lastTouchMove]) => {
                    console.log("touchEnd", lastTouchMove);
                    this.setStartOrEndPoint(lastTouchMove.touches[0].clientX, lastTouchMove.touches[0].clientY, 'blue');
                }
            )
        )
    }

    private unsubscribeAll(subscriptions: Subscription[]) {
        subscriptions.forEach(sub => sub.unsubscribe())
    }

    private setStartOrEndPoint(x: number, y: number, color: string) {
        this.canvas2d.fillStyle = color;
        this.canvas2d.fillRect((x - this.elementRef.nativeElement.offsetLeft) - window.innerWidth * 0.002 / 2, (y - this.elementRef.nativeElement.offsetTop) - window.innerWidth * 0.002 / 2, window.innerWidth * 0.002, window.innerWidth * 0.002);
        this.lastCoordinates = { lastX: x, lastY: y };
    }

    private drawOnCanvas(x: number, y: number, color: string) {
        this.canvas2d.beginPath();
        this.canvas2d.moveTo(
            this.lastCoordinates.lastX - this.elementRef.nativeElement.offsetLeft,
            this.lastCoordinates.lastY - this.elementRef.nativeElement.offsetTop
        );
        this.canvas2d.lineTo(x - this.elementRef.nativeElement.offsetLeft, y - this.elementRef.nativeElement.offsetTop);
        this.canvas2d.strokeStyle = '#000000';
        this.canvas2d.stroke();

        this.lastCoordinates = { lastX: x, lastY: y };
    }
}