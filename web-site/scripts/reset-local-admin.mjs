import {createClient} from '@libsql/client';
import {hashPassword} from '../lib/auth-crypto.mjs';
let input='';for await(const chunk of process.stdin){input+=chunk;if(input.length>2048)throw Error('입력이 너무 깁니다.');}
const {password}=JSON.parse(input.replace(/^\uFEFF/,''));
if(typeof password!=='string'||password.length<12||password.length>128)throw Error('비밀번호는 12~128자로 입력하세요.');
const db=createClient({url:'file:.private/preview.db'});const hash=await hashPassword(password);const tx=await db.transaction('write');
try{const result=await tx.execute({sql:"UPDATE auth_users SET password_hash=? WHERE username=? AND role='admin' AND status='active' RETURNING id",args:[hash,'samganid5197']});if(result.rows.length!==1)throw Error('관리자 계정을 확인할 수 없습니다.');await tx.execute({sql:'DELETE FROM auth_sessions WHERE user_id=?',args:[result.rows[0].id]});await tx.commit();console.log('완료: samganid5197 비밀번호를 변경했습니다. 새 비밀번호로 로그인하세요.');}catch(e){await tx.rollback();throw e;}finally{tx.close();db.close();}
