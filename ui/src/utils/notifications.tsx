import {notification} from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error';


export const displayNotifications = () => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type: NotificationType, message: string, description: string = '') => {
        api[type]({
            message: message,
            description: description,
            duration: 3
        });
    };
    return {contextHolder, openNotification};
}
