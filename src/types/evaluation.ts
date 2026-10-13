export type EvaluationDomainType = 'behavior' | 'performance';

export interface EvidenceFile {
  id: string;
  title: string;
  type: 'google_drive' | 'pdf' | 'document' | 'link';
  url: string;
  notes?: string;
  dateAdded?: string;
}

export interface EvidenceImage {
  id: string;
  title: string;
  url: string; // Base64 data URL or external URL
  description?: string;
  dateTaken?: string;
}

export interface EvaluationCriterion {
  id: string;
  code: string; // e.g. "1.1", "1.2"
  title: string;
  description: string;
  maxScore: number;
  currentScore: number;
  evidenceMethods: string[]; // "การสังเกต", "สัมภาษณ์ สนทนา...", "สำรวจเอกสาร"
  evidenceDocuments: string[]; // "รายงานตนเอง", "บันทึกสถิติการมาทำงาน", ฯลฯ
  files: EvidenceFile[];
  images: EvidenceImage[];
  evaluatorNotes?: string;
}

export interface EvaluationCategory {
  id: string;
  orderNumber: number;
  code: string; // "1", "2", ...
  title: string;
  subtitle: string;
  domain: EvaluationDomainType;
  maxScore: number; // e.g. 6, 8, 24, 12, 4
  calculationFormula: string; // e.g. "(ผลรวมการประเมิน) x (6) / 24"
  criteria: EvaluationCriterion[];
}

export interface TeacherProfile {
  name: string;
  position: string;
  institution: string;
  affiliation: string; // สังกัด เช่น สำนักงานคณะกรรมการการอาชีวศึกษา
  department: string; // สาขาวิชา/แผนกวิชา
  evaluationRound: string; // ครั้งที่ เช่น "ครั้งที่ 1"
  evaluationDate: string; // วันที่ประเมิน
  academicYear: string; // ปีการศึกษา
  avatarUrl: string;
  logoUrl?: string;
  bgImageUrl?: string;
  bgOpacity?: number; // 0 to 100, default 35
  bgBlur?: number; // 0 to 20, default 0
  showVectorOverlay?: boolean; // whether to overlay robot welding vector
  fontSizeScale?: number; // 90 to 140%, default 100
  isFullPageBg?: boolean; // true = apply background to whole page
  heroTagline: string;
  bio: string;
  googleDriveMainLink: string;
  googleDriveFolderLabel: string;
  tiktokUrl?: string;
  facebookUrl?: string;
}

export interface EvaluationStoreState {
  profile: TeacherProfile;
  categories: EvaluationCategory[];
  isEditMode: boolean;
  lastUpdated: string;
}
