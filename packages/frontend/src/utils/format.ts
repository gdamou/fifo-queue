import { Action } from "@fifo-queue/shared";

export const formatDate = (date: Date) => {
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const today = new Date();
    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    return isToday ? `Today, ${date.toLocaleTimeString('fr-FR')}` : formatter.format(date);
};


export const formatAction = (action: Action) => {
    return action
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
};