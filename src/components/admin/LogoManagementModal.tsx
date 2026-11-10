import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Save,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Check,
  FileImage,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { InstituteSettings } from '../../types';
import { supabaseService, DEFAULT_SETTINGS } from '../../services/supabaseClient';

interface LogoManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  instituteSettings: InstituteSettings;
  onSaveSettings: (settings: InstituteSettings) => Promise<void> | void;
}

export const LogoManagementModal: React.FC<LogoManagementModalProps> = ({
  isOpen,
  onClose,
  instituteSettings,
  onSaveSettings,
}) => {
  // Current active logo in system
  const currentSavedLogo = instituteSettings.logoUrl || DEFAULT_SETTINGS.logoUrl;

  // Selected file and live preview state
  const [previewUrl, setPreviewUrl] = useState<string>(currentSavedLogo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    sizeKb: number;
    type: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    success: boolean;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when opened
  React.useEffect(() => {
    if (isOpen) {
      setPreviewUrl(instituteSettings.logoUrl || DEFAULT_SETTINGS.logoUrl);
      setSelectedFile(null);
      setFileDetails(null);
      setStatusMessage(null);
    }
  }, [isOpen, instituteSettings.logoUrl]);

  if (!isOpen) return null;

  // Validate format and set preview
  const handleProcessFile = (file: File) => {
    setStatusMessage(null);

    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml',
      'image/webp',
    ];

    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = ['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(
      extension || ''
    );

    if (!validTypes.includes(file.type) && !isValidExtension) {
      setStatusMessage({
        text: 'صرف PNG، JPG، JPEG یا SVG فارمیٹ کی تصاویر کی اجازت ہے۔',
        success: false,
      });
      return;
    }

    // Size limit check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({
        text: 'فائل کا سائز ۵ میگا بائٹ (5MB) سے کم ہونا چاہیے۔',
        success: false,
      });
      return;
    }

    setSelectedFile(file);
    setFileDetails({
      name: file.name,
      sizeKb: Math.round(file.size / 1024),
      type: extension ? extension.toUpperCase() : 'IMG',
    });

    // Create object URL for instant preview before uploading/saving
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Save new logo to Supabase Storage & settings
  const handleSaveLogo = async () => {
    setStatusMessage(null);

    // If no changes
    if (!selectedFile && previewUrl === currentSavedLogo) {
      setStatusMessage({
        text: 'کوئی نئی تصویر منتخب نہیں کی گئی۔ برائے مہربانی پہلے نیا لوگو اپلوڈ کریں۔',
        success: false,
      });
      return;
    }

    setIsUploading(true);
    try {
      let finalLogoUrl = previewUrl;

      // 1. If file was selected, upload to Supabase Storage
      if (selectedFile) {
        finalLogoUrl = await supabaseService.uploadFile(selectedFile, 'logos');
      }

      // 2. Persist in institute settings
      const updatedSettings: InstituteSettings = {
        ...instituteSettings,
        logoUrl: finalLogoUrl,
      };

      await onSaveSettings(updatedSettings);

      setStatusMessage({
        text: 'ماشاء اللہ! جامعہ کا نیا مونوگرام کامیابی کے ساتھ پورے سافٹ ویئر میں اپ ڈیٹ ہو چکا ہے۔',
        success: true,
      });

      setSelectedFile(null);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMessage({
        text: 'لوگو محفوظ کرنے میں فنی خرابی پیش آئی۔ براہِ کرم دوبارہ کوشش کریں۔',
        success: false,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Restore Default official Jamia logo
  const handleRestoreDefault = async () => {
    if (confirm('کیا آپ جامعہ کا اصلی ڈیفالٹ مونوگرام بحال کرنا چاہتے ہیں؟')) {
      setIsUploading(true);
      try {
        const updatedSettings: InstituteSettings = {
          ...instituteSettings,
          logoUrl: DEFAULT_SETTINGS.logoUrl,
        };
        await onSaveSettings(updatedSettings);
        setPreviewUrl(DEFAULT_SETTINGS.logoUrl);
        setSelectedFile(null);
        setFileDetails(null);
        setStatusMessage({
          text: 'ڈیفالٹ لوگو بحال کر دیا گیا۔',
          success: true,
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      } catch {
        setStatusMessage({
          text: 'ڈیفالٹ بحال کرنے میں خرابی ہوئی۔',
          success: false,
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Delete / Reset logo to placeholder
  const handleDeleteLogo = async () => {
    if (confirm('کیا آپ موجودہ لوگو کو حذف کر کے ڈیفالٹ مونوگرام پر واپس جانا چاہتے ہیں؟')) {
      await handleRestoreDefault();
    }
  };

  const hasUnsavedChanges = Boolean(selectedFile || previewUrl !== currentSavedLogo);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      dir="rtl"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Upload className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-calligraphy text-xl font-bold text-amber-300">
                  لوگو تبدیل کریں (Institute Logo Management)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 font-mono">
                  Supabase Storage
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                جامعہ کا نیا لوگو اپلوڈ کریں جو پوری ویب سائٹ، لاگ ان، ڈیش بورڈ، اسٹوڈنٹ کارڈز اور رسیدوں پر خودکار طور پر نافذ ہو جائے گا۔
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2.5 transition-all ${
                statusMessage.success
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {statusMessage.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* Dual Zone: Drag & Drop Upload Zone + Live Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Box: Upload Controls & Drop Zone */}
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] ${
                  dragActive
                    ? 'border-amber-500 bg-amber-50/50 scale-[1.01]'
                    : 'border-stone-300 hover:border-emerald-700 hover:bg-stone-50/80 bg-stone-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 border border-emerald-300/60 flex items-center justify-center text-emerald-800 mb-3 shadow-xs">
                  <Upload className="w-7 h-7 text-emerald-800" />
                </div>

                <p className="font-bold text-stone-800 text-sm">
                  کمپیوٹر یا موبائل سے تصویر منتخب کریں
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  یا تصویر کو یہاں ڈریگ اینڈ ڈراپ (Drag & Drop) کریں
                </p>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-200/80 text-[11px] text-stone-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">PNG</span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">JPG</span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">JPEG</span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">SVG</span>
                </div>
              </div>

              {/* Selected File Details Badge */}
              {fileDetails && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileImage className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="font-semibold text-stone-800 truncate" dir="ltr">
                      {fileDetails.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-bold shrink-0">
                    {fileDetails.sizeKb} KB ({fileDetails.type})
                  </span>
                </div>
              )}

              {/* Instructions */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <p className="font-semibold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>لوگو اپلوڈ کی تجاویز:</span>
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-stone-500 pr-1">
                  <li>شفاف پس منظر (Transparent PNG / SVG) بہترین دکھائی دیتا ہے۔</li>
                  <li>مربع (1:1) یا مستطیل سائز خودکار طور پر متناسب ایڈجسٹ ہو جائے گا۔</li>
                </ul>
              </div>
            </div>

            {/* Right Box: Live Previews on Different Themes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>محفوظ کرنے سے قبل پیش نظارہ (Live Preview):</span>
                </span>
                {hasUnsavedChanges && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                    غیر محفوظ شدہ پیش نظارہ
                  </span>
                )}
              </div>

              {/* 1. Preview on Dark Emerald Background (Navbar & Login Style) */}
              <div className="p-4 rounded-2xl bg-[#042f24] border border-emerald-700/80 shadow-md text-white space-y-2">
                <span className="text-[10px] text-emerald-300 font-medium block">
                  نیویگیشن بار اور لاگ ان پر مونوگرام کا عکس:
                </span>
                <div className="flex items-center gap-3 bg-black/30 p-2.5 rounded-xl border border-emerald-800/60">
                  <div className="w-16 h-14 sm:w-18 sm:h-16 rounded-xl overflow-hidden ring-2 ring-amber-400 bg-black flex items-center justify-center p-1 shadow-md shrink-0">
                    <img
                      src={previewUrl}
                      alt="لوگو پیش نظارہ"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-calligraphy text-base sm:text-lg font-bold text-amber-300 truncate">
                      {instituteSettings.instituteName}
                    </h4>
                    <p className="text-[10px] text-emerald-300 truncate">
                      مرکزی دینی ادارہ و دار القرآن
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Preview on Clean White Background (Official Documents & ID Cards) */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                <span className="text-[10px] text-stone-500 font-medium block">
                  اسٹوڈنٹ کارڈ، رسیدوں اور پرنٹس پر مونوگرام کا عکس:
                </span>
                <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div className="w-14 h-12 rounded-xl overflow-hidden border border-emerald-800/40 bg-black flex items-center justify-center p-1 shrink-0">
                    <img
                      src={previewUrl}
                      alt="لوگو پرنٹ پیش نظارہ"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="font-calligraphy text-sm font-bold text-stone-900">
                      {instituteSettings.instituteName}
                    </h5>
                    <p className="text-[10px] text-stone-500 font-mono">
                      OFFICIAL INSTITUTIONAL SEAL
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions for Existing Logo */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  disabled={isUploading}
                  className="flex-1 py-2 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>لوگو حذف / ری سیٹ کریں</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestoreDefault}
                  disabled={isUploading}
                  className="py-2 px-3 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="اصل ڈیفالٹ مونوگرام پر واپس جائیں"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                  <span>ڈیفالٹ بحال</span>
                </button>
              </div>
            </div>
          </div>

          {/* Everywhere Update Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="leading-relaxed">
              <p className="font-bold text-emerald-900">
                خودکار کُلّی نفاذ (Automatic Site-wide Sync):
              </p>
              <p className="text-[11px] text-emerald-800/90">
                محفوظ کرنے پر نیا لوگو خودکار طور پر نیویگیشن بار، ہوم پیج، ایڈمن ڈیش بورڈ، لاگ ان پیج، داخلہ کارڈز، اسٹوڈنٹ کارڈز اور تمام فیس و تنخواہ رسیدوں پر فوری ظاہر ہو جائے گا۔
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer with Save Logo & Cancel Buttons */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="py-2.5 px-5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            منسوخ کریں (Cancel)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveLogo}
              disabled={isUploading || (!selectedFile && previewUrl === currentSavedLogo)}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>محفوظ ہو رہا ہے...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>نیا لوگو محفوظ کریں (Save Logo)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
