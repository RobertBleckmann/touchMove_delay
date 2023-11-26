import {filter, fromEvent, map, Observable} from "rxjs";

export class UserActionManager {


    public static getPointerDownEvent(doc: Document): Observable<PointerEvent> {
        return fromEvent(doc, "pointerdown").pipe(
            map((pointerDown: PointerEvent) => pointerDown)
        )
    }

    public static getPointerMoveEvent(doc: Document): Observable<PointerEvent> {
        return fromEvent(doc, "pointermove").pipe(
            filter((pointerMove: PointerEvent) => pointerMove.pressure > 0)
        )
    }

    public static getPointerUpEvent(doc: Document): Observable<PointerEvent> {
        return fromEvent(doc, "pointerup").pipe(
            map((pointerUp: PointerEvent) => pointerUp)
        )
    }

    public static getTouchStartEvent(doc: Document): Observable<TouchEvent> {
        return fromEvent(doc, "touchstart").pipe(
            map((touchStart: TouchEvent) => touchStart)
        )
    }

    public static getTouchMoveEvent(doc: Document): Observable<TouchEvent> {
        return fromEvent(doc, "touchmove").pipe(
            map((touchMove: TouchEvent) => touchMove)
        )
    }

    public static getTouchEndEvent(doc: Document): Observable<TouchEvent> {
        return fromEvent(doc, "touchend").pipe(
            map((touchEnd: TouchEvent) => touchEnd)
        )
    }
}