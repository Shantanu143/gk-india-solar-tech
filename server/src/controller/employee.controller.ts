import { z } from "zod";
import { employeeService } from "../service/employee.service";
import { asyncHandler } from "../util/asyncHandler";

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  // 500 comfortably covers "list every employee, no pagination UI" call sites.
  pageSize: z.coerce.number().int().positive().max(500).default(20),
  search: z.string().trim().optional(),
});

export const employeeController = {
  create: asyncHandler(async (req, res) => {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ employee });
  }),

  list: asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);
    const result = await employeeService.listEmployees(query);
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const employee = await employeeService.getEmployee(req.params.id);
    res.json({ employee });
  }),

  update: asyncHandler(async (req, res) => {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);
    res.json({ employee });
  }),

  setStatus: asyncHandler(async (req, res) => {
    const employee = await employeeService.setEmployeeStatus(req.params.id, req.body.status);
    res.json({ employee });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await employeeService.resetEmployeePassword(req.params.id, req.body.password);
    res.status(204).send();
  }),
};
