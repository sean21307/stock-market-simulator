import { Injectable } from '@angular/core';
import { AppNotification } from '../models/notification.model';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  _notifications: AppNotification[] = [];
  DISPLAY_DURATION = 8000;

  constructor() { }

  get notifications() {
    return this._notifications;
  }

  addNotification(notif: AppNotification) {
    const id = Date.now()
    const notification = { ...notif, id: id }

    if (this._notifications.length >= 20) {
        this._notifications.splice(0, this._notifications.length - 19)
    }

    this._notifications.push(notification)

    setTimeout(() => {
      this.removeNotification(id);
    }, this.DISPLAY_DURATION);
  }
  
  removeNotification(id: number) {
    setTimeout(() => {
        this._notifications = this._notifications.filter(
            (notification) => notification.id !== id,
        )
    }, 0);
  }
}
