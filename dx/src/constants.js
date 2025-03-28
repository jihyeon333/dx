export const PROCESS_CATEGORIES = [
  { name: "공정명", value: "name" },
  { name: "상태", value: "status" },
  { name: "생성일시", value: "created_at" },
  { name: "시작일시", value: "started_at" },
  { name: "종료일시", value: "finished_at" }
];

export const STATUS_TYPES = [
  { name: "진행중", value: "RUNNING" },
  { name: "중지", value: "STOPPED" }
];

export const AI_CATEGORIES = [
  { name: "연계명", value: "name" },
  { name: "공정종류", value: "processType" },
  { name: "공정명", value: "processName" },
  { name: "연계 ID", value: "endpoint" },
  { name: "AI 종류", value: "type" }
];

export const DT_CATEGORIES = [
  { name: "연계명", value: "name" },
  { name: "공정종류", value: "processType" },
  { name: "공정명", value: "processName" },
  { name: "연계 ID", value: "endpoint" }
];

export const AI_TYPES = [
  { name: "학습", value: "TRAINING" },
  { name: "예측", value: "PREDICTION" }
];

export const JSON_TYPES = ["STRING", "NUMBER", "ARRAY"];

export const DIRECTION = [
  { name: "요청 파라미터", value: "REQUEST" },
  { name: "응답 파라미터", value: "RESPONSE" }
];

export const IOFORMATS = ["JSON", "TEXT"];