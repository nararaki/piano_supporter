//🦄🌈this is a pinanosupporter's hooks!!🌈🦄
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { uploadVideoService } from '../service/container/index.ts';
import { initializeAccountService } from '../service/container/index.ts';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const post = app.post('/post', async (c)=>{
  const formData = await c.req.formData();
  const file = formData.get('video') as File;
  const result = await uploadVideoService.exec(file);
})

const account = app.post('account-init',async(c)=>{
  const body = await c.req.json();
  const {userId,lastName,firstName,email} = body;
  const result = await initializeAccountService.exec(userId,lastName,firstName,email);
  if(!result.ok){
    return c.json({ message: 'アカウントの初期化に失敗しました' }, 500);
  }
  return c.json({message: "アカウント初期化できました"},200);
})

serve({
  fetch: app.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

export const postResponseType = post;
export const accountResponseType = account;