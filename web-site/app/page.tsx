"use client";
import { useEffect, useRef, useState } from "react";
import {
  BellRing,
  ArrowLeft,
  Building2,
  Camera,
  ChevronRight,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Home as HomeIcon,
  Inbox,
  GraduationCap,
  GripVertical,
  Hospital,
  MessageSquareWarning,
  Menu,
  Megaphone,
  MoreHorizontal,
  Newspaper,
  Phone,
  Save,
  Send,
  ShieldCheck,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveMatching from "./live-matching";
import BoardModal from "./board-modal";
type Row = {
  id: number;
  kind: string;
  name: string;
  detail: string;
  targets: string;
  status: string;
  createdAt: string;
};
const duties = [
  "기본업무 수행능력 — 소변 비우기, 관찰·기록·보고하기, 기저귀 갈기, 씻기, 일상생활지원, 개인활동지원, 정서지원, 인지활동지원, 인지관리지원 등",
  "유니폼 착용 및 명찰 패용",
  "친절한 태도와 언행",
  "간병시간 준수",
  "간병장소 이탈 금지",
  "치료방침 및 의료진에게 협조",
  "환자안전 및 감염예방(마스크 착용)을 위한 지침 준수",
];
const rules = [
  "큰소리로 통화 및 대화",
  "다른 환자 냉장고 사용",
  "병실화장실 및 욕실에서 샤워",
  "환자대상 상행위",
  "간이주방에서 음식조리",
  "세탁 및 전열기구 사용",
  "병원물품 남용",
  "정해진 간병료 외 추가금액 요구",
  "환자거부",
  "임의알선 및 사적 인수인계",
  "환자관련 정보 누설",
  "병상간격 지키기",
];
const hospitalWards: Record<string, string[]> = {
  "1동": ["4층 · 병동/신생아실", "5층 · 1·2병동", "6층 · 병동/62치료센터", "7층 · 1·2병동", "8층 · 병동/낮병동", "9층 · 1·2병동", "9층 · 집중치료실 (심혈관센터 sub-ICU)", "10~11층 · 1·2병동", "12층 · 병동/중환자실·소아중환자실", "13층 · 1·2병동"],
  "2동": ["5층 · 항암낮병동", "6층 · 1·2병동", "7층 · 1·2병동", "8층 · 병동/뇌신경재활치료실", "9층 · 병동/급성기 완화의료병동", "10층 · 병동/CAR-T 치료상담실", "11층 · 1·2병동"],
};
function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  required = true,
  disabled = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="field">
      <Label htmlFor={name}>
        {label}
        {required && <span> *</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
function Choice({ name, options }: { name: string; options: string[] }) {
  return (
    <RadioGroup name={name} required className="choice-grid">
      {options.map((v) => (
        <Label key={v} className="choice">
          <RadioGroupItem value={v} />
          <span>{v}</span>
        </Label>
      ))}
    </RadioGroup>
  );
}
function HandwritingPad({name="caregiverHandwriting"}:{name?:string}){const canvas=useRef<HTMLCanvasElement>(null),hidden=useRef<HTMLInputElement>(null),drawing=useRef(false);function point(e:React.PointerEvent<HTMLCanvasElement>){const c=canvas.current!,r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height}}function down(e:React.PointerEvent<HTMLCanvasElement>){const c=canvas.current!,p=point(e),x=c.getContext("2d")!;drawing.current=true;c.setPointerCapture(e.pointerId);x.beginPath();x.moveTo(p.x,p.y)}function move(e:React.PointerEvent<HTMLCanvasElement>){if(!drawing.current)return;const x=canvas.current!.getContext("2d")!,p=point(e);x.lineWidth=3;x.lineCap="round";x.strokeStyle="#172531";x.lineTo(p.x,p.y);x.stroke()}function up(){drawing.current=false;if(hidden.current&&canvas.current)hidden.current.value=canvas.current.toDataURL("image/png")}function clear(){const c=canvas.current!,x=c.getContext("2d")!;x.clearRect(0,0,c.width,c.height);if(hidden.current)hidden.current.value=""}return <div className="handwriting"><div><b>손글씨 직접 기재</b><span>손가락·터치펜·스타일러스 사용 가능</span></div><canvas ref={canvas} width="900" height="240" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}/><input ref={hidden} type="hidden" name={name}/><Button type="button" variant="outline" onClick={clear}>다시 쓰기</Button></div>}
function Title({
  n,
  title,
  sub,
}: {
  n: React.ReactNode;
  title: string;
  sub: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <span>{n}</span>
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
    </div>
  );
}
export default function Home() {
  const [tab, setTab] = useState("forms"),
    [rows, setRows] = useState<Row[]>([]),
    [railOpen, setRailOpen] = useState(false),
    [menuCard, setMenuCard] = useState(""),
    [homeOpen, setHomeOpen] = useState(true),
    [careRequestSequence, setCareRequestSequence] = useState(0),
    [selectedBuilding, setSelectedBuilding] = useState("1동"),
    [homeStep, setHomeStep] = useState<"buildings" | "wards">("buildings"),
    [railPosition, setRailPosition] = useState<{ x: number; y: number } | null>(null);
  const railDrag = useRef<{ offsetX: number; offsetY: number; width: number; height: number } | null>(null);
  async function load() {
    try {
      const [a, b, c, d, e] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/submissions"),
          fetch("/api/documents"),
          fetch("/api/consents"),
          fetch("/api/care-contracts"),
        ]),
        aj = await a.json(),
        bj = await b.json(),
        cj = await c.json(),
        dj = await d.json(),
        ej = await e.json();
      setRows(
        [
          ...(aj.applications || []).map((x: any) => ({
            id: x.id,
            kind: "간병인 신청",
            name: x.applicantName,
            detail: x.preferredDate,
            targets: x.sentTargets,
            status: x.status,
            createdAt: x.createdAt,
          })),
          ...(bj.submissions || []).map((x: any) => ({
            id: x.id,
            kind: "약정서",
            name: x.caregiverName,
            detail: `${x.ward} · ${x.room}`,
            targets: x.sentTargets,
            status: x.status,
            createdAt: x.createdAt,
          })),
          ...(cj.bundles || []).map((x: any) => ({
            id: x.id,
            kind: "제출서류",
            name: x.caregiverName,
            detail: x.decision,
            targets: x.sentTargets,
            status: x.status,
            createdAt: x.createdAt,
          })),
          ...(dj.consents || []).map((x: any) => ({
            id: x.id,
            kind: "개인정보 확인서",
            name: x.name,
            detail: x.shareConsent,
            targets: x.sentTargets,
            status: x.status,
            createdAt: x.createdAt,
          })),
          ...(ej.contracts || []).map((x: any) => ({
            id: x.id,
            kind: x.contractType,
            name: x.caregiverName,
            detail: `${x.patientName} · ${x.salaryPeriod}`,
            targets: x.sentTargets,
            status: x.status,
            createdAt: x.createdAt,
          })),
        ].sort((x, y) => y.createdAt.localeCompare(x.createdAt)),
      );
    } catch {}
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    const moveRail = (event: PointerEvent) => {
      const drag = railDrag.current;
      if (!drag) return;
      setRailPosition({
        x: Math.max(8, Math.min(window.innerWidth - drag.width - 8, event.clientX - drag.offsetX)),
        y: Math.max(80, Math.min(window.innerHeight - drag.height - 8, event.clientY - drag.offsetY)),
      });
    };
    const stopRail = () => { railDrag.current = null; document.body.classList.remove("dragging-work-menu"); };
    const resetRailOnMobile = () => { if (window.innerWidth < 1100) { railDrag.current = null; setRailPosition(null); } };
    window.addEventListener("pointermove", moveRail);
    window.addEventListener("pointerup", stopRail);
    window.addEventListener("pointercancel", stopRail);
    window.addEventListener("resize", resetRailOnMobile);
    return () => {
      window.removeEventListener("pointermove", moveRail);
      window.removeEventListener("pointerup", stopRail);
      window.removeEventListener("pointercancel", stopRail);
      window.removeEventListener("resize", resetRailOnMobile);
    };
  }, []);
  function moveTo(nextTab: string, target?: string) {
    setHomeOpen(false);
    setMenuCard("");
    setRailOpen(false);
    setTab(nextTab);
    window.setTimeout(() => {
      if (target) document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  }
  function openCareRequest() {
    setMenuCard("");
    setRailOpen(false);
    setHomeStep("buildings");
    setHomeOpen(true);
    setCareRequestSequence(sequence => sequence + 1);
  }
  function goHome() {
    setMenuCard("");
    setRailOpen(false);
    setHomeStep("buildings");
    setHomeOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <a className="brand-home-link" href="https://care24-hospital-hub.samganid5197259555.chatgpt.site" aria-label="전국 병원 통합돌봄 앱으로 이동" title="아이콘(간병24)에 마우스를 대면 전국에 있는 해당 병원의 통합돌봄 앱이 나옵니다."><img className="brandmark" src="/ganbyeong24-logo-cropped.webp" alt="간병24" /><span className="brand-tooltip">아이콘(<img className="inline-care24-icon" src="/ganbyeong24-logo-cropped.webp" alt="간병24 아이콘" />)에 마우스를 대면 전국에 있는 해당 병원의 통합돌봄 앱이 나옵니다.</span></a>
          <div className="brandcopy">
            <strong><em className="region-label">분당</em>서울대학교병원 통합간병 앱</strong>
            <span>대한노인돌봄서비스협회 통합관리</span>
          </div>
        </div>
        <div className="secure">
          <ShieldCheck size={17} />
          안전한 업무 문서
        </div>
      </header>
      {!homeOpen && <button className="caregiver-home-arrow" type="button" onClick={goHome} aria-label="간병24 홈으로 이동"><ArrowLeft /><HomeIcon /><span>홈으로</span></button>}
      <nav className={`work-rail ${railOpen ? "expanded" : ""}`} aria-label="통합 업무 메뉴" style={railPosition ? { left: railPosition.x, top: railPosition.y, right: "auto", bottom: "auto" } : undefined}>
        <button className="rail-drag" type="button" aria-label="업무 메뉴 위치 이동" title="마우스로 끌어서 메뉴 이동" onPointerDown={(event) => { if (window.innerWidth < 1100) return; const nav = event.currentTarget.closest("nav"); if (!nav) return; const box = nav.getBoundingClientRect(); railDrag.current = { offsetX: event.clientX - box.left, offsetY: event.clientY - box.top, width: box.width, height: box.height }; document.body.classList.add("dragging-work-menu"); event.preventDefault(); }}><GripVertical /><span>메뉴 이동</span></button>
        <button className="rail-toggle" type="button" onClick={() => setRailOpen(!railOpen)} aria-expanded={railOpen}><Menu /><span>{railOpen ? "업무 메뉴 닫기" : "업무 메뉴"}</span></button>
        <div className="rail-items">
          <button type="button" onClick={() => { setMenuCard(""); setHomeStep("buildings"); setHomeOpen(true); setRailOpen(false); }}><HomeIcon /><span>홈</span></button>
          <button type="button" onClick={() => setMenuCard("공지사항")}><Megaphone /><span>공지사항</span></button>
                <button type="button" onClick={openCareRequest}><HeartHandshake /><span>간병인 의뢰</span></button>
          <button type="button" onClick={() => moveTo("forms", "care-request")}><UserPlus /><span>간병인 신청</span></button>
          <button type="button" onClick={() => moveTo("forms", "care-education")}><GraduationCap /><span>간병인 교육</span></button>
          <button type="button" onClick={() => moveTo("inbox")}><Hospital /><span>병동 간호사실</span></button>
          <button type="button" onClick={() => moveTo("inbox")}><Building2 /><span>협회 관리실</span></button>
          <button type="button" onClick={() => setMenuCard("간병뉴스")}><Newspaper /><span>간병뉴스</span></button>
          <button type="button" onClick={() => moveTo("support")}><MessageSquareWarning /><span>불편건의함</span></button>
          <button type="button" onClick={() => setMenuCard("기타")}><MoreHorizontal /><span>기타</span></button>
        </div>
      </nav>
      {homeOpen && <section className="home-screen" aria-label="통합간병 업무 홈">
        <div className="home-screen-inner">
          {homeStep === "buildings" ? <>
            <div className="legacy-home-title"><p>분당서울대학교병원 통합간병 앱</p><h1>입원 병동을 선택하세요</h1><span>동을 누르면 층별 병동이 표시됩니다.</span><b className="logo-navigation-guide">아이콘(<img className="inline-care24-icon" src="/ganbyeong24-logo-cropped.webp" alt="간병24 아이콘" />)에 마우스를 대면 전국에 있는 해당 병원의 통합돌봄 앱이 나옵니다.</b></div>
            <div className="legacy-cloud"><ShieldCheck /><div><b>병원 클라우드와 분리 운영</b><p>이 사이트는 분당서울대학교병원 전산·EMR·클라우드와 연결되지 않은 별도 관리 서비스입니다. 대한노인돌봄서비스협회가 관리하며, 실제 연동은 병원 승인 후에만 가능합니다.</p></div><span>외부 독립 운영</span></div>
            <div className="legacy-buildings">
              {Object.keys(hospitalWards).map((building, index) => <button type="button" key={building} onClick={() => { setSelectedBuilding(building); setHomeStep("wards"); }}><div className={index === 0 ? "teal" : "navy"}><Building2 /><strong>{building}</strong></div><section><h2>{building} 입원병동</h2><p>{hospitalWards[building].length}개 층별 병동 안내</p><b>층별 병동 보기 <ChevronRight /></b></section></button>)}
            </div>
            <div className="legacy-home-actions"><Button type="button" onClick={openCareRequest}>환자·보호자 간병 의뢰</Button><Button type="button" className="caregiver" onClick={() => moveTo("forms", "care-request")}>간병인 간병 신청</Button></div>
            <LiveMatching requestSequence={careRequestSequence} />
          </> : <div className="legacy-wards">
            <button type="button" className="legacy-back" onClick={() => setHomeStep("buildings")}><ArrowLeft />1동·2동 선택으로</button>
            <section><header><span><Building2 /></span><div><p>분당서울대학교병원 통합간병 앱</p><h1>{selectedBuilding} 층별 병동</h1></div></header><div className="legacy-ward-grid">{hospitalWards[selectedBuilding].map((ward, index) => <button type="button" key={ward} onClick={() => moveTo("forms", "care-request")}><span><small>{String(index + 1).padStart(2, "0")}</small><b>{ward}</b></span><ChevronRight /></button>)}</div><p className="legacy-guide">공식 층별안내를 기준으로 구성했으며, 실제 병동·병실 위치는 현장정보 편집에서 수정할 수 있습니다.</p></section>
          </div>}
        </div>
      </section>}
      {(menuCard === "공지사항" || menuCard === "간병뉴스") && <BoardModal type={menuCard} onClose={() => setMenuCard("")} />}
      {menuCard && menuCard !== "공지사항" && menuCard !== "간병뉴스" && <div className="menu-card-backdrop" role="presentation" onClick={() => setMenuCard("")}>
        <section className="menu-card" role="dialog" aria-modal="true" aria-label={menuCard} onClick={(e) => e.stopPropagation()}>
          <b>{menuCard}</b>
          <p>{menuCard === "공지사항" ? "병원·협회의 주요 안내와 새 공지사항을 확인하는 공간입니다." : menuCard === "간병뉴스" ? "간병 제도와 현장 관련 소식을 확인하는 공간입니다." : "추가 업무와 관리 기능을 확인하는 공간입니다."}</p>
          <Button type="button" onClick={() => setMenuCard("")}>확인</Button>
        </section>
      </div>}
      <div className="shell">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="intro">
            <div>
              <p className="eyebrow">문서별 개별 전송</p>
              <h1>간병 업무 신청·약정</h1>
              <p>각 문서를 따로 작성하고 지정된 수신처로 보냅니다.</p>
            </div>
            <TabsList>
              <TabsTrigger value="forms">
                <FileText />
                작성하기
              </TabsTrigger>
              <TabsTrigger value="inbox">
                <Inbox />
                접수함 <b>{rows.length}</b>
              </TabsTrigger>
              <TabsTrigger value="support">
                <MessageSquareWarning />
                고충·건의함
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="forms">
            <div id="care-request" className="rail-anchor"><ApplicationForm onDone={load} /></div>
            <div className="document-divider">
              <FileText />
              <div>
                <b>간병도우미 약정서</b>
                <span>간병인 신청과 별도로 작성·전송합니다.</span>
              </div>
            </div>
            <div id="care-education" className="rail-anchor"><AgreementForm onDone={load} /></div>
            <div className="document-divider">
              <Camera />
              <div>
                <b>간병인 제출서류</b>
                <span>휴대폰으로 촬영하거나 사진·동영상·PDF를 첨부합니다.</span>
              </div>
            </div>
            <DocumentForm onDone={load} />
            <div className="document-divider">
              <FileText />
              <div>
                <b>개인간병 근로계약서</b>
                <span>간병비를 직접 입력하고 계약 당사자가 서명합니다.</span>
              </div>
            </div>
            <CareContractForm type="개인간병 근로계약서" onDone={load} />
            <div className="document-divider">
              <FileText />
              <div>
                <b>공동간병 계약서</b>
                <span>전일제·2교대·3교대 간병비를 각각 입력합니다.</span>
              </div>
            </div>
            <CareContractForm type="공동간병 계약서" onDone={load} />
            <div className="document-divider">
              <ShieldCheck />
              <div>
                <b>개인정보 사용·제공 확인서</b>
                <span>전자서명 후 협회·간병24에 전송합니다.</span>
              </div>
            </div>
            <ConsentForm onDone={load} />
          </TabsContent>
          <TabsContent value="inbox">
            <section className="card inbox">
              <Title
                n={<ClipboardCheck />}
                title="통합 접수함"
                sub="세 문서의 저장·전송·확인 상태를 함께 확인합니다."
              />
              {rows.length === 0 ? (
                <div className="empty">아직 접수된 문서가 없습니다.</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>문서</th>
                        <th>접수번호</th>
                        <th>성명</th>
                        <th>배정일/병실·결정</th>
                        <th>수신처</th>
                        <th>상태</th>
                        <th>접수일시</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((x, i) => (
                        <tr key={x.kind + x.id + i}>
                          <td>
                            <b>{x.kind}</b>
                          </td>
                          <td>#{x.id}</td>
                          <td>{x.name}</td>
                          <td>{x.detail}</td>
                          <td>{x.targets || "-"}</td>
                          <td>
                            <span className={`status ${x.status}`}>
                              {x.status === "completed"
                                ? "완료"
                                : x.status === "confirmed"
                                  ? "확인 완료"
                                  : x.status === "sent"
                                    ? "전송 완료"
                                    : "저장"}
                            </span>
                          </td>
                          <td>
                            {new Date(x.createdAt + "Z").toLocaleString(
                              "ko-KR",
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </TabsContent>
          <TabsContent value="support">
            <section className="card support-card">
              <Title
                n={<MessageSquareWarning />}
                title="불편 및 고충처리 안내"
                sub={<><em className="region-label">분당</em>서울대병원 간병서비스 이용 중 불편한 사항을 알려주세요.</>}
              />
              <div className="support-layout">
                <div>
                  <h3>접수방법</h3>
                  <ol className="support-steps">
                    <li><b>1</b><span><strong>간병24 앱 실행</strong><small>현재 앱에서 바로 확인합니다.</small></span></li>
                    <li><b>2</b><span><strong><em className="region-label">분당</em>서울대병원 선택</strong><small>이용 중인 병원과 병동을 확인합니다.</small></span></li>
                    <li><b>3</b><span><strong>고충·건의함 선택</strong><small>불편·고충 내용을 작성해 접수합니다.</small></span></li>
                  </ol>
                </div>
                <div>
                  <h3>처리절차</h3>
                  <div className="support-flow">
                    <span><MessageSquareWarning /><b>민원 접수</b></span>
                    <span><UserCheck /><b>담당자 확인</b></span>
                    <span><BellRing /><b>처리결과 알림</b></span>
                    <span><HeartHandshake /><b>사후관리</b></span>
                  </div>
                </div>
              </div>
              <p className="support-note">접수내용은 담당자가 확인 후 앱 알림으로 안내드립니다.</p>
              <p className="support-alert">긴급한 환자 안전 문제는 즉시 병동 간호사에게 알려주세요.</p>
              <a className="support-phone" href="tel:025679413" aria-label="간병24 문의전화 02 567 9413">
                <Phone />
                <span>문의전화</span>
                <strong>02)567-9413</strong>
              </a>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
function ApplicationForm({ onDone }: { onDone: () => void }) {
  const [id, setId] = useState<number | null>(null),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = e.currentTarget,
      fd = new FormData(f),
      action =
        ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement)
          ?.value || "save",
      body: any = Object.fromEntries(fd.entries());
    body.action = action;
    body.id = id;
    try {
      const r = await fetch("/api/applications", {
          method: id ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
        j = await r.json();
      if (!r.ok) throw Error(j.error);
      setId(j.application.id);
      setMsg(
        action === "send"
          ? `협회·간병24 전송 완료 · 신청번호 ${j.application.id}`
          : `신청서 저장 완료 · 신청번호 ${j.application.id}`,
      );
      onDone();
      if (action === "send") {
        f.reset();
        setId(null);
      }
    } catch (x) {
      setMsg(x instanceof Error ? x.message : "처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={go} className="form-stack document-form">
      <section className="card application-card">
        <Title
          n={<UserPlus />}
          title="간병인 신청"
          sub="작성 후 협회와 간병24 두 곳에만 전송합니다."
        />
        <div className="recipient-strip two">
          <b>수신처</b>
          <span>협회</span>
          <span>간병24</span>
        </div>
        <div className="grid-2">
          <Field label="신청인 성명" name="applicantName" />
          <Field
            label="연락처"
            name="applicantPhone"
            type="tel"
            placeholder="010-0000-0000"
          />
          <Field label="생년월일" name="applicantBirth" type="date" />
          <Field
            label="성별"
            name="applicantGender"
            placeholder="예: 남 / 여"
          />
          <Field label="간병 경력" name="careerYears" placeholder="예: 5년" />
          <Field
            label="자격·교육사항"
            name="qualification"
            placeholder="예: 요양보호사, 간병교육 수료"
            required={false}
          />
          <Field label="배정 희망일" name="preferredDate" type="date" />
          <Field
            label="특이사항"
            name="applicationNote"
            placeholder="배정 시 참고사항"
            required={false}
          />
        </div>
        <fieldset className="provider-contract">
          <legend>돌봄서비스 제공 계약서</legend>
          <p className="provider-contract-note"><b>앱용 자체 계약서</b> 서울형 간병인 표준계약서와 보건복지부 표준계약 항목을 참고해 간병인 신청용으로 구성했습니다. 실제 환자와 매칭되면 의뢰계약서의 근무조건과 함께 최종 확인됩니다.</p>
          <div className="grid-2">
            <label>제공 간병 구분<select name="providerCareType" required defaultValue="개인간병"><option>개인간병</option><option>공동간병</option><option>모두 가능</option></select></label>
            <label>제공 가능 급여기준<select name="providerSchedule" required defaultValue="전일제(24시간)"><option>전일제(24시간)</option><option>주간제(12시간)</option><option>야간제(12시간)</option><option>시간제(12시간 미만)</option><option>협의 가능</option></select></label>
            <Field label="제공 가능 시간" name="providerAvailableHours" placeholder="예: 08:00~20:00 또는 협의" required={false}/>
            <Field label="휴게·휴일 조건" name="providerRestTerms" placeholder="예: 상호 협의" />
            <Field label="희망 간병비" name="providerFee" placeholder="예: 150,000원 (편집 가능)" />
            <label>금액 단위<select name="providerFeePeriod" required defaultValue="1일"><option>1시간</option><option>1일</option><option>1주</option><option>1개월</option><option>총 계약기간</option></select></label>
            <Field label="제공 서비스 범위" name="providerServiceScope" placeholder="식사·위생·배설·이동·정서지원·관찰 및 보고" />
            <Field label="제공계약 특약" name="providerContractNote" placeholder="추가 협의사항" required={false}/>
          </div>
          <div className="provider-clauses"><b>제공자 확인사항</b><ol><li>환자 안전과 병동의 감염관리 지침을 지키고 상태 변화는 간호사실에 즉시 보고합니다.</li><li>의료인이 아닌 경우 투약·처치 등 의료행위를 임의로 하지 않습니다.</li><li>합의하지 않은 추가 금액을 요구하지 않으며 환자와 보호자의 개인정보를 보호합니다.</li><li>근무조건 변경이나 서비스 종료는 상대방이 확인할 수 있도록 기록합니다.</li></ol></div>
          <label className="provider-consent"><input type="checkbox" name="providerContractConsent" value="동의" required/><span><b>제공 계약 동의</b> 위 제공범위·근무시간·희망 간병비·휴게 및 준수사항을 확인했습니다.</span></label>
        </fieldset>
        <HandwritingPad />
        <div className="mini-actions">
          <Button type="submit" value="save" variant="outline" disabled={busy}>
            <Save />
            신청서 저장
          </Button>
          <Button type="submit" value="send" disabled={busy}>
            <Send />
            협회·간병24에 보내기
          </Button>
        </div>
        {msg && (
          <div className={msg.includes("완료") ? "result ok" : "result"}>
            {msg}
          </div>
        )}
      </section>
    </form>
  );
}
function AgreementForm({ onDone }: { onDone: () => void }) {
  const [id, setId] = useState<number | null>(null),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = e.currentTarget,
      fd = new FormData(f),
      action =
        ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement)
          ?.value || "save",
      body: any = Object.fromEntries(fd.entries());
    body.action = action;
    body.id = id;
    body.duties = JSON.stringify(
      duties.map((_, i) => fd.get(`duty_${i}`) || ""),
    );
    body.rules = JSON.stringify(rules.map((_, i) => fd.get(`rule_${i}`) || ""));
    try {
      const r = await fetch("/api/submissions", {
          method: id ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
        j = await r.json();
      if (!r.ok) throw Error(j.error);
      setId(j.submission.id);
      setMsg(action === "complete" ? `약정서 완료 · 약정서 번호 ${j.submission.id}` : action === "confirm" ? `약정서 확인 완료 · 약정서 번호 ${j.submission.id}` : action === "send" ? `간호사실·협회·간병24 전송 완료 · 약정서 번호 ${j.submission.id}` : `약정서 저장 완료 · 약정서 번호 ${j.submission.id}`);
      onDone();
      if (action === "complete") {
        f.reset();
        setId(null);
      }
    } catch (x) {
      setMsg(x instanceof Error ? x.message : "처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={go} className="form-stack document-form">
      <section className="card">
        <Title
          n="1"
          title="간병 정보"
          sub="간병인과 환자의 기본 정보를 입력합니다."
        />
        <div className="recipient-strip three">
          <b>수신처</b>
          <span>간호사실</span>
          <span>협회</span>
          <span>간병24</span>
        </div>
        <div className="self-entry-guide">색이 표시된 칸만 간병인 본인이 작성합니다.</div>
        <div className="grid-2 agreement-top">
          <div className="self-entry"><Field label="간병인 본인 성명" name="caregiverName" /></div>
          <div className="self-entry"><Field label="소속 단체" name="caregiverOrg" placeholder="예: 간병24" /></div>
          <Field label="병동 (담당자 확인란)" name="ward" required={false} disabled />
          <Field label="병실 (담당자 확인란)" name="room" required={false} disabled />
          <Field label="환자 성명 (담당자 확인란)" name="patientName" required={false} disabled />
          <div className="date-pair">
            <Field label="근무 시작일 (담당자)" name="workStart" type="date" required={false} disabled />
            <Field label="근무 종료일 (담당자)" name="workEnd" type="date" required={false} disabled />
          </div>
        </div>
        <div className="agreement">
          <Checkbox id="agreement" required />
          <Label htmlFor="agreement">
            본인은 상기 환자를 간병함에 있어 아래 사항을 준수할 것을 약정합니다.
          </Label>
        </div>
      </section>
      <section className="card">
        <Title
          n="2"
          title="간병료 약정"
          sub="상황에 맞는 실제 협의 금액을 직접 입력합니다."
        />
        <div className="field contract-kind">
          <Label>
            계약 구분 <span> *</span>
          </Label>
          <Choice name="contractType" options={["공동간병", "개인간병"]} />
        </div>
        <div className="field patient-kind">
          <Label>
            환자 상태 <span> *</span>
          </Label>
          <Choice
            name="feeType"
            options={["일반환자", "중증환자", "기타 상황"]}
          />
        </div>
        <div className="salary-groups">
          <section className="salary-panel">
            <h3>공동간병 계약서 급여</h3>
            <p>근무 형태별 급여를 각각 직접 입력하고 수정할 수 있습니다.</p>
            <div className="grid-2 fee-fields">
              <MoneyField label="전일제 급여" name="commonFullTimeFee" />
              <MoneyField label="2교대 급여" name="commonTwoShiftFee" />
              <MoneyField label="3교대 급여" name="commonThreeShiftFee" />
            </div>
          </section>
          <section className="salary-panel personal">
            <h3>개인간병 계약서 급여</h3>
            <p>환자와 협의한 개인간병 급여를 직접 입력합니다.</p>
            <div className="grid-2 fee-fields">
              <MoneyField label="개인간병 급여" name="personalFee" />
              <div className="field">
                <Label>
                  급여기준 <span> *</span>
                </Label>
                <Choice
                  name="feePeriod"
                  options={["전일제(24시간)", "주간제(12시간)", "야간제(12시간)", "시간제(12시간 미만)"]}
                />
              </div>
            </div>
          </section>
        </div>
        <Field
          label="금액 적용 사유·추가 조건"
          name="feeNote"
          placeholder="예: 중증환자, 격리병실, 야간 추가비용 등"
          required={false}
        />
        <div className="notice">
          참고 : 간병비 결정은 환자상태와 근무조건에 따라 협의하여 결정하며,
          간병인 식사는 병원 직원식당 이용을 기준으로 결정합니다.
        </div>
      </section>
      <section className="card">
        <Title
          n="3"
          title="간병활동 평가"
          sub="만족도와 이행 수준을 평가합니다."
        />
        <div className="question">
          <h3>환자·보호자 만족도</h3>
          <Choice name="satisfaction" options={["상", "중", "하"]} />
        </div>
        <div className="checklist">
          {duties.map((x, i) => (
            <div className="check-row" key={x}>
              <span>{x}</span>
              <Choice name={`duty_${i}`} options={["이행", "미이행"]} />
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <Title
          n="4"
          title="병원지침 준수"
          sub="금지사항 위반 여부를 확인합니다."
        />
        <div className="rules">
          {rules.map((x, i) => (
            <div className="rule" key={x}>
              <span>{x}</span>
              <Choice name={`rule_${i}`} options={["준수", "위반"]} />
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <Title
          n="5"
          title="종합평가 및 확인"
          sub="재배치 여부와 수간호사 확인을 기록합니다."
        />
        <div className="question">
          <h3>종합평가</h3>
          <Choice
            name="overall"
            options={["재배치 가능", "교육후 재배치 가능", "재배치 불가"]}
          />
        </div>
        <div className="grid-2 confirm">
          <Field label="확인 수간호사" name="headNurse" />
          <Field label="확인일" name="confirmedAt" type="date" />
        </div>
      </section>
      <HandwritingPad />
      <div className="actions split-actions">
        <Button type="submit" value="save" variant="outline" disabled={busy}>
          <Save />
          약정서 저장
        </Button>
        <Button type="submit" value="send" disabled={busy}>
          <Send />
          간호사실·협회·간병24에 보내기
        </Button>
        <Button type="submit" value="confirm" variant="outline" disabled={busy}><ClipboardCheck/>확인</Button>
        <Button type="submit" value="complete" className="complete-btn" disabled={busy}><ClipboardCheck/>완료</Button>
      </div>
      {msg && (
        <div className={msg.includes("완료") ? "result ok" : "result"}>
          {msg}
        </div>
      )}
    </form>
  );
}
const documentTypes = [
  {
    title: "신분증 앞·뒤 복사본",
    note: "앞면과 뒷면을 각각 촬영해 첨부하세요.",
    optional: false,
  },
  {
    title: "자격증 사본",
    note: "자격증 소지자에 한해 제출합니다.",
    optional: true,
  },
  {
    title: "최종학교 졸업증명서",
    note: "증명서 소지자에 한해 제출합니다.",
    optional: true,
  },
  {
    title: "건강진단서",
    note: "마약·알코올·폐질환·암검사·정신질환·치매 및 기타 질병 확인",
    optional: false,
  },
  {
    title: "범죄경력 확인",
    note: "간병인은 파일을 제출하지 않으며, 권한 있는 담당자만 확인 결과를 기록합니다.",
    optional: false,
    officerOnly: true,
  },
];
function DocumentForm({ onDone }: { onDone: () => void }) {
  const [id, setId] = useState<number | null>(null),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const f = e.currentTarget,
      fd = new FormData(f),
      action =
        ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement)
          ?.value || "save";
    fd.set("action", action);
    if (id) fd.set("id", String(id));
    try {
      const r = await fetch("/api/documents", {
          method: id ? "PATCH" : "POST",
          body: fd,
        }),
        j = await r.json();
      if (!r.ok) throw Error(j.error);
      setId(j.bundle.id);
      setMsg(
        action === "confirm"
          ? `서류 확인 완료 · 서류번호 ${j.bundle.id}`
          : action === "send"
            ? `협회·간병24 전송 완료 · 서류번호 ${j.bundle.id}`
            : `제출서류 저장 완료 · 서류번호 ${j.bundle.id}`,
      );
      onDone();
      if (action === "confirm") {
        f.reset();
        setId(null);
      }
    } catch (x) {
      setMsg(x instanceof Error ? x.message : "서류를 처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={go} className="form-stack document-form">
      <section className="card documents-card">
        <Title
          n={<Camera />}
          title="간병인 제출서류"
          sub="사진·동영상·PDF를 촬영 또는 선택하여 첨부합니다."
        />
        <div className="privacy-note">
          <ShieldCheck />
          신분증과 건강정보가 포함되므로 필요한 서류만 정확히 첨부하세요. 파일당
          최대 20MB입니다.
        </div>
        <div className="recipient-strip two">
          <b>전송처</b>
          <span>협회</span>
          <span>간병24</span>
        </div>
        <div className="grid-2">
          <Field label="간병인 성명" name="caregiverName" />
          <Field label="연락처" name="caregiverPhone" type="tel" />
        </div>
        <section className="bank-section">
          <h3>6. 간병인 본인 은행계좌</h3>
          <p>
            은행명·계좌번호·예금주를 직접 입력하거나 통장 사본을 첨부하세요. 두
            방법 중 한 가지만 완료해도 됩니다.
          </p>
          <div className="grid-2 bank-grid">
            <Field
              label="은행명"
              name="bankName"
              placeholder="예: 국민은행"
              required={false}
            />
            <Field
              label="계좌번호"
              name="accountNumber"
              placeholder="숫자와 하이픈으로 입력"
              required={false}
            />
            <Field
              label="예금주"
              name="accountHolder"
              placeholder="간병인 본인 성명"
              required={false}
            />
            <Label className="upload-box bank-upload">
              <Camera />
              <span>통장 사본 촬영 또는 파일 선택</span>
              <small>사진, 동영상, PDF</small>
              <Input
                name="bankFile"
                type="file"
                accept="image/*,video/*,.pdf"
              />
            </Label>
          </div>
        </section>
        <div className="document-list">
          {documentTypes.map((d, i) => (
            <article className="document-item" key={d.title}>
              <div className="document-number">{i + 1}</div>
              <div className="document-body">
                <h3>
                  {d.title}
                  {d.optional && <em>선택</em>}
                </h3>
                <p>{d.note}</p>
                {d.officerOnly ? (
                  <div className="officer-only">
                    <div className="officer-heading">
                      <b>
                        <ShieldCheck /> 담당자 전용
                      </b>
                      <span>노인복지법 시행규칙 [별지 제20호의19서식]</span>
                    </div>
                    <section className="official-form">
                      <p className="form-revision">
                        ■ 노인복지법 시행규칙 [별지 제20호의19서식] &lt;개정
                        2019. 7. 5.&gt;
                      </p>
                      <h4>노인학대관련범죄 경력 조회 요청서</h4>
                      <p className="form-side">(앞쪽)</p>
                      <p className="form-help">
                        ※ 색상이 어두운 란은 요청인이 작성하지 않으며, [ ]에는
                        해당되는 곳에 √표를 합니다.
                      </p>
                      <div className="official-grid admin-row">
                        <b>접수번호</b>
                        <Input disabled />
                        <b>접수일</b>
                        <Input disabled />
                        <b>처리일</b>
                        <Input disabled />
                        <b>처리기간</b>
                        <span>즉시</span>
                      </div>
                      <div className="official-section">
                        <strong>요청인</strong>
                        <div className="official-fields">
                          <Field
                            label="성명"
                            name="requesterName"
                            required={false}
                          />
                          <Field
                            label="주민등록번호"
                            name="requesterResidentNo"
                            placeholder="-"
                            required={false}
                          />
                          <Field
                            label="기관명"
                            name="requesterOrg"
                            required={false}
                          />
                          <Field
                            label="주소"
                            name="requesterAddress"
                            required={false}
                          />
                          <Field
                            label="전화번호"
                            name="requesterPhone"
                            type="tel"
                            required={false}
                          />
                        </div>
                      </div>
                      <div className="official-section">
                        <strong>대상자</strong>
                        <div className="official-fields">
                          <Field
                            label="성명(외국인의 경우 영문명)"
                            name="subjectName"
                            required={false}
                          />
                          <Field
                            label="주민등록번호(외국인등록번호/국적)"
                            name="subjectResidentNo"
                            required={false}
                          />
                        </div>
                      </div>
                      <div className="official-section">
                        <strong>운영ㆍ취업기관정보</strong>
                        <div className="official-fields">
                          <Field
                            label="운영예정 또는 취업(예정)기관명"
                            name="employmentOrg"
                            required={false}
                          />
                          <Field
                            label="기관 주소"
                            name="employmentAddress"
                            required={false}
                          />
                          <Field
                            label="전화번호"
                            name="employmentPhone"
                            type="tel"
                            required={false}
                          />
                        </div>
                      </div>
                      <div className="official-section">
                        <strong>조회용도</strong>
                        <div className="official-purpose">
                          <Choice
                            name="inquiryPurpose"
                            options={["운영하려는 자", "취업(예정)자"]}
                          />
                          <Field
                            label="직종"
                            name="occupation"
                            placeholder="예: 사회복지사, 의사, 간호사 등"
                            required={false}
                          />
                        </div>
                      </div>
                      <p className="legal-copy">
                        「노인복지법」 제39조의17 및 같은 법 시행령 제20조의9에
                        따라 노인관련기관을 운영하려는 자, 노인관련기관에 취업
                        중이거나 사실상 노무를 제공 중인 사람 또는 취업하려
                        하거나 사실상 노무를 제공하려는 사람에 대하여
                        노인학대관련범죄 경력 조회를 요청하오니 그 결과를 회신해
                        주시기 바랍니다.
                      </p>
                      <div className="signature-line">
                        <Field
                          label="요청일"
                          name="requestDate"
                          type="date"
                          required={false}
                        />
                        <Field
                          label="요청인(서명 또는 인)"
                          name="requesterSignature"
                          required={false}
                        />
                        <b>경찰서장 귀하</b>
                      </div>
                      <div className="form-box">
                        <b>첨부서류</b>
                        <ol>
                          <li>
                            노인관련기관의 장임을 증명하는 서류(노인관련기관의
                            장의 경우만 해당합니다)
                          </li>
                          <li>별지 제20호의20서식의 동의서 1부</li>
                        </ol>
                        <b>수수료 없음</b>
                      </div>
                      <div className="consent-official">
                        <h5>
                          행정정보 공동이용 및 개인정보보호 수집ㆍ이용 동의서
                        </h5>
                        <p>
                          본인은 이 건 업무처리와 관련하여 담당 공무원이
                          「전자정부법」 제36조에 따른 행정정보의 공동이용을
                          통해 노인관련기관의 장임을 확인하는 것에 동의합니다.
                        </p>
                        <p>
                          ※ 동의하지 않거나 확인이 되지 않는 경우에는 요청인이
                          직접 관련 서류를 제출해야 합니다.
                        </p>
                        <div className="agreement">
                          <Checkbox
                            id="adminInfoConsent"
                            name="adminInfoConsent"
                          />
                          <Label htmlFor="adminInfoConsent">동의합니다</Label>
                        </div>
                        <Field
                          label="노인관련기관의 장(서명 또는 인)"
                          name="facilityHeadSignature"
                          required={false}
                        />
                      </div>
                      <div className="form-box">
                        <b>유의사항</b>
                        <ol>
                          <li>
                            대상자가 외국인인 경우 성명은 영문으로 적고,
                            주민등록번호란에는 외국인등록번호(없는 경우
                            생년월일과 여권번호) 및 국적을 적습니다.
                          </li>
                          <li>
                            대상자가 2명 이상일 경우에는 뒤쪽에 일괄하여 작성할
                            수 있습니다.
                          </li>
                        </ol>
                      </div>
                      <div className="procedure">
                        <b>처리절차</b>
                        <span>요청서 작성</span>
                        <i>→</i>
                        <span>접수</span>
                        <i>→</i>
                        <span>
                          대상자 확인
                          <br />
                          (적합, 부적합)
                        </span>
                        <i>→</i>
                        <span>통보</span>
                      </div>
                      <small className="paper-spec">
                        210㎜×297㎜[백상지 80g/㎡(재활용품)]
                      </small>
                    </section>
                    <div className="official-result">
                      <h4>담당자 확인 결과</h4>
                      <Choice
                        name="criminalResult"
                        options={["확인 대기", "적합", "부적합", "확인 불가"]}
                      />
                      <div className="grid-2 officer-fields">
                        <Field
                          label="담당자 성명"
                          name="criminalReviewer"
                          required={false}
                        />
                        <Field
                          label="확인일"
                          name="criminalReviewedAt"
                          type="date"
                          required={false}
                        />
                      </div>
                    </div>
                    <a
                      href="https://crims.police.go.kr/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      경찰청 범죄경력회보서 발급시스템 열기
                    </a>
                  </div>
                ) : (
                  <>
                    <Choice name={`status_${i}`} options={["제출", "미제출"]} />
                    <Label className="upload-box">
                      <Camera />
                      <span>모바일 촬영 또는 파일 선택</span>
                      <small>사진, 동영상, PDF · 여러 파일 가능</small>
                      <Input
                        name={`files_${i}`}
                        type="file"
                        accept="image/*,video/*,.pdf"
                        multiple
                      />
                    </Label>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="assessment">
          <h3>서류 평가 및 결정</h3>
          <div className="grid-2">
            <div className="field">
              <Label>평가 *</Label>
              <Choice
                name="evaluation"
                options={["확인중", "양호", "보완필요"]}
              />
            </div>
            <div className="field">
              <Label>결정 *</Label>
              <Choice
                name="decision"
                options={["결정대기", "적격", "부적격"]}
              />
            </div>
            <Field label="확인자" name="reviewer" />
            <Field label="평가일" name="reviewedAt" type="date" />
            <div className="field full">
              <Label htmlFor="documentNote">평가·보완 의견</Label>
              <Input
                id="documentNote"
                name="note"
                placeholder="미제출 사유, 보완 요청 또는 결정 의견"
              />
            </div>
          </div>
        </div>
        <div className="mini-actions document-actions">
          <Button type="submit" value="save" variant="outline" disabled={busy}>
            <Save />
            서류 저장
          </Button>
          <Button type="submit" value="send" disabled={busy}>
            <Send />
            협회·간병24에 보내기
          </Button>
          <Button
            type="submit"
            value="confirm"
            className="complete-btn"
            disabled={busy}
          >
            <ClipboardCheck />
            확인 완료
          </Button>
        </div>
        {msg && (
          <div className={msg.includes("완료") ? "result ok" : "result"}>
            {msg}
          </div>
        )}
      </section>
    </form>
  );
}
function CareContractForm({
  type,
  onDone,
}: {
  type: "개인간병 근로계약서" | "공동간병 계약서";
  onDone: () => void;
}) {
  const [id, setId] = useState<number | null>(null),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const f = e.currentTarget,
      fd = new FormData(f),
      action =
        ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement)
          ?.value || "save",
      body: any = Object.fromEntries(fd.entries());
    body.action = action;
    body.id = id;
    body.contractType = type;
    try {
      const r = await fetch("/api/care-contracts", {
          method: id ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
        j = await r.json();
      if (!r.ok) throw Error(j.error);
      setId(j.contract.id);
      setMsg(
        action === "complete"
          ? `${type} 완료 · 계약번호 ${j.contract.id}`
          : action === "confirm"
            ? `${type} 확인 완료 · 계약번호 ${j.contract.id}`
            : action === "send"
              ? `간호사실·협회·간병24 전송 완료 · 계약번호 ${j.contract.id}`
              : `${type} 저장 완료 · 계약번호 ${j.contract.id}`,
      );
      onDone();
      if (action === "complete") {
        f.reset();
        setId(null);
      }
    } catch (x) {
      setMsg(x instanceof Error ? x.message : "계약서를 처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }
  const shared = type === "공동간병 계약서";
  return (
    <form onSubmit={go} className="form-stack document-form">
      <section
        className={`card care-contract ${shared ? "shared" : "private"}`}
      >
        <Title
          n={<FileText />}
          title={type}
          sub={
            shared
              ? "공동간병 근무조건과 근무형태별 간병비를 약정합니다."
              : "개인간병 근로조건과 협의한 간병비를 약정합니다."
          }
        />
        <div className="recipient-strip three">
          <b>수신처</b>
          <span>간호사실</span>
          <span>협회</span>
          <span>간병24</span>
        </div>
        <h3 className="contract-subtitle">1. 계약 당사자</h3>
        <div className="grid-2">
          <Field label="사용자·보호자 성명" name="employerName" />
          <Field label="사용자 연락처" name="employerPhone" type="tel" />
          <Field label="사용자 주소" name="employerAddress" required={false} />
          <Field label="간병인 성명" name="caregiverName" />
          <Field label="간병인 연락처" name="caregiverPhone" type="tel" />
          <Field label="간병인 주소" name="caregiverAddress" required={false} />
        </div>
        <h3 className="contract-subtitle">2. 근로·간병 조건</h3>
        <div className="grid-2">
          <Field label="환자 성명" name="patientName" />
          <Field label="근무 장소·병실" name="workplace" />
          <Field label="계약 시작일" name="workStart" type="date" />
          <Field label="계약 종료일" name="workEnd" type="date" />
          <Field
            label="근무시간·교대시간"
            name="workHours"
            placeholder={shared ? "예: 07:00~19:00 / 2교대" : "예: 24시간 상주"}
          />
          <Field
            label="급여 지급일·방법"
            name="payDate"
            placeholder="예: 매월 10일, 계좌이체"
          />
        </div>
        <h3 className="contract-subtitle">3. 간병비</h3>
        {shared ? (
          <div className="salary-panel">
            <p>
              전일제·2교대·3교대 금액을 필요에 따라 직접 입력하고 수정하세요.
            </p>
            <div className="grid-2">
              <MoneyField label="전일제 간병비" name="fullTimeSalary" />
              <MoneyField label="2교대 간병비" name="twoShiftSalary" />
              <MoneyField label="3교대 간병비" name="threeShiftSalary" />
            </div>
          </div>
        ) : (
          <div className="salary-panel personal private-rate-grid">
            <p>근무시간 기준별 개인간병 급여를 직접 입력하고 수정하세요.</p>
            <div className="grid-2">
              <MoneyField label="전일제(24시간) 급여" name="private24Salary" />
              <MoneyField label="주간제(12시간) 급여" name="privateDay12Salary" />
              <MoneyField label="야간제(12시간) 급여" name="privateNight12Salary" />
              <MoneyField label="시간제(12시간 미만) 급여" name="privateHourlySalary" />
            </div>
          </div>
        )}
        <div className="field period-choice">
          <Label>
            간병비 기준 <span> *</span>
          </Label>
          <Choice name="salaryPeriod" options={shared?["전일제", "2교대", "3교대", "기타"]:["전일제(24시간)", "주간제(12시간)", "야간제(12시간)", "시간제(12시간 미만)"]} />
        </div>
        <div className="contract-bank">
          <h3>간병비 수령계좌</h3>
          <p>간병인 본인 명의 계좌를 입력하세요.</p>
          <div className="grid-2">
            <Field label="은행명" name="bankName" />
            <Field label="계좌번호" name="bankAccount" />
            <Field label="예금주" name="bankHolder" />
          </div>
        </div>
        <div className="employment-benefits">
          <h3>4대보험·퇴직연금</h3>
          <div className="grid-2">
            <div className="field"><Label>4대보험 가입 여부 <span> *</span></Label><Choice name="socialInsurance" options={["가입", "미가입", "해당 없음"]}/></div>
            <div className="field"><Label>퇴직연금 가입 여부 <span> *</span></Label><Choice name="retirementPension" options={["가입", "미가입", "해당 없음"]}/></div>
            <Field label="가입 세부사항" name="benefitNote" placeholder="가입 예정일, 보험료 부담, 퇴직연금 유형 등" required={false}/>
          </div>
        </div>
        <div className="clothing-receipt">
          <h3>의류 수령</h3><p>수령한 물품의 개수를 숫자로 입력하세요.</p>
          <div className="clothing-grid"><ItemCount n="1" label="상의" name="topCount"/><ItemCount n="2" label="하의" name="bottomCount"/><ItemCount n="3" label="앞치마" name="apronCount"/><ItemCount n="4" label="신발" name="shoesCount"/><ItemCount n="5" label="명찰" name="nameTagCount"/></div>
        </div>
        <h3 className="contract-subtitle">4. 업무와 특약</h3>
        <div className="grid-2">
          <Field
            label="간병 업무 내용"
            name="duties"
            placeholder="식사·위생·이동·안전 등"
          />
          <Field
            label="특약사항"
            name="specialTerms"
            placeholder="휴게, 식비, 교통비, 중도해지 등"
            required={false}
          />
        </div>
        <div className="contract-declaration">
          양 당사자는 위 근로·간병 조건과 간병비 수령계좌를 확인하고 성실히
          이행할 것을 약정합니다.
        </div>
        <div className="grid-2">
          <Field label="사용자·보호자 서명" name="employerSignature" />
          <Field label="간병인 서명" name="caregiverSignature" />
          <Field label="계약일" name="signedAt" type="date" />
        </div>
        <HandwritingPad />
        <div className="mini-actions consent-actions">
          <Button type="submit" value="save" variant="outline" disabled={busy}>
            <Save />
            저장
          </Button>
          <Button type="submit" value="send" disabled={busy}>
            <Send />
            보내기
          </Button>
          <Button
            type="submit"
            value="confirm"
            variant="outline"
            disabled={busy}
          >
            <ClipboardCheck />
            확인
          </Button>
          <Button
            type="submit"
            value="complete"
            className="complete-btn"
            disabled={busy}
          >
            <ClipboardCheck />
            완료
          </Button>
        </div>
        {msg && (
          <div className={msg.includes("완료") ? "result ok" : "result"}>
            {msg}
          </div>
        )}
      </section>
    </form>
  );
}
function MoneyField({ label, name }: { label: string; name: string }) {
  return (
    <div className="field fee-editor">
      <Label htmlFor={name}>{label}</Label>
      <div className="money-input">
        <Input
          id={name}
          name={name}
          type="text"
          inputMode="numeric"
          placeholder="금액 입력"
        />
        <b>원</b>
      </div>
    </div>
  );
}
function ItemCount({n,label,name}:{n:string;label:string;name:string}){return <div className="item-count"><b>{n}</b><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type="number" min="0" defaultValue="0" required/><span>개</span></div>}
function ConsentForm({ onDone }: { onDone: () => void }) {
  const [id, setId] = useState<number | null>(null),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const f = e.currentTarget,
      fd = new FormData(f),
      action =
        ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement)
          ?.value || "save",
      body: any = Object.fromEntries(fd.entries());
    body.action = action;
    body.id = id;
    try {
      const r = await fetch("/api/consents", {
          method: id ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
        j = await r.json();
      if (!r.ok) throw Error(j.error);
      setId(j.consent.id);
      setMsg(
        action === "complete"
          ? `개인정보 확인서 완료 · 확인서번호 ${j.consent.id}`
          : action === "confirm"
            ? `개인정보 확인서 확인 완료 · 확인서번호 ${j.consent.id}`
            : action === "send"
              ? `협회·간병24 전송 완료 · 확인서번호 ${j.consent.id}`
              : `개인정보 확인서 저장 완료 · 확인서번호 ${j.consent.id}`,
      );
      onDone();
      if (action === "complete") {
        f.reset();
        setId(null);
      }
    } catch (x) {
      setMsg(x instanceof Error ? x.message : "확인서를 처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={go} className="form-stack document-form">
      <section className="card consent-card">
        <Title
          n={<ShieldCheck />}
          title="개인정보 사용·제공 확인서"
          sub="내용을 확인하고 동의 여부와 전자서명을 기록합니다."
        />
        <div className="recipient-strip two">
          <b>제공받는 곳</b>
          <span>협회</span>
          <span>간병24</span>
        </div>
        <div className="grid-2">
          <Field label="성명" name="name" />
          <Field label="연락처" name="phone" type="tel" />
          <Field label="생년월일" name="birthDate" type="date" />
          <Field label="주소" name="address" />
        </div>
        <div className="consent-table">
          <div>
            <b>수집·이용 목적</b>
            <span>
              간병인 등록, 신원·자격 확인, 간병 배정, 교육 및 업무관리
            </span>
          </div>
          <div>
            <b>수집·제공 항목</b>
            <span>
              성명, 연락처, 생년월일, 주소, 경력·자격, 제출서류, 건강·범죄확인
              정보, 본인 은행계좌 정보
            </span>
          </div>
          <div>
            <b>제공받는 자</b>
            <span>협회, 간병24</span>
          </div>
          <div>
            <b>보유·이용 기간</b>
            <span>
              <Input
                name="retentionPeriod"
                placeholder="예: 업무 종료 후 3년"
                required
              />
            </span>
          </div>
          <div>
            <b>동의 거부 안내</b>
            <span>
              동의를 거부할 권리가 있으며, 필수정보 제공 거부 시 간병인
              등록·배정이 제한될 수 있습니다.
            </span>
          </div>
        </div>
        <div className="consent-choices">
          <div>
            <h3>개인정보 수집·이용 동의</h3>
            <Choice name="useConsent" options={["동의", "미동의"]} />
          </div>
          <div>
            <h3>개인정보 제3자 제공 동의</h3>
            <Choice name="shareConsent" options={["동의", "미동의"]} />
          </div>
        </div>
        <div className="signature-box">
          <h3>전자서명</h3>
          <p>아래에 본인 성명을 직접 입력하면 전자서명으로 기록됩니다.</p>
          <div className="grid-2">
            <Field label="서명자 성명" name="signatureName" />
            <Field label="서명일" name="signedAt" type="date" />
          </div>
          <div className="agreement">
            <Checkbox id="signatureAgree" name="signatureAgree" required />
            <Label htmlFor="signatureAgree">
              본인이 직접 작성했으며, 입력한 성명을 서명으로 사용하는 데
              동의합니다.
            </Label>
          </div>
        </div>
        <HandwritingPad />
        <div className="mini-actions consent-actions">
          <Button type="submit" value="save" variant="outline" disabled={busy}>
            <Save />
            저장
          </Button>
          <Button type="submit" value="send" disabled={busy}>
            <Send />
            협회·간병24에 보내기
          </Button>
          <Button
            type="submit"
            value="confirm"
            variant="outline"
            disabled={busy}
          >
            <ClipboardCheck />
            확인
          </Button>
          <Button
            type="submit"
            value="complete"
            className="complete-btn"
            disabled={busy}
          >
            <ClipboardCheck />
            완료
          </Button>
        </div>
        {msg && (
          <div className={msg.includes("완료") ? "result ok" : "result"}>
            {msg}
          </div>
        )}
      </section>
    </form>
  );
}
