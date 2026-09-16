/**
 * Idempotent dev seed — creates the platform's known employees (+ admin) as real Users, plus a
 * handful of realistic, connected leads/follow-ups/activities/surveys so the app isn't empty on
 * first login. Safe to re-run: everything upserts by a natural key, never duplicates.
 *
 * Usage: npm run seed
 */
import { connectDatabase, disconnectDatabase } from "../config/db";
import { logger } from "../config/logger";
import { UserModel, type UserRole } from "../models/User.model";
import { LeadModel } from "../models/Lead.model";
import { FollowUpModel } from "../models/FollowUp.model";
import { ActivityModel } from "../models/Activity.model";
import { SurveyModel } from "../models/Survey.model";
import { FinalSolarConfigurationModel } from "../models/FinalSolarConfiguration.model";
import { ProductModel } from "../models/Product.model";
import { NotificationModel } from "../models/Notification.model";
import { hashPassword } from "../util/password";

const SEED_PASSWORD = "Password123";

const SEED_USERS: { name: string; email: string; phone: string; role: UserRole; status: "ACTIVE" | "INACTIVE" }[] = [
  { name: "Admin User", email: "admin@gkindiasolartech.in", phone: "9800000001", role: "ADMIN", status: "ACTIVE" },
  { name: "Amit Sharma", email: "amit.sharma@gkindiasolartech.in", phone: "9800000002", role: "SALES_EXECUTIVE", status: "ACTIVE" },
  { name: "Priya Deshmukh", email: "priya.deshmukh@gkindiasolartech.in", phone: "9800000003", role: "SALES_EXECUTIVE", status: "ACTIVE" },
  { name: "Rohan Kulkarni", email: "rohan.kulkarni@gkindiasolartech.in", phone: "9800000004", role: "SALES_MANAGER", status: "ACTIVE" },
  { name: "Sagar Patil", email: "sagar.patil@gkindiasolartech.in", phone: "9800000005", role: "SURVEY_ENGINEER", status: "ACTIVE" },
  { name: "Neha Joshi", email: "neha.joshi@gkindiasolartech.in", phone: "9800000006", role: "SALES_EXECUTIVE", status: "INACTIVE" },
];

function daysAgo(days: number, hour = 10): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(hour - 5, 30, 0, 0);
  return d;
}

function isoDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  await connectDatabase();

  const passwordHash = await hashPassword(SEED_PASSWORD);
  const employeeByEmail = new Map<string, string>();

  for (const seedUser of SEED_USERS) {
    const user = await UserModel.findOneAndUpdate(
      { email: seedUser.email },
      { $setOnInsert: { ...seedUser, passwordHash } },
      { upsert: true, new: true },
    );
    employeeByEmail.set(seedUser.email, user._id.toString());
    logger.info(`Seeded employee: ${seedUser.email} (${seedUser.role}${seedUser.status === "INACTIVE" ? ", INACTIVE" : ""})`);
  }

  const amitId = employeeByEmail.get("amit.sharma@gkindiasolartech.in")!;
  const priyaId = employeeByEmail.get("priya.deshmukh@gkindiasolartech.in")!;
  const sagarId = employeeByEmail.get("sagar.patil@gkindiasolartech.in")!;

  // --- Leads (storyline, matching the original mock demo data) ---
  const leadSeeds = [
    {
      leadId: "GK-LEAD-2026-00125",
      customer: { fullName: "Rahul Patil", mobile: "9820012345", whatsapp: "9820012345", email: "rahul.patil@example.com", address: "Pune, Maharashtra" },
      projectType: "RESIDENTIAL" as const,
      location: { pincode: "411001", city: "Pune", address: "Pune, Maharashtra" },
      monthlyBill: 5000,
      solarRecommendation: { recommendedCapacity: 5, estimatedPanels: 10, panelCapacity: 550, recommendedInverter: 5 },
      source: "GOOGLE_ADS" as const,
      status: "FOLLOW_UP" as const,
      interest: "HIGH" as const,
      priority: "HIGH" as const,
      assignedEmployeeId: amitId,
      createdDaysAgo: 6,
    },
    {
      leadId: "GK-LEAD-2026-00126",
      customer: { fullName: "Priya Shah", mobile: "9820012346", whatsapp: "9820012346", email: "priya.shah@example.com", address: "Mumbai, Maharashtra" },
      projectType: "COMMERCIAL" as const,
      location: { pincode: "400001", city: "Mumbai", address: "Mumbai, Maharashtra" },
      monthlyBill: 25000,
      solarRecommendation: { recommendedCapacity: 25, estimatedPanels: 46, panelCapacity: 550, recommendedInverter: 25 },
      source: "REFERRAL" as const,
      status: "SURVEY_REQUESTED" as const,
      interest: "MEDIUM" as const,
      priority: "MEDIUM" as const,
      assignedEmployeeId: priyaId,
      createdDaysAgo: 9,
    },
    {
      leadId: "GK-LEAD-2026-00127",
      customer: { fullName: "Sagar Patil", mobile: "9820012347", whatsapp: "9820012347", email: "sagar.customer@example.com", address: "Pune, Maharashtra" },
      projectType: "RESIDENTIAL" as const,
      location: { pincode: "411001", city: "Pune", address: "Pune, Maharashtra" },
      monthlyBill: 5000,
      solarRecommendation: { recommendedCapacity: 5, estimatedPanels: 10, panelCapacity: 550, recommendedInverter: 5 },
      source: "FACEBOOK" as const,
      status: "SURVEY_COMPLETED" as const,
      interest: "HIGH" as const,
      priority: "HIGH" as const,
      assignedEmployeeId: amitId,
      createdDaysAgo: 11,
    },
    {
      leadId: "GK-LEAD-2026-00128",
      customer: { fullName: "Anjali Deshmukh", mobile: "9820012348", whatsapp: "9820012348", email: "anjali.deshmukh@example.com", address: "Bengaluru, Karnataka" },
      projectType: "RESIDENTIAL" as const,
      location: { pincode: "560001", city: "Bengaluru", address: "Bengaluru, Karnataka" },
      monthlyBill: 5000,
      solarRecommendation: { recommendedCapacity: 5, estimatedPanels: 10, panelCapacity: 550, recommendedInverter: 5 },
      source: "DIRECT" as const,
      status: "NEW" as const,
      interest: "MEDIUM" as const,
      priority: "MEDIUM" as const,
      assignedEmployeeId: null,
      createdDaysAgo: 0,
    },
  ];

  const leadByCode = new Map<string, string>();
  for (const seed of leadSeeds) {
    const { createdDaysAgo, ...leadData } = seed;
    const lead = await LeadModel.findOneAndUpdate(
      { leadId: seed.leadId },
      { $setOnInsert: { ...leadData, createdAt: daysAgo(createdDaysAgo), updatedAt: daysAgo(Math.max(0, createdDaysAgo - 1)) } },
      // timestamps:false — Mongoose's automatic updatedAt write would otherwise collide with the
      // explicit backdated one above ($set and $setOnInsert can't both touch the same path).
      { upsert: true, new: true, timestamps: false },
    );
    leadByCode.set(seed.leadId, lead._id.toString());

    const activityCount = await ActivityModel.countDocuments({ lead: lead._id });
    if (activityCount === 0) {
      await ActivityModel.create({ lead: lead._id, type: "LEAD_CREATED", actorName: "System", description: "Lead created from website solar estimate", createdAt: daysAgo(createdDaysAgo, 9) });
      if (seed.assignedEmployeeId) {
        const assignee = SEED_USERS.find((u) => employeeByEmail.get(u.email) === seed.assignedEmployeeId);
        await ActivityModel.create({ lead: lead._id, type: "LEAD_ASSIGNED", actorName: "Admin User", description: `Lead assigned to ${assignee?.name ?? "an employee"}`, createdAt: daysAgo(createdDaysAgo, 10) });
        await NotificationModel.create({
          recipient: seed.assignedEmployeeId,
          type: "LEAD_ASSIGNED",
          title: "New Lead Assigned",
          description: `${seed.customer.fullName} — ${seed.projectType} · ${seed.solarRecommendation.recommendedCapacity} kW`,
          lead: lead._id,
          read: false,
          createdAt: daysAgo(createdDaysAgo, 10),
        });
      }
    }
    logger.info(`Seeded lead: ${seed.leadId} — ${seed.customer.fullName} (${seed.status})`);
  }

  const rahulId = leadByCode.get("GK-LEAD-2026-00125")!;
  const priyaLeadId = leadByCode.get("GK-LEAD-2026-00126")!;
  const sagarLeadId = leadByCode.get("GK-LEAD-2026-00127")!;

  // --- Follow-ups ---
  const followUpExists = await FollowUpModel.countDocuments({ lead: rahulId });
  if (followUpExists === 0) {
    await FollowUpModel.create({
      lead: rahulId,
      customerName: "Rahul Patil",
      assignedEmployeeId: amitId,
      type: "CALL",
      date: isoDateOffset(0),
      time: "11:00",
      status: "PENDING",
      priority: "HIGH",
      notes: "Customer interested in 5 kW solar. Site survey required.",
      createdBy: "Amit Sharma",
    });
    logger.info("Seeded follow-up: Rahul Patil — today, 11:00");
  }
  const priyaFollowUpExists = await FollowUpModel.countDocuments({ lead: priyaLeadId });
  if (priyaFollowUpExists === 0) {
    await FollowUpModel.create({
      lead: priyaLeadId,
      customerName: "Priya Shah",
      assignedEmployeeId: priyaId,
      type: "WHATSAPP",
      date: isoDateOffset(2),
      time: "14:00",
      status: "PENDING",
      priority: "MEDIUM",
      notes: "Confirm site survey slot.",
      createdBy: "Priya Deshmukh",
    });
    logger.info("Seeded follow-up: Priya Shah — in 2 days, 14:00");
  }

  // --- Surveys ---
  const prSurveyExists = await SurveyModel.countDocuments({ lead: priyaLeadId });
  if (prSurveyExists === 0) {
    await SurveyModel.create({
      lead: priyaLeadId,
      customerName: "Priya Shah",
      address: "Mumbai, Maharashtra",
      location: { pincode: "400001", city: "Mumbai", address: "Mumbai, Maharashtra" },
      date: isoDateOffset(3),
      time: "11:00",
      engineerId: sagarId,
      status: "SCHEDULED",
      roofPhotos: [],
      scheduledBy: "Priya Deshmukh",
    });
    await NotificationModel.create({
      recipient: sagarId,
      type: "SURVEY_SCHEDULED",
      title: "Survey Scheduled",
      description: `Site survey requested for Priya Shah — ${isoDateOffset(3)} at 11:00`,
      lead: priyaLeadId,
      read: false,
      createdAt: daysAgo(0, 9),
    });
    logger.info("Seeded survey: Priya Shah — scheduled in 3 days");
  }

  const sagarSurveyExists = await SurveyModel.findOne({ lead: sagarLeadId });
  let sagarSurveyId = sagarSurveyExists?._id.toString();
  if (!sagarSurveyExists) {
    const survey = await SurveyModel.create({
      lead: sagarLeadId,
      customerName: "Sagar Patil",
      address: "Pune, Maharashtra",
      location: { pincode: "411001", city: "Pune", address: "Pune, Maharashtra" },
      date: isoDateOffset(-1),
      time: "15:00",
      engineerId: sagarId,
      status: "COMPLETED",
      roofAssessment: { roofType: "RCC", roofAreaSqft: 450, roofCondition: "GOOD", shadowLevel: "LOW", meterType: "SINGLE_PHASE" },
      roofPhotos: [],
      scheduledBy: "Amit Sharma",
      startedAt: daysAgo(1, 15),
      completedAt: daysAgo(1, 16),
      notes: "Roof has low afternoon shadow from the neighboring building.",
    });
    sagarSurveyId = survey._id.toString();
    logger.info("Seeded survey: Sagar Patil — completed");

    await FinalSolarConfigurationModel.create({
      lead: sagarLeadId,
      survey: sagarSurveyId,
      systemCapacityKw: 5,
      panelModel: "550W Mono PERC",
      panelWattage: 550,
      numberOfPanels: 10,
      inverterCapacityKw: 5,
      structureType: "GK India SolarTech Structure",
      installationType: "RCC_ROOFTOP",
      preparedBy: "Amit Sharma",
    });
    logger.info("Seeded final solar configuration for Sagar Patil's survey");
  }

  // --- Product catalog (matched against a lead's final configuration when a quotation is generated) ---
  const productSeeds = [
    { sku: "PNL-550-MPERC", name: "550W Mono PERC", category: "PANEL" as const, unitPrice: 15000, unit: "PIECE" as const, specs: { wattage: "550" } },
    { sku: "INV-5KW-STD", name: "5kW Solar Inverter", category: "INVERTER" as const, unitPrice: 35000, unit: "PIECE" as const, specs: { capacityKw: "5" } },
    { sku: "INV-25KW-CMRC", name: "25kW Commercial Inverter", category: "INVERTER" as const, unitPrice: 140000, unit: "PIECE" as const, specs: { capacityKw: "25" } },
    { sku: "STR-STD-RCC", name: "GK India SolarTech Structure", category: "STRUCTURE" as const, unitPrice: 25000, unit: "SET" as const },
  ];
  for (const seed of productSeeds) {
    await ProductModel.findOneAndUpdate({ sku: seed.sku }, { $setOnInsert: { ...seed, status: "ACTIVE" } }, { upsert: true });
    logger.info(`Seeded product: ${seed.sku} — ${seed.name}`);
  }

  logger.info("");
  logger.info("=== Seed complete ===");
  logger.info(`Shared password for every seeded employee account: ${SEED_PASSWORD}`);
  logger.info("Log in at /login with any email above (Neha Joshi is deliberately INACTIVE, to exercise that path).");

  await disconnectDatabase();
}

main().catch((err) => {
  logger.error("Seed failed:", err);
  process.exit(1);
});
