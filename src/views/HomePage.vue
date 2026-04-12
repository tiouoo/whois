<template>
  <div class="page-nav-container">
    <h1 class="title">Whois 查询</h1>

    <div class="search-box">
      <div class="search-input-wrapper">
        <a-input
          v-model:value="domain"
          placeholder="输入域名..."
          size="large"
          @pressEnter="handleWhoisQuery">
          <template #prefix>
            <GlobalOutlined class="icon" />
          </template>
        </a-input>
        <button class="x-s-btn search-btn" @click="handleWhoisQuery" :disabled="loading">
          <SearchOutlined />
          <span>查询</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <a-spin tip="查询中..." />
    </div>

    <div v-else-if="error" class="error-state">
      <a-alert
        message="查询失败"
        description="请检查域名格式是否正确，或稍后重试"
        type="error"
        show-icon
      />
    </div>

    <div v-else-if="result" class="result-container">
      <div class="result-card">
        <div class="result-header">
          <h2 class="result-title">{{ result.data.domain }}</h2>
          <span class="availability-badge" :class="result.data.is_available ? 'available' : 'registered'">
            {{ result.data.is_available ? '可注册' : '已注册' }}
          </span>
        </div>

        <div class="result-info">
          <div class="info-row">
            <span class="info-label">注册商：</span>
            <span class="info-value">{{ result.data.info.registrar_name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">创建时间：</span>
            <span class="info-value">{{ result.data.info.creation_time }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">到期时间：</span>
            <span class="info-value">{{ result.data.info.expiration_time }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">已注册天数：</span>
            <span class="info-value">{{ result.data.info.creation_days }} 天</span>
          </div>
          <div class="info-row">
            <span class="info-label">剩余天数：</span>
            <span class="info-value">{{ result.data.info.valid_days }} 天</span>
          </div>
          <div class="info-row">
            <span class="info-label">域名状态：</span>
            <div class="status-list">
              <span v-for="(status, index) in result.data.info.domain_status" :key="index" class="status-item">
                {{ status }}
              </span>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label">DNS 服务器：</span>
            <div class="ns-list">
              <span v-for="(ns, index) in result.data.info.name_server" :key="index" class="ns-item">
                {{ ns }}
              </span>
            </div>
          </div>
        </div>

        <div class="result-footer">
          <span class="query-time">查询时间：{{ result.data.query_time }}</span>
        </div>
      </div>

      <div class="raw-data-card">
        <div class="raw-header">
          <h3>原始数据</h3>
          <a-button type="link" @click="showRaw = !showRaw">
            {{ showRaw ? '隐藏' : '显示' }}
          </a-button>
        </div>
        <div v-if="showRaw" class="raw-content">
          <pre>{{ result.data.raw }}</pre>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <a-empty
        description="输入域名并点击查询按钮开始Whois查询"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchOutlined, GlobalOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { getWhoisInfo } from '../utils/whois';
import type { WhoisResponse } from '../types/whois';

const domain = ref('');
const loading = ref(false);
const error = ref(false);
const result = ref<WhoisResponse | null>(null);
const showRaw = ref(false);

async function handleWhoisQuery() {
  const domainValue = domain.value.trim();

  if (!domainValue) {
    message.warning('请输入域名');
    return;
  }

  loading.value = true;
  error.value = false;
  result.value = null;

  try {
    const data = await getWhoisInfo(domainValue);
    result.value = data;
  } catch (err) {
    console.error('查询失败:', err);
    error.value = true;
    message.error('查询失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page-nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 30px;
  color: var(--text-color);
  font-size: 36px;
}

.search-box {
  margin-bottom: 30px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.search-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input-wrapper :deep(.ant-input-affix-wrapper) {
  flex: 1;
  background-color: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--card-radius);
  color: var(--text-color);
  padding: 12px 16px;
}

.search-input-wrapper :deep(.ant-input-affix-wrapper:focus),
.search-input-wrapper :deep(.ant-input-affix-wrapper-focused),
.search-input-wrapper :deep(.ant-input-affix-wrapper:hover) {
  border-color: #667eea;
  box-shadow: none;
}

[data-theme='dark'] .search-input-wrapper :deep(.ant-input-affix-wrapper:focus),
[data-theme='dark'] .search-input-wrapper :deep(.ant-input-affix-wrapper-focused),
[data-theme='dark'] .search-input-wrapper :deep(.ant-input-affix-wrapper:hover) {
  border-color: #667eea;
  box-shadow: none;
}

.search-input-wrapper :deep(.ant-input) {
  background-color: transparent !important;
  color: var(--text-color);
  font-family: 'ZhuZiAYuanJWD', sans-serif;
  font-size: 16px !important;
}

.search-input-wrapper :deep(.ant-input::placeholder) {
  color: var(--text-color-light);
  font-family: 'ZhuZiAYuanJWD', sans-serif;
  font-size: 16px;
}

.search-input-wrapper :deep(.anticon) {
  color: var(--text-color-light);
  margin-right: 6px;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  font-size: 16px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.error-state {
  max-width: 700px;
  margin: 0 auto 30px;
}

.result-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-card {
  background-color: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--card-radius);
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--card-border);
}

.result-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.availability-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.availability-badge.available {
  background-color: #d1fae5;
  color: #065f46;
}

.availability-badge.registered {
  background-color: #fce7f3;
  color: #9d174d;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-label {
  min-width: 120px;
  font-weight: 500;
  color: var(--text-color-light);
  flex-shrink: 0;
}

.info-value {
  color: var(--text-color);
  flex: 1;
}

.status-list,
.ns-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.status-item,
.ns-item {
  color: var(--text-color);
  padding: 4px 8px;
  background-color: var(--card-bg-hover);
  border-radius: 6px;
  font-size: 14px;
}

.result-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--card-border);
  text-align: right;
  font-size: 14px;
  color: var(--text-color-light);
}

.raw-data-card {
  background-color: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--card-radius);
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.raw-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.raw-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.raw-content {
  background-color: var(--card-bg-hover);
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.raw-content pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-color);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state :deep(.ant-empty-description) {
  color: var(--text-color-light);
  font-size: 16px;
}

@media (max-width: 768px) {
  .search-input-wrapper {
    flex-direction: column;
  }

  .search-input-wrapper :deep(.ant-input-affix-wrapper) {
    width: 100%;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
  }

  .info-row {
    flex-direction: column;
    gap: 4px;
  }

  .info-label {
    min-width: auto;
  }
}
</style>
