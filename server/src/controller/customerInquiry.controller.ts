import { customerInquiryService } from "../service/customerInquiry.service";
import { asyncHandler } from "../util/asyncHandler";

export const customerInquiryController = {
  getMine: asyncHandler(async (req, res) => {
    const items = await customerInquiryService.getMyInquiries(req.user!.id);
    res.json({ items });
  }),
};
