import { getAuditLogs} from "../controller/logsController"
import {Router} from "express";

const router = Router();

router.get('/', getAuditLogs);

export default router;