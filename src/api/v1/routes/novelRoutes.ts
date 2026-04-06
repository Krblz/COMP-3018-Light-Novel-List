import { Router } from "express";
import { getAllNovels, getNovelById, createNovel, updateNovel, deleteNovel } from "../controller/novelController";
// import { validateRequest } from "../middleware/validate";
// import { novelSchemas } from "../validation/novelSchemas";

const router: Router = Router();

router.get('/novels', getAllNovels);
router.get('/novels/:id', getNovelById);
router.post('/novels', createNovel);
router.put('/novels/:id', updateNovel);
router.delete('/novels/:id', deleteNovel);

// router.get('/novels', getAllNovels);
// router.get('/novels/:id', validateRequest(novelSchemas.getById), getNovelById);
// router.post('/novels', validateRequest(novelSchemas.create), createNovel);
// router.put('/novels/:id', validateRequest(novelSchemas.update), updateNovel);
// router.delete('/novels/:id', validateRequest(novelSchemas.delete), deleteNovel);

export default router;