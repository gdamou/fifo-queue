export const deepCopy = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => deepCopy(item)) as unknown as T;
    }

    const clonedObj = {} as T;
    for (const key in obj) {
        const value = (obj as any)[key];
        (clonedObj as any)[key] = deepCopy(value);
    }

    return clonedObj;
};
