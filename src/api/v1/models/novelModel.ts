export interface Novel {
    id: string,
    title: string,
    genres: string[],
    themes: string[],
    link: string,
    status: string,     // Read, Unread, Reading
    updatedAt: Date
}
