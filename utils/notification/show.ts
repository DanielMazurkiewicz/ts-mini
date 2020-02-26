
let granted: boolean;

switch (Notification.permission) {
    case "default":
        Notification.requestPermission().then(permission => {
            granted = permission === 'granted';
        });
        break;
    case "granted":
        granted = true;
}

export default (title: string, options?: NotificationOptions, notificationObjectOptions?: Record<string, any>) => {
    if (granted) {
        const notification = new Notification(title, options);
        for (let opt in notificationObjectOptions) {
            if (opt.startsWith('*')) {
                // @ts-ignore
                notification[opt.substr(1)](...notificationObjectOptions[opt]);                
            } else {
                // @ts-ignore
                notification[opt] = notificationObjectOptions[opt];
            }
        }
        return notification;
    }
    
}