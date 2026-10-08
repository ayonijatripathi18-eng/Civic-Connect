import React, { useState, useEffect, useRef } from 'react';
import {
  Landmark,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  UserCheck,
  UserPlus,
  LogIn,
  LogOut,
  Compass,
  FolderCheck,
  Plus,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Wrench,
  Check,
  CheckCircle2,
  Trash2,
  Footprints,
  Droplets,
  Building2,
  Trees,
  MoreHorizontal,
  Search,
  Mic,
  Square,
  RotateCcw,
  Sparkles,
  Crosshair,
  UploadCloud,
  X,
  Send,
  Eye,
  EyeOff,
  ChevronDown,
  MapPin,
  Tag,
  Activity,
  Menu,
  SlidersHorizontal,
  Clock,
  Briefcase,
  FileText
} from 'lucide-react';
import LocationMap from './components/LocationMap';
import IssuesExplorerMap from './components/IssuesExplorerMap';
import AuthorityPortal from './components/authority/AuthorityPortal';
import { authorityAuthService } from './services/authorityAuthService';

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================
export type Role = 'user' | 'authority';
export type Status = 'Reported' | 'In Progress' | 'Resolved';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface UserProfile {
  name: string;
  email: string;
  role: Role;
  department?: string;
  authorityId?: string;
  phone?: string;
}

const clearPersistedAuthState = () => {
  localStorage.removeItem('civicUser');
  localStorage.removeItem('civicAuth');
  localStorage.removeItem('civicRole');
  localStorage.removeItem('civic_authority_session');
};

const getRefreshRedirect = (): 'citizen-login' | 'authority-login' | null => {
  if (typeof window === 'undefined') return null;
  const value = sessionStorage.getItem('civic_refresh_redirect');
  if (value === 'citizen-login' || value === 'authority-login') {
    return value;
  }
  return null;
};

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  issueType: string;
  department: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  status: Status;
  severity: Severity;
  confidence: number;
  iconName: string;
  photos: string[];
  reporter: {
    name: string;
    email: string;
    role: Role;
  };
  impactCount?: number;
}

// Initial Mock Issues
const INITIAL_ISSUES: CivicIssue[] = [
  {
    id: 'CIV-2026-01842',
    title: 'Large pothole on Main Road',
    description: 'A large pothole has formed near the bus stop and is forcing two-wheelers into oncoming traffic. The damaged section becomes flooded after rain and creates severe peak hour hazards.',
    category: 'Roads & Potholes',
    issueType: 'Pothole / Road Surface Crater',
    department: 'Public Works Department (PWD)',
    location: 'Main Road, Sector 3',
    date: 'Aug 24, 2026',
    status: 'In Progress',
    severity: 'High',
    confidence: 0.94,
    iconName: 'construction',
    photos: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: { name: 'Citizen Demo', email: 'citizen@civicconnect.demo', role: 'user' },
    impactCount: 23
  },
  {
    id: 'CIV-2026-01791',
    title: 'Broken streetlight near college gate',
    description: 'The high-mast streetlight pole was damaged during the recent storm. Exposed electrical casing makes the corner completely pitch black at night, causing safety concerns for students.',
    category: 'Streetlights',
    issueType: 'Streetlight Outage / Exposed Wiring',
    department: 'City Power & Street Lighting Wing',
    location: 'University Gate, Sector 2',
    date: 'Aug 22, 2026',
    status: 'Reported',
    severity: 'Medium',
    confidence: 0.92,
    iconName: 'lamp-desk',
    photos: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: { name: 'Priya Sharma', email: 'priya.s@civic.org', role: 'user' },
    impactCount: 15
  },
  {
    id: 'CIV-2026-01631',
    title: 'Garbage accumulation in Sector 4 Market',
    description: 'Uncollected commercial food and plastic waste overflowing from municipal containers onto pedestrian walkway. Stray animals dispersing litter and causing strong foul odors.',
    category: 'Garbage & Waste',
    issueType: 'Solid Waste Overflow / Illegal Dumping',
    department: 'Sanitation & Solid Waste Management',
    location: 'Sector 4 Market',
    date: 'Aug 18, 2026',
    status: 'Resolved',
    severity: 'High',
    confidence: 0.93,
    iconName: 'trash-2',
    photos: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: { name: 'Rohan Verma', email: 'rohan.v@civic.org', role: 'user' },
    impactCount: 41
  },
  {
    id: 'CIV-2026-01574',
    title: 'Damaged footpath near market',
    description: 'Broken paving blocks and open utility trench along the central market sidewalk. Senior citizens and pedestrians are forced onto the vehicle driveway.',
    category: 'Public Infrastructure',
    issueType: 'Footpath Collapse & Hazard',
    department: 'Public Works Department (PWD)',
    location: 'Central Market Road',
    date: 'Aug 15, 2026',
    status: 'In Progress',
    severity: 'Medium',
    confidence: 0.88,
    iconName: 'footprints',
    photos: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: { name: 'Anita Deshmukh', email: 'anita.d@civic.org', role: 'user' },
    impactCount: 19
  },
  {
    id: 'CIV-2026-01420',
    title: 'Low water pressure & pipe leak in Block B',
    description: 'Underground drinking water distribution pipeline fractured near drainage junction. Severe water wastage and potential contamination risk for 200+ residential families.',
    category: 'Water Supply',
    issueType: 'Main Pipeline Fracture & Contamination',
    department: 'Water Supply & Sewerage Board',
    location: 'Green Park Block B',
    date: 'Aug 10, 2026',
    status: 'Reported',
    severity: 'Critical',
    confidence: 0.96,
    iconName: 'droplets',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: { name: 'Citizen Demo', email: 'citizen@civicconnect.demo', role: 'user' },
    impactCount: 68
  },
  {
    id: 'CIV-2026-01318',
    title: 'Traffic signal timing issue at Ring Road',
    description: 'Automated green signal stuck at only 8 seconds during rush hour while cross-traffic gets 90 seconds, causing gridlock stretching over 1.2 kilometers.',
    category: 'Traffic',
    issueType: 'Signal Controller Fault / Congestion',
    department: 'Traffic Police & Road Safety Cell',
    location: 'Ring Road Junction',
    date: 'Aug 7, 2026',
    status: 'Resolved',
    severity: 'High',
    confidence: 0.89,
    iconName: 'traffic-cone',
    photos: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: { name: 'Karan Mehra', email: 'karan.m@civic.org', role: 'user' },
    impactCount: 34
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    name: 'Citizen Demo',
    email: 'citizen@civicconnect.demo',
    role: 'user'
  },
  {
    name: 'Municipal Authority Demo',
    email: 'authority@civicconnect.demo',
    role: 'authority',
    department: 'Public Works Department (PWD)',
    authorityId: 'AUTH-MNC-4402'
  }
];

// Helper: Department Classifier
function classifyCivicIssue(text: string): {
  category: string;
  issueType: string;
  department: string;
  severity: Severity;
  confidence: number;
  iconName: string;
} {
  const t = text.toLowerCase();
  if (/pothole|road|asphalt|divider|footpath|sidewalk|crater|pavement|tar|surface|curb|trench/.test(t)) {
    return {
      category: 'Roads & Potholes',
      issueType: 'Pothole / Road Surface Crater',
      department: 'Public Works Department (PWD)',
      severity: 'High',
      confidence: 0.94,
      iconName: 'construction'
    };
  }
  if (/light|streetlight|lamp|dark|pole|outage|bulb|flicker|wire|electric|illumination/.test(t)) {
    return {
      category: 'Streetlights',
      issueType: 'Streetlight Outage / Electrical Fault',
      department: 'City Power & Street Lighting Wing',
      severity: 'Medium',
      confidence: 0.92,
      iconName: 'lamp-desk'
    };
  }
  if (/garbage|waste|trash|dump|smell|litter|debris|bin|overflow|stagnant|cleanup|sanitation/.test(t)) {
    return {
      category: 'Garbage & Waste',
      issueType: 'Waste Accumulation & Bin Overflow',
      department: 'Sanitation & Solid Waste Management',
      severity: 'High',
      confidence: 0.93,
      iconName: 'trash-2'
    };
  }
  if (/water|pipeline|leak|pressure|drainage|sewage|pipe|tap|flood|contamination|drinking/.test(t)) {
    return {
      category: 'Water Supply',
      issueType: 'Pipeline Leakage & Supply Interruption',
      department: 'Water Supply & Sewerage Board',
      severity: 'Critical',
      confidence: 0.95,
      iconName: 'droplets'
    };
  }
  if (/traffic|signal|junction|jam|congestion|crossing|zebra|sign|intersection|timing/.test(t)) {
    return {
      category: 'Traffic',
      issueType: 'Traffic Signal Timing & Junction Congestion',
      department: 'Traffic Police & Road Safety Cell',
      severity: 'High',
      confidence: 0.89,
      iconName: 'traffic-cone'
    };
  }
  if (/park|bench|tree|playground|garden|grass|branch|swing|fence|hedge|horticulture/.test(t)) {
    return {
      category: 'Parks & Public Spaces',
      issueType: 'Park Facility Maintenance & Hazard',
      department: 'Horticulture & Parks Department',
      severity: 'Low',
      confidence: 0.88,
      iconName: 'trees'
    };
  }
  return {
    category: 'Public Infrastructure',
    issueType: 'Civic Infrastructure & Maintenance',
    department: 'Municipal Corporation General Works',
    severity: 'Medium',
    confidence: 0.85,
    iconName: 'building-2'
  };
}

export default function App() {
  const redirectAfterRefresh = getRefreshRedirect();

  // Portal Mode: 'citizen' or 'authority'
  const [activePortal, setActivePortal] = useState<'citizen' | 'authority'>(() => {
    if (typeof window !== 'undefined') {
      const pendingRedirect = getRefreshRedirect();
      const isAuthorityRoute =
        window.location.pathname.startsWith('/authority') ||
        window.location.hash.startsWith('#authority');
      const hasAuthoritySession = authorityAuthService.isAuthenticated();

      if (pendingRedirect === 'authority-login') {
        return 'authority';
      }

      if (isAuthorityRoute || (hasAuthoritySession && !window.location.hash.startsWith('#citizen'))) {
        return 'authority';
      }
    }
    return 'citizen';
  });

  // Listen to hash changes for deep linking (e.g. #authority)
  useEffect(() => {
    const handleLocation = () => {
      const isAuthorityRoute =
        window.location.pathname.startsWith('/authority') ||
        window.location.hash.startsWith('#authority');
      const hasAuthoritySession = authorityAuthService.isAuthenticated();

      if (isAuthorityRoute) {
        if (!hasAuthoritySession) {
          window.location.hash = 'authority/login';
        }
        setActivePortal('authority');
        return;
      }

      setActivePortal('citizen');
    };
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);

  // Navigation & Page State (Citizen Portal)
  const [activePage, setActivePage] = useState<'home' | 'report' | 'explore' | 'reports' | 'details' | 'login' | 'signup'>(() => {
    if (redirectAfterRefresh === 'citizen-login' || redirectAfterRefresh === 'authority-login') {
      return 'login';
    }
    return 'home';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (redirectAfterRefresh === 'citizen-login' || redirectAfterRefresh === 'authority-login') {
      return null;
    }
    return null;
  });

  // Issues State
  const [issuesList, setIssuesList] = useState<CivicIssue[]>(() => {
    const saved = localStorage.getItem('civicSubmittedReports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...INITIAL_ISSUES];
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_ISSUES;
  });

  const [selectedIssue, setSelectedIssue] = useState<CivicIssue>(INITIAL_ISSUES[0]);

  // Report Form State
  const [reportInputMethod, setReportInputMethod] = useState<'type' | 'audio'>('type');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [reportLatitude, setReportLatitude] = useState<number | null>(null);
  const [reportLongitude, setReportLongitude] = useState<number | null>(null);
  const [evidencePhotos, setEvidencePhotos] = useState<Array<{ id: string; name: string; size: string; url: string }>>([]);

  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionDone, setTranscriptionDone] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<{
    category: string;
    issueType: string;
    department: string;
    severity: Severity;
    confidence: number;
    iconName: string;
  } | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiStepIndex, setAiStepIndex] = useState(0);
  const [reportAlert, setReportAlert] = useState<string | null>(null);
  const [submissionSuccessReport, setSubmissionSuccessReport] = useState<CivicIssue | null>(null);

  // Explore Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  // Login / Signup State
  const [authRole, setAuthRole] = useState<Role>('user');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authAlert, setAuthAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Signup Fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('Public Works Department (PWD)');
  const [signupAuthorityId, setSignupAuthorityId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Persist Current User
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('civicUser', JSON.stringify(currentUser));
      localStorage.setItem('civicAuth', 'true');
      localStorage.setItem('civicRole', currentUser.role);
    } else {
      localStorage.removeItem('civicUser');
      localStorage.removeItem('civicAuth');
      localStorage.removeItem('civicRole');
    }
  }, [currentUser]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      clearPersistedAuthState();
      const isProtectedCitizenPage = ['report', 'explore', 'reports', 'details', 'login', 'signup'].includes(activePage);
      if (activePortal === 'authority' || window.location.hash.startsWith('#authority')) {
        sessionStorage.setItem('civic_refresh_redirect', 'authority-login');
      } else if (activePortal === 'citizen' && isProtectedCitizenPage && activePage !== 'login' && activePage !== 'signup') {
        sessionStorage.setItem('civic_refresh_redirect', 'citizen-login');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activePage, activePortal]);

  useEffect(() => {
    const pendingRedirect = getRefreshRedirect();
    if (!pendingRedirect) return;

    sessionStorage.removeItem('civic_refresh_redirect');

    if (pendingRedirect === 'citizen-login') {
      setCurrentUser(null);
      setActivePortal('citizen');
      setActivePage('login');
      setAuthRole('user');
      return;
    }

    setCurrentUser(null);
    setActivePortal('authority');
    setAuthRole('authority');
    if (!window.location.hash.startsWith('#authority')) {
      window.location.hash = 'authority/login';
    }
  }, []);

  // Handle Audio Recording
  const startRecording = async () => {
    setReportAlert(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone not supported on this device/browser');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        handleRealAudioTranscription(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setReportAlert('Microphone permission unavailable in this view. Use the "Try Demo Voice Sample" button below to test voice transcription instantly!');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const blobToBase64 = (b: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(b);
    });
  };

  const handleRealAudioTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    setReportAlert(null);
    try {
      let transcribedText = '';
      let response: Response | null = null;
      let data: any = null;

      // 1. First attempt: Standard multipart/form-data
      try {
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        response = await fetch('/api/speech/transcribe', {
          method: 'POST',
          credentials: 'same-origin',
          body: formData,
        });

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          throw new Error('Received non-JSON response from server');
        }
      } catch (firstErr) {
        // 2. Second attempt: Base64 JSON payload fallback
        try {
          const dataUrl = await blobToBase64(blob);
          response = await fetch('/api/speech/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({
              audio: dataUrl,
              mimeType: blob.type || 'audio/webm'
            })
          });

          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await response.json();
          } else {
            throw new Error('Server returned non-JSON response');
          }
        } catch (secondErr: any) {
          throw new Error(secondErr?.message || (firstErr as any)?.message || 'Network connection issue');
        }
      }

      if (!response || !response.ok || !data || !data.success) {
        throw new Error(data?.error || `Server responded with status ${response?.status || 'unknown'}`);
      }

      transcribedText = (data.text || '').trim();
      if (!transcribedText) {
        setReportAlert('No speech could be detected in the audio. Please speak clearly and try recording again.');
        setIsTranscribing(false);
        return;
      }

      // Populate description with the transcribed speech
      setReportDescription(transcribedText);

      // Generate/update the Issue Title from the new transcription
      const sentenceEnd = transcribedText.indexOf('.');
      const firstSentence = sentenceEnd !== -1 ? transcribedText.slice(0, sentenceEnd) : transcribedText;
      const derivedTitle = firstSentence.length > 70 ? firstSentence.slice(0, 67) + '...' : firstSentence;
      setReportTitle(derivedTitle);

      setTranscriptionDone(true);
      setIsTranscribing(false);

      // Trigger AI classification using the transcribed text
      triggerAiAnalysis(transcribedText, derivedTitle);
    } catch (err: any) {
      console.error('Speech-to-text error:', err);
      setIsTranscribing(false);
      setReportAlert(
        `Speech-to-text notice: ${err.message || 'Unable to transcribe audio.'}. You can type the issue details directly into the fields below.`
      );
    }
  };

  const useSampleVoiceRecording = () => {
    setReportAlert(null);
    setIsRecording(true);
    setRecordingSeconds(5);
    setTimeout(() => {
      setIsRecording(false);
      setRecordedAudioUrl('demo-voice');
      simulateTranscription();
    }, 700);
  };

  const simulateTranscription = async () => {
    setIsTranscribing(true);
    await new Promise((r) => setTimeout(r, 900));
    const sampleText =
      'There is a severe crater-like pothole and asphalt damage in the center of Main Road near the market crossing. It is causing two-wheeler skids and serious traffic disruption during morning peak hours.';
    setReportTitle('Severe crater pothole on Main Road near market crossing');
    setReportDescription(sampleText);
    setIsTranscribing(false);
    setTranscriptionDone(true);

    // Automatically trigger AI classification
    triggerAiAnalysis(sampleText, 'Severe crater pothole on Main Road near market crossing');
  };

  const resetRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setRecordedAudioUrl(null);
    setTranscriptionDone(false);
    setRecordingSeconds(0);
  };

  // Run AI Analysis
  const triggerAiAnalysis = async (customDesc?: string, customTitle?: string) => {
    const textToAnalyze = (customDesc || reportDescription || '') + ' ' + (customTitle || reportTitle || '');
    if (!textToAnalyze.trim()) {
      setReportAlert('Please provide an issue title or description before triggering AI analysis.');
      return;
    }
    setReportAlert(null);
    setIsAnalyzingAi(true);
    setAiStepIndex(1);

    await new Promise((r) => setTimeout(r, 220));
    setAiStepIndex(2);
    await new Promise((r) => setTimeout(r, 220));
    setAiStepIndex(3);
    await new Promise((r) => setTimeout(r, 220));
    setAiStepIndex(4);
    await new Promise((r) => setTimeout(r, 220));

    const result = classifyCivicIssue(textToAnalyze);
    setAiAnalysis(result);
    setIsAnalyzingAi(false);
  };

  // Evidence Photos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEvidencePhotos((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            url: ev.target?.result as string
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (id: string) => {
    setEvidencePhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Submit Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      setReportAlert('Please provide an issue title.');
      return;
    }
    if (!reportDescription.trim()) {
      setReportAlert('Please provide a description of the civic problem.');
      return;
    }
    if (!reportLocation.trim() || reportLatitude === null || reportLongitude === null) {
      setReportAlert('Please select a location on the interactive map or tap "Use My Location".');
      return;
    }

    const finalClassification = aiAnalysis || classifyCivicIssue(reportDescription + ' ' + reportTitle);
    const trackingId = 'CIV-2026-' + Math.floor(10000 + Math.random() * 90000);
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newIssue: CivicIssue = {
      id: trackingId,
      title: reportTitle.trim(),
      description: reportDescription.trim(),
      category: finalClassification.category,
      issueType: finalClassification.issueType,
      department: finalClassification.department,
      location: reportLocation.trim(),
      latitude: reportLatitude,
      longitude: reportLongitude,
      date: dateFormatted,
      status: 'Reported',
      severity: finalClassification.severity,
      confidence: finalClassification.confidence,
      iconName: finalClassification.iconName,
      photos:
        evidencePhotos.length > 0
          ? evidencePhotos.map((p) => p.url)
          : ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
      reporter: {
        name: currentUser?.name || 'Citizen Member',
        email: currentUser?.email || 'citizen@civicconnect.demo',
        role: currentUser?.role || 'user'
      },
      impactCount: 1
    };

    const updated = [newIssue, ...issuesList];
    setIssuesList(updated);
    try {
      localStorage.setItem('civicSubmittedReports', JSON.stringify([newIssue]));
    } catch (e) { /* ignore */ }

    setSubmissionSuccessReport(newIssue);
    setSelectedIssue(newIssue);
  };

  // Authority Status Update
  const handleUpdateStatus = (issueId: string, newStatus: Status) => {
    const updated = issuesList.map((item) => (item.id === issueId ? { ...item, status: newStatus } : item));
    setIssuesList(updated);
    if (selectedIssue.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus });
    }
  };

  // Helper Icon Renderer
  const renderCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'construction':
      case 'Roads & Potholes':
        return <AlertTriangle className={className} />;
      case 'lamp-desk':
      case 'Streetlights':
        return <Activity className={className} />;
      case 'trash-2':
      case 'Garbage & Waste':
        return <Trash2 className={className} />;
      case 'droplets':
      case 'Water Supply':
        return <Droplets className={className} />;
      case 'footprints':
      case 'Public Infrastructure':
        return <Building2 className={className} />;
      case 'traffic-cone':
      case 'Traffic':
        return <AlertTriangle className={className} />;
      case 'trees':
      case 'Parks & Public Spaces':
        return <Trees className={className} />;
      default:
        return <Building2 className={className} />;
    }
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthAlert({ type: 'error', message: 'Please enter both credentials.' });
      return;
    }

    if (authRole === 'authority') {
      const isCommissioner = loginEmail.toLowerCase().includes('commissioner');
      const role: 'SUPER_ADMIN' | 'DEPARTMENT_ADMIN' = isCommissioner ? 'SUPER_ADMIN' : 'DEPARTMENT_ADMIN';
      const authUser = {
        authorityId: isCommissioner ? 'AUTH-HQ-001' : 'AUTH-PWD-4402',
        name: isCommissioner ? 'Dr. Aruna Sundaram, IAS' : 'Vikramaditya Rathore',
        email: loginEmail.trim() || (isCommissioner ? 'commissioner@municipalcorp.gov.in' : 'v.rathore@pwd.gov.in'),
        phone: '+91 98260 41102',
        department: isCommissioner
          ? 'Municipal Corporation General Administration'
          : 'Public Works Department (PWD)',
        designation: isCommissioner
          ? 'Municipal Commissioner & Chief Vigilance Officer'
          : 'Senior Executive Engineer (Roads & Bridges)',
        jurisdiction: isCommissioner
          ? 'Greater Municipal Corporation (All Wards)'
          : 'Zone 3 — Central Metropolitan Division',
        role,
        isActive: true,
        createdAt: '2024-03-15T09:30:00Z',
        lastLoginAt: new Date().toISOString()
      };
      localStorage.setItem('civic_authority_session', JSON.stringify(authUser));
      const profileUser: UserProfile = {
        name: authUser.name,
        email: authUser.email,
        role: 'authority',
        department: authUser.department,
        authorityId: authUser.authorityId,
        phone: authUser.phone
      };
      setCurrentUser(profileUser);
      setAuthAlert({ type: 'success', message: 'Authenticated as Municipal Authority. Opening Authority Portal...' });
      setTimeout(() => {
        setAuthAlert(null);
        setActivePortal('authority');
        window.location.hash = 'authority/dashboard';
      }, 350);
      return;
    } else {
      setCurrentUser({
        name: loginEmail.split('@')[0] || 'Citizen Member',
        email: loginEmail,
        role: 'user'
      });
      setAuthAlert({ type: 'success', message: 'Logged in successfully! Redirecting...' });
      setTimeout(() => {
        setAuthAlert(null);
        setActivePage('home');
      }, 500);
    }
  };

  // Signup handler
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setAuthAlert({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setAuthAlert({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (authRole === 'authority') {
      const authUser = {
        authorityId: signupAuthorityId.trim() || `AUTH-OFFICER-${Date.now().toString().slice(-4)}`,
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim() || '+91 98260 41102',
        department: signupDepartment || 'Public Works Department (PWD)',
        designation: 'Municipal Officer',
        jurisdiction: 'Zone 3 — Central Metropolitan Division',
        role: 'OFFICER' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      localStorage.setItem('civic_authority_session', JSON.stringify(authUser));
      const newUser: UserProfile = {
        name: signupName.trim(),
        email: signupEmail.trim(),
        role: 'authority',
        department: signupDepartment,
        authorityId: signupAuthorityId.trim() || `AUTH-OFFICER-${Date.now().toString().slice(-4)}`,
        phone: signupPhone.trim() || undefined
      };
      setCurrentUser(newUser);
      setAuthAlert({ type: 'success', message: 'Authority account registered! Opening Authority Portal...' });
      setTimeout(() => {
        setAuthAlert(null);
        setActivePortal('authority');
        window.location.hash = 'authority/dashboard';
      }, 350);
      return;
    }

    const newUser: UserProfile = {
      name: signupName.trim(),
      email: signupEmail.trim(),
      role: 'user',
      phone: signupPhone.trim() || undefined
    };

    setCurrentUser(newUser);
    setAuthAlert({ type: 'success', message: 'Account created successfully! Welcome to CIVIC-CONNECT.' });
    setTimeout(() => {
      setAuthAlert(null);
      setActivePage('home');
    }, 600);
  };

  // Filtered Issues for Explore
  const filteredIssues = issuesList.filter((issue) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      issue.title.toLowerCase().includes(q) ||
      issue.location.toLowerCase().includes(q) ||
      issue.department.toLowerCase().includes(q) ||
      issue.id.toLowerCase().includes(q);
    const matchesCat = !categoryFilter || issue.category === categoryFilter;
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesSeverity = !severityFilter || issue.severity === severityFilter;
    return matchesSearch && matchesCat && matchesStatus && matchesSeverity;
  });

  // Navigation Bar Component
  const renderNavbar = () => (
    <header className="navbar">
      <div className="container nav-inner">
        <div
          className="brand"
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="brand-mark">
            <Landmark className="w-5 h-5 text-white" />
          </span>
          <span>CIVIC-CONNECT</span>
        </div>

        <nav className="nav-links">
          <button
            type="button"
            className={activePage === 'home' ? 'active font-bold' : ''}
            onClick={() => setActivePage('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={activePage === 'report' ? 'active font-bold' : ''}
            onClick={() => {
              setSubmissionSuccessReport(null);
              setActivePage('report');
            }}
          >
            Report Issue
          </button>
          <button
            type="button"
            className={activePage === 'explore' ? 'active font-bold' : ''}
            onClick={() => setActivePage('explore')}
          >
            Explore Issues
          </button>
          <button
            type="button"
            className={activePage === 'reports' ? 'active font-bold' : ''}
            onClick={() => {
              if (currentUser?.role === 'authority') {
                setActivePortal('authority');
                window.location.hash = 'authority/dashboard';
              } else {
                setActivePage('reports');
              }
            }}
          >
            My Reports
          </button>
        </nav>

        <div className="nav-actions">
          {currentUser ? (
            <div className="profile-dropdown-container">
              <button
                className="profile-trigger"
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span className="profile-avatar-icon">
                  {currentUser.role === 'authority' ? (
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </span>
                <span>{currentUser.role === 'authority' ? 'Authority' : 'Citizen'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-user">
                    <div className="profile-menu-name">{currentUser.name}</div>
                    <div className="profile-menu-email">{currentUser.email}</div>
                    <div className="profile-menu-role">
                      <span className={`badge ${currentUser.role === 'authority' ? 'progress' : 'resolved'}`}>
                        {currentUser.role === 'authority'
                          ? currentUser.department || 'Authority Official'
                          : 'Verified Citizen'}
                      </span>
                    </div>
                  </div>

                  <button
                    className="profile-menu-item"
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActivePortal('authority');
                    }}
                  >
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Open Authority Portal</span>
                  </button>

                  <button
                    className="profile-menu-item"
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActivePage('reports');
                    }}
                  >
                    <FolderCheck className="w-4 h-4 text-blue-600" />
                    <span>My Submissions</span>
                  </button>

                  <button
                    className="profile-menu-item logout"
                    type="button"
                    onClick={() => {
                      setCurrentUser(null);
                      setProfileDropdownOpen(false);
                      setActivePage('login');
                    }}
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setActivePage('login')}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}

          {/* DEDICATED BUTTON TO OPEN AUTHORITY PORTAL */}
          <button
            type="button"
            onClick={() => {
              setActivePortal('authority');
              window.location.hash = 'authority/login';
            }}
            className="btn btn-secondary text-xs font-bold py-2 px-3 border-blue-200 text-blue-900 bg-blue-50/80 hover:bg-blue-100 flex items-center gap-1.5"
            title="Switch to Municipal Authority Portal"
          >
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">Authority Portal</span>
          </button>

          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              setSubmissionSuccessReport(null);
              setActivePage('report');
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Report an Issue</span>
          </button>

          <button
            className="menu md:hidden"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 shadow-lg absolute top-[74px] left-0 w-full z-50">
          <button
            className="text-left py-2 font-semibold text-slate-700"
            onClick={() => {
              setActivePage('home');
              setMobileMenuOpen(false);
            }}
          >
            Home
          </button>
          <button
            className="text-left py-2 font-semibold text-slate-700"
            onClick={() => {
              setSubmissionSuccessReport(null);
              setActivePage('report');
              setMobileMenuOpen(false);
            }}
          >
            Report Issue
          </button>
          <button
            className="text-left py-2 font-semibold text-slate-700"
            onClick={() => {
              setActivePage('explore');
              setMobileMenuOpen(false);
            }}
          >
            Explore Issues
          </button>
          <button
            className="text-left py-2 font-semibold text-slate-700"
            onClick={() => {
              setActivePage('reports');
              setMobileMenuOpen(false);
            }}
          >
            My Reports
          </button>
          <button
            className="text-left py-2 font-bold text-blue-700 flex items-center gap-2 border-t border-slate-100 pt-3"
            onClick={() => {
              setActivePortal('authority');
              window.location.hash = 'authority/login';
              setMobileMenuOpen(false);
            }}
          >
            <Shield className="w-4 h-4 text-blue-700" />
            <span>Switch to Authority Portal</span>
          </button>
        </div>
      )}
    </header>
  );

  // Footer Component
  const renderFooter = () => (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand flex items-center gap-2 mb-3">
              <span className="brand-mark">
                <Landmark className="w-5 h-5 text-white" />
              </span>
              <span>CIVIC-CONNECT</span>
            </div>
            <p className="text-slate-300 text-sm max-w-sm">
              An AI-powered civic issue reporting and resolution platform that routes citizen photos and voice reports directly to the municipal department responsible for action.
            </p>
          </div>
          <div className="footer-links">
            <button type="button" onClick={() => setActivePage('home')}>Home</button>
            <button type="button" onClick={() => { setSubmissionSuccessReport(null); setActivePage('report'); }}>Report Issue</button>
            <button type="button" onClick={() => setActivePage('explore')}>Explore Issues</button>
            <button type="button" onClick={() => setActivePage('reports')}>Submissions</button>
            <button type="button" onClick={() => setActivePage('login')}>Sign In</button>
            <button
              type="button"
              onClick={() => {
                setActivePortal('authority');
                window.location.hash = 'authority/login';
              }}
              className="text-blue-300 font-bold hover:text-white"
            >
              Authority Portal
            </button>
          </div>
        </div>
        <div className="copyright flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 CIVIC-CONNECT. Municipal AI routing and public works resolution network.</span>
          <span className="text-slate-400">Public Citizen Access Portal</span>
        </div>
      </div>
    </footer>
  );

  // If in Authority Portal mode, render the dedicated Authority Portal
  if (activePortal === 'authority') {
    return (
      <AuthorityPortal
        onSwitchToCitizen={() => {
          setActivePortal('citizen');
          if (window.location.hash.startsWith('#authority')) {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {renderNavbar()}

      {/* ============================================================== */}
      {/* PAGE 1: HOME PAGE                                              */}
      {/* ============================================================== */}
      {activePage === 'home' && (
        <main className="flex-1">
          {/* HERO */}
          <section className="hero">
            <div className="container hero-grid">
              <div>
                <div className="eyebrow">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI-Powered Municipal Routing Engine</span>
                </div>
                <h1>Help make your community cleaner, safer, and better.</h1>
                <p>
                  Snap a photo or record your voice. Our AI classifies the civic hazard, assesses urgency, and dispatches the ticket directly to the municipal department in charge.
                </p>
                <div className="hero-actions">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      setSubmissionSuccessReport(null);
                      setActivePage('report');
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Report an Issue</span>
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setActivePage('explore')}
                  >
                    <span>Explore Issues</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* HERO VISUAL */}
              <div className="hero-visual">
                <div className="city-grid" />
                <div className="road r1" />
                <div className="road r2" />
                <div
                  className="pin p1"
                  title="Pothole on Main Road (High Severity)"
                  onClick={() => {
                    setSelectedIssue(issuesList[0]);
                    setActivePage('details');
                  }}
                >
                  <AlertTriangle />
                </div>
                <div
                  className="pin p2"
                  title="Streetlight outage (In Progress)"
                  onClick={() => {
                    setSelectedIssue(issuesList[1]);
                    setActivePage('details');
                  }}
                >
                  <Wrench />
                </div>
                <div
                  className="pin p3"
                  title="Waste cleared (Resolved)"
                  onClick={() => {
                    setSelectedIssue(issuesList[2]);
                    setActivePage('details');
                  }}
                >
                  <Check />
                </div>
                <div
                  className="pin p4"
                  title="Water pipe fracture (Critical)"
                  onClick={() => {
                    setSelectedIssue(issuesList[4]);
                    setActivePage('details');
                  }}
                >
                  <Droplets />
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="stats">
            <div className="container stat-grid">
              <div className="stat">
                <strong>1,248</strong>
                <span>Issues Reported</span>
              </div>
              <div className="stat">
                <strong>842</strong>
                <span>Issues Resolved</span>
              </div>
              <div className="stat">
                <strong>306</strong>
                <span>Issues In Progress</span>
              </div>
              <div className="stat">
                <strong>100+</strong>
                <span>Municipal Wards Covered</span>
              </div>
            </div>
          </section>

          {/* RECENT ISSUES */}
          <section className="section">
            <div className="container">
              <div className="section-head">
                <div>
                  <h2>Recent Civic Issues</h2>
                  <p>Real-time reports verified and dispatched by the AI system.</p>
                </div>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setActivePage('explore')}
                >
                  <span>View All Issues</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="issue-grid">
                {issuesList.slice(0, 4).map((issue) => (
                  <article
                    key={issue.id}
                    className="issue-card"
                    onClick={() => {
                      setSelectedIssue(issue);
                      setActivePage('details');
                    }}
                  >
                    <div className="issue-icon">
                      {renderCategoryIcon(issue.iconName, 'w-6 h-6 text-blue-600')}
                    </div>
                    <div className="issue-info">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3>{issue.title}</h3>
                        <span
                          className={`badge ${
                            issue.status === 'Resolved'
                              ? 'resolved'
                              : issue.status === 'In Progress'
                              ? 'progress'
                              : 'reported'
                          }`}
                        >
                          {issue.status}
                        </span>
                      </div>
                      <div className="text-xs text-blue-700 font-semibold mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{issue.department}</span>
                      </div>
                      <div className="meta">
                        <span>
                          <Tag className="w-3.5 h-3.5" />
                          {issue.category}
                        </span>
                        <span>
                          <MapPin className="w-3.5 h-3.5" />
                          {issue.location}
                        </span>
                        <span>
                          <Clock className="w-3.5 h-3.5" />
                          {issue.date}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* EXPLORE SNAPSHOT MAP */}
          <section className="section pt-0">
            <div className="container">
              <div className="section-head">
                <div>
                  <h2>Live Civic GIS Snapshot</h2>
                  <p>Interactive geographic mapping of municipal reports and field resolutions.</p>
                </div>
              </div>

              <div className="h-96 w-full rounded-2xl overflow-hidden border border-slate-200">
                <IssuesExplorerMap
                  issues={issuesList}
                  selectedIssue={selectedIssue}
                  onSelectIssue={(issue) => {
                    setSelectedIssue(issue);
                    setActivePage('details');
                  }}
                  onViewDetails={(issue) => {
                    setSelectedIssue(issue);
                    setActivePage('details');
                  }}
                  height="100%"
                />
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================== */}
      {/* PAGE 2: REPORT AN ISSUE (WITH VOICE, PHOTOS, AI & ROUTING)     */}
      {/* ============================================================== */}
      {activePage === 'report' && (
        <main className="page">
          <div className="container">
            <div className="page-title">
              <h1>Report a Civic Issue</h1>
              <p>Upload photos, speak or type your description. Our AI routes it directly to the right municipal department.</p>
            </div>

            {/* If successfully submitted, show detailed confirmation card */}
            {submissionSuccessReport ? (
              <div className="submission-success-card animate-fadeIn">
                <div className="success-icon-wrap">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted & Routed Successfully</h2>
                <p className="text-slate-500 mb-6">
                  Your civic issue has been cataloged, analyzed by AI, and dispatched directly to the municipal team for on-site inspection.
                </p>

                <div className="tracking-box">
                  <div className="tracking-item">
                    <span>Official Tracking ID</span>
                    <strong className="text-blue-700 tracking-wide font-mono text-lg">{submissionSuccessReport.id}</strong>
                  </div>
                  <div className="tracking-item">
                    <span>Current Status</span>
                    <div>
                      <span className="badge reported">{submissionSuccessReport.status}</span>
                    </div>
                  </div>
                  <div className="tracking-item">
                    <span>Routed Department</span>
                    <strong className="text-blue-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      {submissionSuccessReport.department}
                    </strong>
                  </div>
                  <div className="tracking-item">
                    <span>Assessed Severity & SLA</span>
                    <div>
                      <span
                        className={`badge ${
                          submissionSuccessReport.severity === 'Critical' || submissionSuccessReport.severity === 'High'
                            ? 'reported'
                            : 'progress'
                        }`}
                      >
                        {submissionSuccessReport.severity} Priority
                      </span>
                    </div>
                  </div>
                  <div className="tracking-item col-span-2">
                    <span>Reported Location</span>
                    <strong>{submissionSuccessReport.location}</strong>
                    {typeof submissionSuccessReport.latitude === 'number' && typeof submissionSuccessReport.longitude === 'number' && (
                      <div className="text-xs font-mono text-slate-500 mt-1">
                        GPS Coordinates: {submissionSuccessReport.latitude.toFixed(5)}, {submissionSuccessReport.longitude.toFixed(5)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-center flex-wrap mt-6">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setActivePage('reports')}
                  >
                    <FolderCheck className="w-4 h-4" />
                    <span>View in My Reports</span>
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setActivePage('explore')}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Issues</span>
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      setSubmissionSuccessReport(null);
                      setReportTitle('');
                      setReportDescription('');
                      setReportLocation('');
                      setReportLatitude(null);
                      setReportLongitude(null);
                      setEvidencePhotos([]);
                      setAiAnalysis(null);
                      resetRecording();
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Report Another Issue</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} noValidate>
                {reportAlert && (
                  <div className="form-alert error mb-5">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <div>{reportAlert}</div>
                  </div>
                )}

                {/* STEP 1: DESCRIBE THE ISSUE */}
                <section className="form-card">
                  <h2>1. Describe the Issue</h2>
                  <p className="hint">
                    Tell us what is happening. You can type your description or record your voice.
                  </p>

                  <div className="mode-tabs">
                    <button
                      type="button"
                      className={`mode-tab-btn ${reportInputMethod === 'type' ? 'active' : ''}`}
                      onClick={() => setReportInputMethod('type')}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Type</span>
                    </button>
                    <button
                      type="button"
                      className={`mode-tab-btn ${reportInputMethod === 'audio' ? 'active' : ''}`}
                      onClick={() => setReportInputMethod('audio')}
                    >
                      <Mic className="w-4 h-4" />
                      <span>Record Audio Voice</span>
                    </button>
                  </div>

                  {/* AUDIO RECORDER PANEL */}
                  {reportInputMethod === 'audio' && (
                    <div className="mb-6">
                      <div className={`audio-box ${isRecording ? 'recording' : recordedAudioUrl ? 'recorded' : ''}`}>
                        <div className={`audio-icon-wrap ${isRecording ? 'recording' : recordedAudioUrl ? 'recorded' : ''}`}>
                          {recordedAudioUrl ? <Check className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </div>

                        {isRecording ? (
                          <>
                            <div className="recording-indicator">
                              <span className="recording-dot" />
                              <span>Recording citizen voice report...</span>
                            </div>
                            <div className="recording-timer">
                              00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                            </div>
                            <div className="waveform">
                              <span /><span /><span /><span /><span /><span /><span />
                            </div>
                            <p className="text-xs text-slate-500 mb-4">
                              Speak clearly about the issue, landmark, and public safety impact.
                            </p>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={stopRecording}
                            >
                              <Square className="w-4 h-4" />
                              <span>Stop Recording</span>
                            </button>
                          </>
                        ) : recordedAudioUrl ? (
                          <>
                            <h3 className="font-bold text-emerald-800 text-base mb-1">Voice Audio Captured</h3>
                            <p className="text-xs text-slate-500 mb-3">
                              Voice processed. Listen below or record again if needed.
                            </p>
                            <div className="audio-player-wrap">
                              {recordedAudioUrl !== 'demo-voice' ? (
                                <audio controls src={recordedAudioUrl} className="w-full max-w-sm rounded-full" />
                              ) : (
                                <div className="text-sm text-slate-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                                  🎤 Simulated voice clip attached
                                </div>
                              )}
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={resetRecording}
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Record Again</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-bold text-slate-900 text-base mb-1">Record your report</h3>
                            <p className="text-xs text-slate-500 mb-4">
                              Tap the microphone to describe the problem using your voice.
                            </p>
                            <div className="flex gap-2.5 justify-center flex-wrap">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={startRecording}
                              >
                                <Mic className="w-4 h-4" />
                                <span>Start Recording</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={useSampleVoiceRecording}
                              >
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                <span>Try Demo Voice Sample</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {isTranscribing && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center gap-2 text-blue-800 text-sm font-semibold mb-4">
                          <span className="recording-dot bg-blue-600" />
                          <span>Transcribing speech to text with AI...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* EDITABLE FIELDS */}
                  <div className="field">
                    <label htmlFor="issueTitle">
                      Issue Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="issueTitle"
                      type="text"
                      placeholder="e.g. Deep pothole on Main Road near bus shelter"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="issueDescription" className="mb-0">
                        Description <span className="text-red-500">*</span>
                      </label>
                      {transcriptionDone && (
                        <span className="ai-card-badge">
                          <Sparkles className="w-3 h-3" /> AI Transcribed
                        </span>
                      )}
                    </div>
                    <textarea
                      id="issueDescription"
                      rows={4}
                      placeholder="Describe the issue, its duration, hazards, and how it impacts road safety or public sanitation..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                    />
                    {transcriptionDone && (
                      <div className="transcription-notice">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Speech-to-text transcription applied. You can edit or refine any words before submitting.</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* STEP 2: AI ANALYSIS & MUNICIPAL ROUTING */}
                <section className="form-card">
                  <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="mb-0">2. AI Classification & Municipal Routing</h2>
                        <span className="ai-card-badge">
                          <Sparkles className="w-3 h-3" /> Auto-Assigned
                        </span>
                      </div>
                      <p className="hint mb-0">
                        Our AI models inspect the description and photos to assign the correct municipal department, issue category, and urgency level.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => triggerAiAnalysis()}
                      disabled={isAnalyzingAi}
                    >
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>{isAnalyzingAi ? 'Analyzing...' : 'Run AI Analysis'}</span>
                    </button>
                  </div>

                  {isAnalyzingAi && (
                    <div className="ai-loading-box">
                      <div className="recording-indicator text-blue-600">
                        <span className="recording-dot bg-blue-600" />
                        <span>Analyzing report and determining jurisdiction...</span>
                      </div>
                      <div className="ai-steps">
                        <div className={`ai-step-item ${aiStepIndex >= 1 ? 'done font-semibold' : 'active'}`}>
                          {aiStepIndex >= 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-blue-600" />}
                          1. Extracting civic hazard keywords
                        </div>
                        <div className={`ai-step-item ${aiStepIndex >= 2 ? 'done font-semibold' : aiStepIndex === 1 ? 'active' : ''}`}>
                          {aiStepIndex >= 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-slate-300" />}
                          2. Matching municipal department jurisdiction
                        </div>
                        <div className={`ai-step-item ${aiStepIndex >= 3 ? 'done font-semibold' : aiStepIndex === 2 ? 'active' : ''}`}>
                          {aiStepIndex >= 3 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-slate-300" />}
                          3. Evaluating public safety risk & SLA
                        </div>
                        <div className={`ai-step-item ${aiStepIndex >= 4 ? 'done font-semibold' : aiStepIndex === 3 ? 'active' : ''}`}>
                          {aiStepIndex >= 4 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-slate-300" />}
                          4. Formatting municipal dispatch payload
                        </div>
                      </div>
                    </div>
                  )}

                  {aiAnalysis ? (
                    <div>
                      <div className="ai-results-grid">
                        <div className="ai-result-card">
                          <span className="ai-result-label">
                            <Tag className="w-3.5 h-3.5" /> Civic Category
                          </span>
                          <span className="ai-result-val text-blue-800">
                            {renderCategoryIcon(aiAnalysis.iconName, 'w-4 h-4 text-blue-600')}
                            {aiAnalysis.category}
                          </span>
                        </div>

                        <div className="ai-result-card">
                          <span className="ai-result-label">
                            <Briefcase className="w-3.5 h-3.5" /> Routed Department
                          </span>
                          <span className="ai-result-val text-indigo-900 font-bold">
                            {aiAnalysis.department}
                          </span>
                        </div>

                        <div className="ai-result-card">
                          <span className="ai-result-label">
                            <Activity className="w-3.5 h-3.5" /> Severity Level
                          </span>
                          <span className="ai-result-val">
                            <span
                              className={`badge ${
                                aiAnalysis.severity === 'Critical' || aiAnalysis.severity === 'High'
                                  ? 'reported'
                                  : aiAnalysis.severity === 'Medium'
                                  ? 'progress'
                                  : 'resolved'
                              }`}
                            >
                              {aiAnalysis.severity}
                            </span>
                          </span>
                        </div>

                        <div className="ai-result-card">
                          <span className="ai-result-label">
                            <CheckCircle2 className="w-3.5 h-3.5" /> AI Confidence
                          </span>
                          <span className="ai-result-val text-emerald-700 font-extrabold">
                            {Math.round(aiAnalysis.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Ticket is automatically routed. No manual municipal department selection needed by the citizen.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 border border-dashed border-slate-300 rounded-xl text-center text-slate-500 text-sm">
                      <Sparkles className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div>Type or record your issue above. The AI will classify it instantly or upon clicking <strong>Run AI Analysis</strong>.</div>
                    </div>
                  )}
                </section>

                {/* STEP 3: LOCATION */}
                <section className="form-card">
                  <h2>3. Location & Geospatial Tagging</h2>
                  <p className="hint">
                    Click anywhere on the map, drag the marker, or tap "Use My Location" to pinpoint the exact civic hazard.
                  </p>

                  <LocationMap
                    latitude={reportLatitude}
                    longitude={reportLongitude}
                    address={reportLocation}
                    onLocationChange={({ latitude, longitude, address }) => {
                      setReportLatitude(latitude);
                      setReportLongitude(longitude);
                      setReportLocation(address);
                      setReportAlert(null);
                    }}
                    height="380px"
                  />
                </section>

                {/* STEP 4: EVIDENCE PHOTOS */}
                <section className="form-card">
                  <h2>4. Add Photographic Evidence</h2>
                  <p className="hint">Clear photos allow the dispatched municipal team to evaluate equipment needs before deploying.</p>

                  <label className="upload block">
                    <UploadCloud className="w-10 h-10" />
                    <strong>Upload photos of the problem</strong>
                    <span>PNG, JPG, JPEG, or WEBP up to 10MB</span>
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  {/* PREVIEWS */}
                  {evidencePhotos.length > 0 && (
                    <div className="evidence-preview-grid">
                      {evidencePhotos.map((photo) => (
                        <div key={photo.id} className="evidence-card">
                          <img src={photo.url} alt={photo.name} />
                          <button
                            type="button"
                            className="evidence-remove"
                            onClick={() => removePhoto(photo.id)}
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="evidence-info" title={photo.name}>
                            {photo.name} ({photo.size})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* STEP 5: REPORTER INFO */}
                <section className="form-card">
                  <h2>5. Reporter Information</h2>
                  <p className="hint">Your account is attached so municipal supervisors can keep you updated on progress.</p>

                  <div className="reporter-box">
                    <div className="reporter-details">
                      <div className="reporter-avatar">
                        {currentUser?.role === 'authority' ? (
                          <Shield className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">
                          {currentUser?.name || 'Citizen Member'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {currentUser?.email || 'citizen@civicconnect.demo'}
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${currentUser?.role === 'authority' ? 'progress' : 'resolved'}`}>
                      {currentUser?.role === 'authority'
                        ? currentUser.department || 'Authority Official'
                        : 'Verified Citizen'}
                    </span>
                  </div>
                </section>

                {/* STEP 6: LIVE REVIEW & DISPATCH */}
                <section className="form-card">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="mb-0">Review Report & Municipal Routing</h2>
                    <span className="text-xs text-slate-400">Verify details prior to submission</span>
                  </div>
                  <p className="hint">Summary of the incident ticket dispatched to municipal servers.</p>

                  <table className="review-table">
                    <tbody>
                      <tr>
                        <td className="label">Issue Title</td>
                        <td className="value font-semibold text-slate-900">
                          {reportTitle || <em className="text-slate-400">Not specified yet</em>}
                        </td>
                      </tr>
                      <tr>
                        <td className="label">Description</td>
                        <td className="value text-slate-700">
                          {reportDescription || <em className="text-slate-400">Not specified yet</em>}
                        </td>
                      </tr>
                      <tr>
                        <td className="label">Target Department</td>
                        <td className="value font-bold text-blue-900">
                          {aiAnalysis ? (
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                              {aiAnalysis.department}
                            </span>
                          ) : (
                            <em className="text-slate-400">Will be determined by AI</em>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="label">Detected Category</td>
                        <td className="value">
                          {aiAnalysis ? (
                            <span className="badge dept-badge">{aiAnalysis.category}</span>
                          ) : (
                            <em className="text-slate-400">Pending AI analysis</em>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="label">Severity Level</td>
                        <td className="value">
                          {aiAnalysis ? (
                            <span
                              className={`badge ${
                                aiAnalysis.severity === 'Critical' || aiAnalysis.severity === 'High'
                                  ? 'reported'
                                  : 'progress'
                              }`}
                            >
                              {aiAnalysis.severity}
                            </span>
                          ) : (
                            <em className="text-slate-400">Pending AI estimation</em>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="label">Location & Coordinates</td>
                        <td className="value">
                          {reportLocation ? (
                            <div>
                              <div className="font-semibold text-slate-900">{reportLocation}</div>
                              {reportLatitude !== null && reportLongitude !== null && (
                                <div className="text-xs font-mono text-slate-500 mt-0.5">
                                  GPS: {reportLatitude.toFixed(5)}, {reportLongitude.toFixed(5)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <em className="text-slate-400">Not selected on map yet</em>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="label">Attached Photos</td>
                        <td className="value font-semibold">
                          {evidencePhotos.length} photo{evidencePhotos.length === 1 ? '' : 's'} attached
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-full sm:w-auto px-8"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit & Route to Department</span>
                    </button>
                    <span className="text-xs text-slate-500">
                      Dispatched with high-priority tracking ID to municipal municipal servers.
                    </span>
                  </div>
                </section>
              </form>
            )}
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* PAGE 3: EXPLORE ISSUES & INTERACTIVE MAP                       */}
      {/* ============================================================== */}
      {activePage === 'explore' && (
        <main className="page">
          <div className="container">
            <div className="page-title">
              <h1>Explore Civic Issues</h1>
              <p>Browse live citizen complaints and track real-time municipal resolution across your city.</p>
            </div>

            {/* FILTERS */}
            <div className="filters">
              <div className="searchbar">
                <Search />
                <input
                  type="text"
                  placeholder="Search issues, roads, departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Roads & Potholes">Roads & Potholes</option>
                <option value="Streetlights">Streetlights</option>
                <option value="Garbage & Waste">Garbage & Waste</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Traffic">Traffic</option>
                <option value="Public Infrastructure">Public Infrastructure</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="">All Severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="explore-grid">
              {/* REAL LEAFLET MAP VIEW */}
              <div className="sticky-map">
                <IssuesExplorerMap
                  issues={filteredIssues}
                  selectedIssue={selectedIssue}
                  onSelectIssue={setSelectedIssue}
                  onViewDetails={(issue) => {
                    setSelectedIssue(issue);
                    setActivePage('details');
                  }}
                  height="100%"
                />
              </div>

              {/* LIST VIEW */}
              <div className="issue-list">
                {filteredIssues.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                    <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No civic issues match your current filters.</p>
                    <button
                      className="btn btn-secondary btn-sm mt-3"
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCategoryFilter('');
                        setStatusFilter('');
                        setSeverityFilter('');
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredIssues.map((issue) => (
                    <article
                      key={issue.id}
                      className={`issue-card ${selectedIssue.id === issue.id ? 'selected' : ''}`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="issue-icon">
                        {renderCategoryIcon(issue.iconName, 'w-6 h-6 text-blue-600')}
                      </div>
                      <div className="issue-info">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3>{issue.title}</h3>
                          <span
                            className={`badge ${
                              issue.status === 'Resolved'
                                ? 'resolved'
                                : issue.status === 'In Progress'
                                ? 'progress'
                                : 'reported'
                            }`}
                          >
                            {issue.status}
                          </span>
                        </div>
                        <div className="text-xs text-blue-700 font-semibold mb-1 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{issue.department}</span>
                        </div>
                        <div className="meta mb-2">
                          <span>
                            <MapPin className="w-3.5 h-3.5" />
                            {issue.location}
                          </span>
                          <span>
                            <Clock className="w-3.5 h-3.5" />
                            {issue.date}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                          <span
                            className={`badge ${
                              issue.severity === 'Critical' || issue.severity === 'High'
                                ? 'reported'
                                : 'progress'
                            }`}
                          >
                            {issue.severity} Severity
                          </span>
                          <button
                            type="button"
                            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIssue(issue);
                              setActivePage('details');
                            }}
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* PAGE 4: MY REPORTS / AUTHORITY DISPATCH DASHBOARD              */}
      {/* ============================================================== */}
      {activePage === 'reports' && (
        <main className="page">
          <div className="container">
            <div className="page-title flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1>{currentUser?.role === 'authority' ? 'Municipal Department Dispatch & Resolution Portal' : 'My Civic Reports'}</h1>
                <p>
                  {currentUser?.role === 'authority'
                    ? `Managing active work orders dispatched to: ${currentUser.department || 'Public Works Department'}`
                    : 'Track inspection and repair status for issues you reported.'}
                </p>
              </div>

              {currentUser?.role === 'authority' ? (
                <div className="bg-blue-50 text-blue-900 border border-blue-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-700" />
                  <span>Authority Mode: Status Updates Enabled</span>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    setSubmissionSuccessReport(null);
                    setActivePage('report');
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Report New Issue</span>
                </button>
              )}
            </div>

            {/* DASHBOARD SUMMARY KPI CARDS */}
            <div className="dashboard-cards">
              <div className="dash-card">
                <span>Total Managed Tickets</span>
                <strong>{issuesList.length}</strong>
              </div>
              <div className="dash-card">
                <span>Reported (Pending Verification)</span>
                <strong className="text-red-600">
                  {issuesList.filter((x) => x.status === 'Reported').length}
                </strong>
              </div>
              <div className="dash-card">
                <span>In Progress (Field Work)</span>
                <strong className="text-amber-600">
                  {issuesList.filter((x) => x.status === 'In Progress').length}
                </strong>
              </div>
              <div className="dash-card">
                <span>Resolved & Verified</span>
                <strong className="text-emerald-600">
                  {issuesList.filter((x) => x.status === 'Resolved').length}
                </strong>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Issue Title</th>
                    <th>Routed Department</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    {currentUser?.role === 'authority' && <th>Authority Action</th>}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issuesList.map((issue) => (
                    <tr key={issue.id}>
                      <td>
                        <strong className="font-mono text-blue-700">{issue.id}</strong>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-900">{issue.title}</div>
                        <div className="text-xs text-slate-500">{issue.category}</div>
                      </td>
                      <td>
                        <span className="badge dept-badge">{issue.department}</span>
                      </td>
                      <td>{issue.location}</td>
                      <td>{issue.date}</td>
                      <td>
                        <span
                          className={`badge ${
                            issue.status === 'Resolved'
                              ? 'resolved'
                              : issue.status === 'In Progress'
                              ? 'progress'
                              : 'reported'
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>

                      {currentUser?.role === 'authority' && (
                        <td>
                          <div className="flex gap-1.5">
                            {issue.status !== 'In Progress' && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm text-xs py-1 px-2"
                                title="Mark In Progress"
                                onClick={() => handleUpdateStatus(issue.id, 'In Progress')}
                              >
                                <Wrench className="w-3 h-3 text-amber-600" />
                                Work
                              </button>
                            )}
                            {issue.status !== 'Resolved' && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm text-xs py-1 px-2"
                                title="Mark Resolved"
                                onClick={() => handleUpdateStatus(issue.id, 'Resolved')}
                              >
                                <Check className="w-3 h-3 text-emerald-600" />
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      )}

                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setActivePage('details');
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* PAGE 5: ISSUE DETAIL VIEW & RESOLUTION TIMELINE                */}
      {/* ============================================================== */}
      {activePage === 'details' && selectedIssue && (
        <main className="page">
          <div className="container">
            <div className="page-title">
              <button
                type="button"
                className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mb-2 hover:underline"
                onClick={() => setActivePage('explore')}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Explore</span>
              </button>
            </div>

            <div className="detail-grid">
              {/* PHOTO & IMPACT CARD */}
              <div>
                <div className="detail-photo">
                  <img
                    src={selectedIssue.photos[0]}
                    alt={selectedIssue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="detail-photo-tag">
                    <MapPin className="w-3.5 h-3.5 inline mr-1" />
                    {selectedIssue.location}
                  </div>
                </div>

                {/* ISSUE LOCATION MAP */}
                <div className="mt-4">
                  {typeof selectedIssue.latitude === 'number' && typeof selectedIssue.longitude === 'number' ? (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                      <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>Incident Location Map</span>
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 font-normal">
                          {selectedIssue.latitude.toFixed(5)}, {selectedIssue.longitude.toFixed(5)}
                        </span>
                      </div>
                      <LocationMap
                        latitude={selectedIssue.latitude}
                        longitude={selectedIssue.longitude}
                        address={selectedIssue.location}
                        interactive={false}
                        showLocateButton={false}
                        height="220px"
                      />
                    </div>
                  ) : (
                    <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>Map location is not available for this report.</span>
                    </div>
                  )}
                </div>

                <section className="form-card mt-5">
                  <h2>Community Impact & Neighborhood Validation</h2>
                  <div className="impact">
                    <strong>{selectedIssue.impactCount || 24} citizens</strong>
                    <span>have validated, upvoted, or reported similar hazards within a 500m radius.</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => setActivePage('explore')}
                    >
                      <Compass className="w-4 h-4" />
                      <span>View on City Map</span>
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        setSubmissionSuccessReport(null);
                        setReportTitle(`Follow-up on ${selectedIssue.title}`);
                        setReportLocation(selectedIssue.location);
                        setActivePage('report');
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Report a Similar Issue</span>
                    </button>
                  </div>
                </section>
              </div>

              {/* DETAILS & TIMELINE */}
              <div className="detail-side">
                <div className="detail-meta">
                  <span
                    className={`badge ${
                      selectedIssue.status === 'Resolved'
                        ? 'resolved'
                        : selectedIssue.status === 'In Progress'
                        ? 'progress'
                        : 'reported'
                    }`}
                  >
                    {selectedIssue.status}
                  </span>
                  <span
                    className={`badge ${
                      selectedIssue.severity === 'Critical' || selectedIssue.severity === 'High'
                        ? 'reported'
                        : 'progress'
                    }`}
                  >
                    {selectedIssue.severity} Severity
                  </span>
                  <span className="badge dept-badge">
                    <Briefcase className="w-3 h-3" />
                    {selectedIssue.department}
                  </span>
                </div>

                <h1>{selectedIssue.title}</h1>

                <div className="meta mb-4">
                  <span>
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedIssue.location}
                  </span>
                  <span>
                    <Clock className="w-3.5 h-3.5" />
                    Reported {selectedIssue.date}
                  </span>
                  <span className="font-mono text-blue-700 font-bold">
                    {selectedIssue.id}
                  </span>
                </div>

                <p className="detail-description">{selectedIssue.description}</p>

                {/* RESOLUTION PROGRESS TIMELINE */}
                <div className="timeline">
                  {/* Step 1 */}
                  <div className="step done">
                    <div className="step-icon">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <strong>Report Submitted by Citizen</strong>
                      <span>Logged into municipal queue on {selectedIssue.date}</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="step done">
                    <div className="step-icon">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <strong>AI Issue Verification & Triage</strong>
                      <span>Confidence rating {Math.round(selectedIssue.confidence * 100)}% verified</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`step ${selectedIssue.status !== 'Reported' ? 'done' : 'current'}`}>
                    <div className="step-icon">
                      {selectedIssue.status !== 'Reported' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <strong>Dispatched to Department</strong>
                      <span>Assigned to: <strong>{selectedIssue.department}</strong></span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div
                    className={`step ${
                      selectedIssue.status === 'Resolved'
                        ? 'done'
                        : selectedIssue.status === 'In Progress'
                        ? 'current'
                        : ''
                    }`}
                  >
                    <div className="step-icon">
                      {selectedIssue.status === 'Resolved' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Wrench className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <strong>Municipal Crew Work On-Site</strong>
                      <span>
                        {selectedIssue.status === 'In Progress'
                          ? 'Field crew mobilized and actively conducting repairs'
                          : selectedIssue.status === 'Resolved'
                          ? 'Field repairs completed'
                          : 'Awaiting scheduled inspection slot'}
                      </span>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className={`step ${selectedIssue.status === 'Resolved' ? 'done' : ''}`}>
                    <div className="step-icon">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <strong>Final Resolution & Audit</strong>
                      <span>
                        {selectedIssue.status === 'Resolved'
                          ? 'Supervisor inspected and closed ticket'
                          : 'Awaiting completion verification'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AUTHORITY ACTION IN DETAILS */}
                {currentUser?.role === 'authority' && (
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-700" />
                      Authority Dispatch Controls
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm flex-1"
                        onClick={() => handleUpdateStatus(selectedIssue.id, 'In Progress')}
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-600" />
                        Set In Progress
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm flex-1"
                        onClick={() => handleUpdateStatus(selectedIssue.id, 'Resolved')}
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* PAGE 6: LOGIN PAGE (CITIZEN & AUTHORITY)                       */}
      {/* ============================================================== */}
      {activePage === 'login' && (
        <main className="page auth-page">
          <div className="container">
            <div className="auth-card">
              <div className="auth-header">
                <div className="auth-eyebrow">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Secure Portal Access</span>
                </div>
                <h1>Welcome Back</h1>
                <p>Sign in to CIVIC-CONNECT to report, route, and resolve local issues.</p>
              </div>

              {/* ROLE TABS */}
              <div className="role-tabs">
                <button
                  type="button"
                  className={`role-tab ${authRole === 'user' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthRole('user');
                    setAuthAlert(null);
                  }}
                >
                  <User className="w-4 h-4" />
                  <span>Citizen / User</span>
                </button>
                <button
                  type="button"
                  className={`role-tab ${authRole === 'authority' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthRole('authority');
                    setAuthAlert(null);
                  }}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Authority</span>
                </button>
              </div>

              {authRole === 'authority' && (
                <div className="authority-indicator">
                  <ShieldAlert className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  <div>
                    <strong>Official Municipal Login:</strong> Grants access to ticket status management and departmental dispatch.
                  </div>
                </div>
              )}

              {authAlert && (
                <div className={`form-alert ${authAlert.type}`}>
                  {authAlert.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <div>{authAlert.message}</div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} noValidate>
                <div className="field">
                  <label htmlFor="loginEmail">
                    {authRole === 'authority' ? 'Official Email / Authority ID' : 'Email Address'}
                  </label>
                  <input
                    id="loginEmail"
                    type="text"
                    placeholder={authRole === 'authority' ? 'authority@civicconnect.demo' : 'citizen@civicconnect.demo'}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="loginPassword">Password</label>
                  <div className="password-wrapper">
                    <input
                      id="loginPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full mt-2"
                >
                  {authRole === 'authority' ? (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Sign In as Authority</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In as Citizen</span>
                    </>
                  )}
                </button>
              </form>

              {/* DEMO CREDENTIALS QUICK-FILL */}
              <div className="demo-credentials-card">
                <div className="demo-header">
                  <div className="demo-title">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Demo Credentials (1-Click Fill)</span>
                  </div>
                  <span className="demo-badge">Evaluation Prototype</span>
                </div>

                <div className="demo-info-grid">
                  <div className="demo-role-box">
                    <strong>Citizen Member:</strong>
                    <span>citizen@civicconnect.demo</span>
                    <span>Pass: Civic@123</span>
                  </div>
                  <div className="demo-role-box">
                    <strong>Authority Official:</strong>
                    <span>authority@civicconnect.demo</span>
                    <span>Pass: Authority@123</span>
                  </div>
                </div>

                <div className="demo-actions">
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => {
                      setAuthRole('user');
                      setLoginEmail('citizen@civicconnect.demo');
                      setLoginPassword('Civic@123');
                    }}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Use Citizen Demo</span>
                  </button>
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => {
                      setAuthRole('authority');
                      setLoginEmail('authority@civicconnect.demo');
                      setLoginPassword('Authority@123');
                    }}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Use Authority Demo</span>
                  </button>
                </div>
              </div>

              <div className="auth-footer-link">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthAlert(null);
                    setActivePage('signup');
                  }}
                >
                  Create an account
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* PAGE 7: SIGNUP PAGE                                            */}
      {/* ============================================================== */}
      {activePage === 'signup' && (
        <main className="page auth-page">
          <div className="container">
            <div className="auth-card max-w-lg">
              <div className="auth-header">
                <div className="auth-eyebrow">
                  <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Civic Membership Registration</span>
                </div>
                <h1>Create an Account</h1>
                <p>Join CIVIC-CONNECT to report problems and track municipal resolutions.</p>
              </div>

              {/* RESTRICTED NOTICE FOR AUTHORITY USERS */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 mb-4 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Official Authority Notice:</strong> Municipal authority accounts cannot be created publicly and are provisioned directly by the Municipal Administration.{' '}
                  <button
                    type="button"
                    onClick={() => setActivePortal('authority')}
                    className="font-bold underline text-blue-800 hover:text-blue-950 inline"
                  >
                    Go to Authority Portal &rarr;
                  </button>
                </div>
              </div>

              {authAlert && (
                <div className={`form-alert ${authAlert.type}`}>
                  {authAlert.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <div>{authAlert.message}</div>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} noValidate>
                <div className="field">
                  <label htmlFor="signupName">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="signupName"
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="signupEmail">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="signupEmail"
                    type="email"
                    placeholder="name@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="signupPhone">Phone Number (Optional)</label>
                  <input
                    id="signupPhone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                  />
                </div>

                <div className="input-row">
                  <div className="field">
                    <label htmlFor="signupPassword">Password <span className="text-red-500">*</span></label>
                    <input
                      id="signupPassword"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="signupConfirmPassword">Confirm <span className="text-red-500">*</span></label>
                    <input
                      id="signupConfirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Citizen Account</span>
                </button>
              </form>

              <div className="auth-footer-link">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthAlert(null);
                    setActivePage('login');
                  }}
                >
                  Sign in here
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {renderFooter()}
    </div>
  );
}
