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

    constructor(
        private readonly elementRef: ElementRef
    ) {

    }

    ngAfterViewInit() {
        this.activeEventType$.subscribe((eventType: EventType) => {
            console.log("type")
            eventType === EventType.PointerEvent
                ? this.addPointerEventListeners()
                : this.addTouchEventListeners();
        })
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
                    this.setStartOrEndPoint(val.x, val.y, 'pink');
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
                    this.setStartOrEndPoint(lastTouchMove.touches[0].clientX, lastTouchMove.touches[0].clientY, 'pink');
                }
            )
        )
    }

    private unsubscribeAll(subscriptions: Subscription[]) {
        subscriptions.forEach(sub => sub.unsubscribe())
    }

    private setStartOrEndPoint(x: number, y: number, color: string) {
        // console.log("TYPE", (this.elementRef.nativeElement as HTMLCanvasElement).f )
        this.elementRef.nativeElement.fillStyle = color;
        this.elementRef.nativeElement.fillRect(x, y, 3, 3);
        this.lastCoordinates = { lastX: x, lastY: y };
    }

    private drawOnCanvas(x: number, y: number, color: string) {
        this.elementRef.nativeElement.beginPath();
        this.elementRef.nativeElement.moveTo(
            this.lastCoordinates.lastX,
            this.lastCoordinates.lastY
        );
        this.elementRef.nativeElement.lineTo(x, y);
        this.elementRef.nativeElement.strokeStyle = '#000000';
        this.elementRef.nativeElement.stroke();

        this.lastCoordinates = { lastX: x, lastY: y };
    }
}