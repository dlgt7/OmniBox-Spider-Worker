/**
 * OmniBox Spider Worker
 * 自动聚合爬虫脚本并生成 TVBox 配置
 */

import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { handleRequest } from './handler.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // API 路由：由 handler.js 处理
    if (path.startsWith('/api/') || path === '/' || path === '/index.html') {
      return handleRequest(request, env, ctx);
    }

    // 静态文件：由 Workers Sites 处理
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
        }
      );
    } catch (error) {
      // 静态文件不存在，返回 404
      return new Response('Not Found', { status: 404 });
    }
  },
};
