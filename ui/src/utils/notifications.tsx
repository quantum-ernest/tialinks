"use client"
import {notification} from 'antd';
import React, {createContext, useContext, useMemo} from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationContextType {
    openNotification: (type: NotificationType, message: string, description?: string) => void;
    contextHolder: React.ReactNode;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({children}: {children: React.ReactNode}) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type: NotificationType, message: string, description: string = '') => {
        api[type]({
            message,
            description,
            duration: 3,
            showProgress: true
        });
    };

    const value = useMemo(() => ({openNotification, contextHolder}), [contextHolder]);

    return (
        <NotificationContext.Provider value={value}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};
