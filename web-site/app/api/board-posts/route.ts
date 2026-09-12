import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { boardPosts } from "../../../db/schema";

const validType = (value:string) => value === "공지사항" || value === "간병뉴스";
const allowed = (file:File) => file.type.startsWith("image/") || file.type.startsWith("video/");

export async function GET(req:Request){
  try{
    const type=new URL(req.url).searchParams.get("type")||"";
    if(!validType(type))return Response.json({error:"게시판 종류를 확인해 주세요."},{status:400});
    const posts=await getDb().select().from(boardPosts).where(eq(boardPosts.boardType,type)).orderBy(desc(boardPosts.id)).limit(100);
    return Response.json({posts:posts.map(post=>({...post,attachments:JSON.parse(post.attachments)}))});
  }catch{return Response.json({error:"게시글을 불러오지 못했습니다."},{status:500})}
}

export async function POST(req:Request){
  try{
    const form=await req.formData(),boardType=String(form.get("boardType")||""),title=String(form.get("title")||"").trim(),content=String(form.get("content")||"").trim(),author=String(form.get("author")||"관리자").trim()||"관리자";
    if(!validType(boardType)||!title||!content)return Response.json({error:"제목과 내용을 작성해 주세요."},{status:400});
    const attachments:any[]=[];let total=0;
    for(const entry of form.getAll("media")){
      if(!(entry instanceof File)||!entry.size)continue;
      if(!allowed(entry))return Response.json({error:"사진 또는 동영상 파일만 첨부할 수 있습니다."},{status:400});
      if(entry.size>100*1024*1024)return Response.json({error:"파일 1개는 100MB 이하만 첨부할 수 있습니다."},{status:400});
      total+=entry.size;if(total>200*1024*1024)return Response.json({error:"전체 첨부파일은 200MB 이하만 가능합니다."},{status:400});
      const key=`board/${boardType}/${crypto.randomUUID()}`;
      await env.BUCKET.put(key,entry.stream(),{httpMetadata:{contentType:entry.type}});
      attachments.push({fileName:entry.name,mimeType:entry.type,size:entry.size,storageKey:key});
    }
    const[post]=await getDb().insert(boardPosts).values({boardType,title,content,author,attachments:JSON.stringify(attachments)}).returning();
    return Response.json({post},{status:201});
  }catch(e){return Response.json({error:e instanceof Error?e.message:"게시글을 저장하지 못했습니다."},{status:500})}
}

export async function DELETE(req:Request){
  try{
    const{id,boardType}=await req.json() as {id:number;boardType:string};
    const[post]=await getDb().select().from(boardPosts).where(and(eq(boardPosts.id,Number(id)),eq(boardPosts.boardType,boardType))).limit(1);
    if(!post)return Response.json({error:"게시글을 찾을 수 없습니다."},{status:404});
    for(const file of JSON.parse(post.attachments)){if(file.storageKey)await env.BUCKET.delete(file.storageKey)}
    await getDb().delete(boardPosts).where(eq(boardPosts.id,post.id));
    return Response.json({ok:true});
  }catch{return Response.json({error:"게시글을 삭제하지 못했습니다."},{status:500})}
}
