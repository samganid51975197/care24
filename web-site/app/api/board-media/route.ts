import { env } from "cloudflare:workers";
export async function GET(req:Request){
  const key=new URL(req.url).searchParams.get("key")||"";
  if(!key.startsWith("board/"))return new Response("Not found",{status:404});
  const object=await env.BUCKET.get(key);
  if(!object)return new Response("Not found",{status:404});
  const headers=new Headers();object.writeHttpMetadata(headers);headers.set("etag",object.httpEtag);headers.set("cache-control","private, max-age=3600");
  return new Response(object.body,{headers});
}
