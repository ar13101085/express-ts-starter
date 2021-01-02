import { Router, Response, NextFunction } from "express";
import { DefaultPayloadModel } from "../../models/DefaultPayload";
import Request from "../../types/Request";
var multer = require('multer')
const upload = multer({ dest: 'uploads/' })


const router: Router = Router();
router.post("/uploadProfilePhoto", upload.single('img'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let uploadedFileName: string = req.file.filename;
        let response: DefaultPayloadModel<String> = {
            isSuccess: true,
            msg: "successfully upload photo",
            data: uploadedFileName
        }
        res.send(response);
    } catch (error) {
        next(error);
    }
});

export default router;