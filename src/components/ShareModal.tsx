import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Share2, ExternalLink, Globe, ShieldCheck } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  teacherName
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use the canonical shared URL if available, otherwise current location
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `รายงานผลการประเมินตนเอง (SAR) · ${teacherName}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `ระบบประเมินผลการปฏิบัติงานและผลงานเชิงประจักษ์ ${teacherName}`,
          url: currentUrl
        });
      } catch {
        // User cancelled or ignored
      }
    } else {
      handleCopyLink();
    }
  };

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  // QR Code generator URL using public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                แชร์เว็บไซต์ผลงานออนไลน์ (SHARE)
              </h2>
              <p className="text-[11px] text-slate-500">
                ส่งต่อให้คณะกรรมการประเมินและผู้สนใจเข้าชมได้ทันที
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Public Access Notice */}
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold">ออนไลน์และเปิดให้ทุกคนเข้าชมได้ทันที:</span>{' '}
              ผู้ตรวจประเมิน คณะกรรมการ และผู้สนใจทั่วไปสามารถเปิดดูเกณฑ์ ตัวชี้วัด และร่องรอยเชิงประจักษ์ได้ทันทีโดยไม่ต้องล็อกอิน
            </div>
          </div>

          {/* Copy URL Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
              ลิงก์สำหรับเข้าชม (PUBLIC WEB APP URL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-800 font-mono truncate focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleCopyLink}
                className={`btn-lambo flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>คัดลอกแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>คัดลอกลิงก์</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border border-slate-200 p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-32 h-32 bg-white p-2 border border-slate-300 shrink-0 shadow-xs flex items-center justify-center">
              <img
                src={qrCodeUrl}
                alt="QR Code สำหรับเข้าชมเว็บ"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center sm:text-left space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-800 font-mono">
                <QrCode className="w-4 h-4 text-amber-600" />
                <span>QR CODE สแกนเปิดบนมือถือ</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                เหมาะสำหรับนำไปพิมพ์ใส่เล่มรายงาน หรือให้คณะกรรมการสแกนผ่านกล้องสมาร์ตโฟน/iPad เพื่อตรวจประเมินหน้างานได้รวดเร็ว
              </p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
              แชร์ไปยังช่องทางอื่น
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* LINE */}
              <a
                href={lineShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold rounded-xs transition-colors"
              >
                <span>แชร์ผ่าน LINE</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-xs transition-colors"
              >
                <span>แชร์บน Facebook</span>
              </a>

              {/* Native device share (if supported) */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>แชร์ด้วยเครื่อง</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="btn-lambo px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
