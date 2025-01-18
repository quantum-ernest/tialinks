export const setPendingUrl = (pendingUrl: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('pendingUrl', pendingUrl);
    }
};

export const getPendingUrl = (): string | null => {
    if (typeof window !== 'undefined') {
        const pendingUrl = localStorage.getItem('pendingUrl');
        localStorage.removeItem('pendingUrl');
        return pendingUrl
    }
    return null;
};