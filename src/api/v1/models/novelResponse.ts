import { Novel } from "./novelModel";

export interface NovelResponse {
    id: string;
    title: string;
    genres: string[];
    themes: string[];
    status: string;
    updatedAt: string;
    genreWarning?: string;
}

export const toNovelResponse = (novel: Novel): NovelResponse => {
    const safeToISOString = (dateValue: any): string => {
        if (!dateValue) return new Date().toISOString();
        
        try {
            if (dateValue instanceof Date) {
                return dateValue.toISOString();
            }
            const date = new Date(dateValue);
            
            if (isNaN(date.getTime())) {
                return new Date().toISOString();
            }
            
            return date.toISOString();
        } catch (error) {
            return new Date().toISOString();
        }
    };

    const genreWarning = novel.genres.includes("N/A") 
        ? "No genres have been added for this novel. Consider adding a genre." 
        : undefined;
    
    return {
        id: novel.id,
        title: novel.title,
        genres: novel.genres,
        themes: novel.themes,
        status: novel.status,
        updatedAt: safeToISOString(novel.updatedAt),
        ...(genreWarning && { genreWarning })
    };
};