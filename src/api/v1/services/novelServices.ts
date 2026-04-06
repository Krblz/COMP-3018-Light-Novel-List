import { addNovel, getAllNovels, getNovelById, updateNovel, deleteNovel } from "../repositories/novelRepository";
 
export interface Novel {
    id: string,
    title: string,
    genres: string[],
    themes: string[],
    status: string,     // Read, Unread, Reading
    updatedAt: Date
}

interface NovelsCount {
    novels: Novel[],
    count: number
}

export const getAllNovelsService = async (): Promise<NovelsCount> => {
    const novels = await getAllNovels();
    return { count: novels.length, novels: novels };
};

export const getNovelByIdService = async (id: string): Promise<Novel | null> => {
    return await getNovelById(id);
};

export const createNovelService = async (newNovel: Omit<Novel, 'id' | 'updatedAt'>): Promise<Novel> => {
    const result = await addNovel(newNovel);
    return {
        id: result.id,
        title: newNovel.title,
        genres: newNovel.genres,
        themes: newNovel.themes,
        status: newNovel.status,
        updatedAt: new Date()
    };
};

export const updateNovelService = async (
    id: string, 
    novelData: Partial<Novel>
): Promise<Novel | null> => {
    return await updateNovel(id, novelData);
};

export const deleteNovelService = async (id: string): Promise<boolean> => {
    return await deleteNovel(id);
};