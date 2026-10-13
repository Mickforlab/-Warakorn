import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  LogIn,
  LogOut,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Loader2,
  Lock,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface AuthControlProps {
  currentUser: User | null;
  isLoadingAuth: boolean;
  isAdmin: boolean;
  authError: string | null;
  onLogin: () => void;
  onLogout: () => void;
  onClearError: () => void;
  primaryAdminEmail: string;
}

export const AuthControl: React.FC<AuthControlProps> = ({
  currentUser,
  isLoadingAuth,
  isAdmin,
  authError,
  onLogin,
  onLogout,
  onClearError,
  primaryAdminEmail
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-500 bg-slate-100 rounded-lg">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
        <span className="hidden sm:inline">กำลังตรวจสอบสิทธิ์...</span>
      </div>
    );
  }

  // Not logged in: Public Viewer state
  if (!currentUser) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={onLogin}
          className="flex items-center gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-amber-50 hover:text-amber-950 border border-slate-300 hover:border-amber-400 rounded-lg transition-all duration-150 cursor-pointer shadow-xs group"
          title="เข้าสู่ระบบด้วย Google Account สำหรับครูผู้รับการประเมิน (ผู้เข้าชมทั่วไปสามารถดูได้ปกติโดยไม่ต้องเข้าสู่ระบบ)"
        >
          {/* Google Color G Icon */}
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="hidden sm:inline">เข้าสู่ระบบ Google</span>
          <span className="sm:hidden">เข้าสู่ระบบ</span>
        </button>

        {/* Auth Error Banner if present */}
        {authError && (
          <div className="absolute right-0 mt-2 w-80 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
              <button
                onClick={onClearError}
                className="text-red-600 hover:text-red-900 font-bold px-1"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Logged in: Either Admin or Guest Google User
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 cursor-pointer shadow-xs ${
          isAdmin
            ? 'bg-amber-50 border-amber-300 text-slate-900 hover:bg-amber-100 hover:border-amber-400'
            : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
        }`}
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName || 'Google Account'}
            className="w-6 h-6 rounded-full border border-amber-400 object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
            {currentUser.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}

        <div className="text-left hidden md:block">
          <div className="text-[11px] font-bold leading-tight flex items-center gap-1">
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 inline" />
                <span className="text-amber-900">ผู้ดูแลระบบ</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500 inline" />
                <span className="text-slate-600">ผู้ชม</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-slate-500 max-w-[130px] truncate">
            {currentUser.email}
          </div>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      </button>

      {/* Account Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt=""
                className="w-9 h-9 rounded-full border border-amber-400 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                {currentUser.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="font-bold text-slate-900 truncate">
                {currentUser.displayName || 'ผู้ใช้งาน Google'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
            </div>
          </div>

          {/* Role Status */}
          <div className="my-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
            {isAdmin ? (
              <div className="text-amber-900 flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">ได้รับสิทธิ์ผู้ดูแลระบบ</div>
                  <div className="text-[10px] text-slate-600">
                    สามารถเปิดโหมดแก้ไข อัปเดตข้อมูล และบันทึกลงฐานข้อมูลได้
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-700 flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">โหมดผู้ชม (Read Only)</div>
                  <div className="text-[10px] text-slate-600">
                    สิทธิ์แก้ไขระบบสงวนไว้เฉพาะ: <span className="font-mono text-amber-800">{primaryAdminEmail}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-1 flex flex-col gap-1.5">
            {!isAdmin && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogin();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                สลับไปใช้บัญชี {primaryAdminEmail}
              </button>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
