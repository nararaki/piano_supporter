//🦄🌈this is a pinanosupporter's hooks!!🌈🦄
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { uploadVideoService } from '../service/container/index.ts';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post('uploadVideo', async (c)=>{
  const formData = await c.req.formData();
  const file = formData.get('video') as File;
  const result = await uploadVideoService.exec(file);
})

serve({
  fetch: app.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});