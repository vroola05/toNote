export interface ApplicationConfig {
    api: {
        url: string
    };
    content: {
        delay: number
    };
}

export interface SessionState {
    locked: boolean;
}
