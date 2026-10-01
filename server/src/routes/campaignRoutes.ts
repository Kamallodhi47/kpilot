import { Router } from 'express';
import { getCampaigns, createCampaign } from '../controllers/campaignController';

const router = Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);

export default router;
