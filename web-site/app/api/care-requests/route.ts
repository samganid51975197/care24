import {withActor,scope,scopedId,ownership,workflowGuard,type Actor} from "../../../lib/auth";
import { and, asc, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { applications, careRequests } from "../../../db/schema";

const maskName = (name: string) => name.length < 2 ? "비공개" : `${name[0]}${"○".repeat(Math.max(1, name.length - 1))}`;
const contractNumber = (id: number, createdAt: string) => `CR-${createdAt.slice(0, 10).replaceAll("-", "")}-${String(id).padStart(5, "0")}`;

async function handleGET(req:Request, actor:Actor) {
  try {
    const db = getDb();
    const [allRequests, profiles] = await Promise.all([
      db.select().from(careRequests).where(scope(careRequests,actor)).orderBy(asc(careRequests.id)).limit(1000),
      db.select({ id: applications.id, applicantName: applications.applicantName, applicantGender: applications.applicantGender, careerYears: applications.careerYears, qualification: applications.qualification, preferredDate: applications.preferredDate, status: applications.status }).from(applications).where(scope(applications,actor)).orderBy(desc(applications.id)).limit(100),
    ]);
    const now = new Date(), dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(), day = 86400000;
    const starts: Record<string, number> = { day: dayStart, week: dayStart - 6 * day, month: new Date(now.getFullYear(), now.getMonth(), 1).getTime(), year: new Date(now.getFullYear(), 0, 1).getTime() };
    const stats = Object.fromEntries(Object.entries(starts).map(([key, start]) => {
      const rows = allRequests.filter((item) => new Date(item.createdAt.replace(" ", "T") + "Z").getTime() >= start);
      return [key, { total: rows.length, matched: rows.filter((item) => item.status === "matched").length }];
    }));
    return Response.json({
      requests: allRequests.filter((item) => item.status !== "matched").map((item) => ({
        id: item.id,
        contractNumber: contractNumber(item.id, item.createdAt),
        building: item.building,
        floorName: item.floorName || "미입력",
        ward: item.ward,
        patientGender: item.patientGender,
        patientAge: item.patientAge,
        patientWeight: item.patientWeight,
        patientName: maskName(item.patientName),
        diagnosis: item.diagnosis,
        patientCondition: [item.patientCondition, item.patientAge && `${item.patientAge}세`, item.patientWeight && `${item.patientWeight}kg`].filter(Boolean).join(" · "),
        precautions: item.precautions,
        specialNotes: item.specialNotes,
        desiredGender: item.desiredGender,
        desiredNationality: item.desiredNationality,
        desiredExpertise: item.desiredExpertise,
        desiredAge: item.desiredAge,
        desiredPersonality: item.desiredPersonality,
        desiredOther: item.desiredOther,
        status: item.status,
      })),
      profiles: profiles.map((profile) => ({
        id: profile.id,
        applicantName: maskName(profile.applicantName),
        applicantGender: profile.applicantGender,
        careerYears: profile.careerYears,
        qualification: profile.qualification,
        preferredDate: profile.preferredDate,
      })), stats,
    });
  } catch {
    return Response.json({ error: "실시간 간병 매칭 현황을 불러올 수 없습니다." }, { status: 500 });
  }
}

async function handlePOST(req:Request, actor:Actor) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const required = ["requesterName", "requesterPhone", "patientName", "patientGender", "patientAge", "patientWeight", "diagnosis", "patientCondition", "building", "floorName", "ward", "careType", "startDate", "serviceSchedule", "careFee", "feePeriod", "paymentMethod", "paymentDue", "serviceScope", "cancellationTerms", "requesterSignature"];
    if (!required.every((key) => String(body[key] || "").trim())) return Response.json({ error: "필수 의뢰 항목을 모두 작성해 주세요." }, { status: 400 });
    if (String(body.publicConsent) !== "동의") return Response.json({ error: "민감정보 공개 동의가 필요합니다." }, { status: 400 });
    if (String(body.contractConsent) !== "동의") return Response.json({ error: "간병 의뢰계약서 내용을 확인하고 동의해 주세요." }, { status: 400 });
    const room = String(body.roomStatus) === "emergency_waiting" ? "응급실 대기 중 (병실 미배정·간병인 미지정)" : String(body.room || "");
    if (!room.trim()) return Response.json({ error: "병실을 입력하거나 응급실 대기 중을 선택해 주세요." }, { status: 400 });
    const [request] = await getDb().insert(careRequests).values({
      requesterName: String(body.requesterName), requesterPhone: String(body.requesterPhone), patientName: String(body.patientName), patientGender: String(body.patientGender), patientAge: String(body.patientAge), patientWeight: String(body.patientWeight), diagnosis: String(body.diagnosis), patientCondition: String(body.patientCondition), precautions: String(body.precautions || ""), specialNotes: String(body.specialNotes || ""), publicConsent: "동의", building: String(body.building), floorName: String(body.floorName), ward: String(body.ward), room, careType: String(body.careType), startDate: String(body.startDate), requestNote: String(body.requestNote || ""), serviceSchedule: String(body.serviceSchedule), serviceStartTime: String(body.serviceStartTime || ""), serviceEndTime: String(body.serviceEndTime || ""), restTime: String(body.restTime || "상호 협의"), holidayTerms: String(body.holidayTerms || "상호 협의"), careFee: String(body.careFee), feePeriod: String(body.feePeriod), paymentMethod: String(body.paymentMethod), paymentDue: String(body.paymentDue), serviceScope: String(body.serviceScope), cancellationTerms: String(body.cancellationTerms), contractNote: String(body.contractNote || ""), requesterSignature: String(body.requesterSignature), contractConsent: "동의", contractVersion: "간병24 의뢰계약서 v1.0", contractSignedAt: new Date().toISOString(), desiredGender: String(body.desiredGender || "무관"), desiredNationality: String(body.desiredNationality || "무관"), desiredExpertise: String(body.desiredExpertise || "무관"), desiredAge: String(body.desiredAge || "무관"), desiredPersonality: String(body.desiredPersonality || "무관"), desiredOther: String(body.desiredOther || ""), status: "requesting",
    }).returning();
    return Response.json({ request, contract: { number: contractNumber(request.id, request.createdAt), status: "자동생성 완료", publicStatus: "공개 완료" } }, { status: 201 });
  } catch {
    return Response.json({ error: "간병 의뢰를 저장하지 못했습니다." }, { status: 500 });
  }
}

async function handlePATCH(req:Request, actor:Actor) {
  try {
    const body = await req.json() as Record<string, unknown>, id = Number(body.id), action = String(body.action || "");
    if (!id) return Response.json({ error: "의뢰번호를 확인해 주세요." }, { status: 400 });
    const db = getDb();
    if (action === "apply") {
      const caregiverId = Number(body.caregiverId);
      const [profile] = await db.select().from(applications).where(scopedId(applications,caregiverId,actor)).limit(1);
      if (!profile) return Response.json({ error: "저장된 간병인 프로필을 선택해 주세요." }, { status: 400 });
      const summary = [profile.applicantGender, `경력 ${profile.careerYears}`, profile.qualification].filter(Boolean).join(" · ");
      const [request] = await db.update(careRequests).set({ status: "matched", caregiverId, caregiverName: profile.applicantName, caregiverProfile: summary, matchedAt: new Date().toISOString() }).where(and(scopedId(careRequests,id,actor), eq(careRequests.status, "requesting"))).returning();
      if (!request) return Response.json({ error: "이미 다른 간병인과 매칭이 완료된 의뢰입니다." }, { status: 409 });
      return Response.json({ request, contract: { number: contractNumber(request.id, request.createdAt), status: "매칭완료" } });
    }
    if (action === "complete") {
      const [request] = await db.update(careRequests).set({ status: "matched", matchedAt: new Date().toISOString() }).where(scopedId(careRequests,id,actor)).returning();
      return Response.json({ request });
    }
    return Response.json({ error: "처리 방법을 확인해 주세요." }, { status: 400 });
  } catch {
    return Response.json({ error: "매칭 상태를 변경하지 못했습니다." }, { status: 500 });
  }
}

export const GET=(req:Request)=>withActor(req,async(actor)=>{await workflowGuard(req,actor);return handleGET(req,actor);});
export const POST=(req:Request)=>withActor(req,async(actor)=>{await workflowGuard(req,actor);return handlePOST(req,actor);});
export const PATCH=(req:Request)=>withActor(req,async(actor)=>{await workflowGuard(req,actor);return handlePATCH(req,actor);});
