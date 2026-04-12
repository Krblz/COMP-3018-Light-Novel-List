import { db } from "../../../../config/firebaseConfig";
import { DocumentReference } from "firebase-admin/firestore";
import { QuerySnapshot } from "firebase-admin/firestore";
import { Novel } from "../services/novelServices";

export const addNovel = async (novelData: Omit<Novel, 'id' | 'updatedAt'>): Promise<{ id: string }> => {
    const currentNovels: QuerySnapshot = await db.collection("novels").get();
    
    let maxNumber = 0;
    currentNovels.docs.forEach(doc => {
        const number = parseInt(doc.id);
        if (!isNaN(number) && number > maxNumber) {
            maxNumber = number;
        }
    });
    
    const newId = String(maxNumber + 1);
    
    const novelRef: DocumentReference = db.collection("novels").doc(newId);
    
    await novelRef.set({
        title: novelData.title,
        genres: novelData.genres,
        themes: novelData.themes,
        status: novelData.status,
        updatedAt: new Date(),
    });

    return { id: newId };
};

export const getAllNovels = async (): Promise<Novel[]> => {
    const currentNovels: QuerySnapshot = await db.collection("novels").get();
    
    const novels: Novel[] = [];
    currentNovels.docs.forEach(doc => {
        novels.push({
            id: doc.id,
            title: doc.data().title,
            genres: doc.data().genres,
            themes: doc.data().themes,
            status: doc.data().status,
            updatedAt: doc.data().updatedAt,
        });
    });
    
    return novels;
};

export const getNovelById = async (id: string): Promise<Novel | null> => {
    const novelRef: DocumentReference = db.collection("novels").doc(id);
    const novel = await novelRef.get();
    
    if (!novel.exists) {
        return null;
    }
    
    return {
        id: novel.id,
        title: novel.data()!.title,
        genres: novel.data()!.genres,
        themes: novel.data()!.themes,
        status: novel.data()!.status,
        updatedAt: novel.data()!.updatedAt,
    };
};

export const updateNovel = async (id: string, novelData: Partial<Novel>): Promise<Novel | null> => {
    const novelRef: DocumentReference = db.collection("novels").doc(id);
    const novel = await novelRef.get();
    
    if (!novel.exists) {
        return null;
    }
    
    const updateData: any = { updatedAt: new Date() };
    
    if (novelData.title !== undefined) updateData.title = novelData.title;
    if (novelData.genres !== undefined) updateData.genres = novelData.genres;
    if (novelData.themes !== undefined) updateData.themes = novelData.themes;
    if (novelData.status !== undefined) updateData.status = novelData.status;
    
    await novelRef.update(updateData);
    
    const updatedNovel = await novelRef.get();
    
    return {
        id: updatedNovel.id,
        title: updatedNovel.data()!.title,
        genres: updatedNovel.data()!.genres,
        themes: updatedNovel.data()!.themes,
        status: updatedNovel.data()!.status,
        updatedAt: updatedNovel.data()!.updatedAt,
    };
};

export const deleteNovel = async (id: string): Promise<boolean> => {
    const novelRef: DocumentReference = db.collection("novels").doc(id);
    const novel = await novelRef.get();
    
    if (!novel.exists) {
        return false;
    }
    
    await novelRef.delete();
    return true;
};