"use client";
import {useState} from 'react';
import {Button} from '@/components/ui/button';

export default function RequestContractEditor({id,content,busy,onSubmit}:{id:number;content:string;busy:boolean;onSubmit:(action:string,body:{party:string;content:string})=>void}) {
 const [text,setText]=useState(content);
 return <form className="request-contract-editor" onSubmit={e=>{
  e.preventDefault();const form=new FormData(e.currentTarget);
  const fee=String(form.get('fee')||'').trim(),period=String(form.get('period')||'').trim();
  const feeLine=`간병비: ${fee}원 / 지급 단위: ${period}`;
  const updated=/^간병비:.*$/m.test(text)?text.replace(/^간병비:.*$/m,()=>feeLine):`${text}\n${feeLine}`;
  setText(updated);onSubmit((e.nativeEvent as SubmitEvent).submitter?.getAttribute('value')||'save_contract',{party:'patient',content:updated});
 }}>
  <h3>간병의뢰계약서 · 의뢰 {id}번</h3>
  <p>간병비와 계약 내용을 확인한 뒤 저장하거나 협회·간병24에 보내세요.</p>
  <div className="request-contract-fee"><label>간병비 (원)<input name="fee" type="number" min="0" step="1" required defaultValue={content.match(/^간병비: (\d+)(?:원)?\s*\//m)?.[1]||''} placeholder="합의한 금액 입력"/></label><label>간병비 지급 기준<input name="period" required maxLength={100} defaultValue={content.match(/^간병비:.*지급 단위: (.+)$/m)?.[1]?.replace('미기재 · 확인 필요','')||''} placeholder="예: 1일(24시간), 시간당, 총액"/></label></div>
  <label>의뢰계약서 내용<textarea name="content" required maxLength={11000} rows={16} value={text} onChange={e=>setText(e.target.value)}/></label>
  <small>위 금액과 지급 기준은 저장 시 계약서의 간병비 항목에 반영됩니다. 서명과 미정 조건은 당사자가 확인해 작성하세요.</small>
  <div className="workflow-actions"><Button type="submit" value="save_contract" disabled={busy}>의뢰계약서 저장</Button><Button type="submit" value="send_contract" disabled={busy}>협회·간병24로 보내기</Button></div>
 </form>;
}
