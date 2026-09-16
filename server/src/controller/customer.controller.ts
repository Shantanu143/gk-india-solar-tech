import { customerService } from "../service/customer.service";
import { asyncHandler } from "../util/asyncHandler";
import { can } from "../util/permissions";
import { listCustomersQuerySchema } from "../validation/customer.validation";

export const customerController = {
  list: asyncHandler(async (req, res) => {
    const query = listCustomersQuerySchema.parse(req.query);
    if (!can(req.user!.role, "leads.viewAll")) {
      query.assignedEmployeeId = req.user!.id;
    }
    const result = await customerService.getCustomers(query);
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const customer = await customerService.getCustomer(req.params.id);
    res.json({ customer });
  }),

  getForLead: asyncHandler(async (req, res) => {
    const customer = await customerService.getCustomerByLeadId(req.params.leadId);
    res.json({ customer });
  }),
};
