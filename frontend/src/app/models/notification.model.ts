export interface AppNotification { 
    id?: any;
    variant: 'info' | 'message' | 'success' | 'danger' | 'warning', 
    title: string,
    message: string,
}