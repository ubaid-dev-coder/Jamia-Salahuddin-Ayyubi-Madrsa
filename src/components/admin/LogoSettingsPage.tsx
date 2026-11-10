import React, { useState, useRef } from 'react';
import {
  Upload,
  Save,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  FileImage,
  ShieldCheck,
  Building,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import { InstituteSettings } from '../../types';
import { supabaseService, DEFAULT_SETTINGS } from '../../services/supabaseClient';

interface LogoSettingsPageProps {
  instituteSettings: InstituteSettings;
  onSaveSettings: (settings: InstituteSettings) => Promise<void> | void;
  onNavigateTab: (tab: string) => void;
}

export const LogoSettingsPage: React.FC<LogoSettingsPageProps> = ({
  instituteSettings,
  onSaveSettings,
  onNavigateTab,
}) => {
  const currentSavedLogo = instituteSettings.logoUrl || DEFAULT_SETTINGS.logoUrl;

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

  // Sync with current settings
  React.useEffect(() => {
    setPreviewUrl(instituteSettings.logoUrl || DEFAULT_SETTINGS.logoUrl);
  }, [instituteSettings.logoUrl]);

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

  // 1. Save Logo (Uploads to Supabase Storage and updates institute_settings table)
  const handleSaveLogo = async () => {
    setStatusMessage(null);

    if (!selectedFile && previewUrl === currentSavedLogo) {
      setStatusMessage({
        text: 'کوئی نیا لوگو منتخب نہیں کیا گیا۔ برائے مہربانی پہلے "Choose Logo / لوگو منتخب کریں" پر کلک کریں۔',
        success: false,
      });
      return;
    }

    setIsUploading(true);
    try {
      let finalLogoUrl = previewUrl;

      // Upload to Supabase Storage bucket 'madrasa-media' folder 'logos'
      if (selectedFile) {
        finalLogoUrl = await supabaseService.uploadFile(selectedFile, 'logos');
      }

      const updatedSettings: InstituteSettings = {
        ...instituteSettings,
        logoUrl: finalLogoUrl,
      };

      await onSaveSettings(updatedSettings);

      setStatusMessage({
        text: 'ماشاء اللہ! جامعہ کا نیا مونوگرام کامیابی کے ساتھ سپابیس ڈیٹا بیس میں محفوظ اور پوری ویب سائٹ پر نافذ ہو گیا ہے۔',
        success: true,
      });

      setSelectedFile(null);
    } catch (err: any) {
      setStatusMessage({
        text: 'لوگو محفوظ کرنے میں فنی خرابی پیش آئی۔ براہِ کرم دوبارہ کوشش کریں۔',
        success: false,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 2. Change Logo (Trigger file picker)
  const handleChangeLogo = () => {
    fileInputRef.current?.click();
  };

  // 3. Remove Logo (Restore default Jamia emblem)
  const handleRemoveLogo = async () => {
    if (confirm('کیا آپ موجودہ لوگو کو ہٹا کر جامعہ کا اصل ڈیفالٹ مونوگرام بحال کرنا چاہتے ہیں؟')) {
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
          text: 'ڈیفالٹ مونوگرام بحال ہو چکا ہے۔',
          success: true,
        });
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

  const hasUnsavedChanges = Boolean(selectedFile || previewUrl !== currentSavedLogo);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#022c22] via-[#044333] to-[#064e3b] text-white p-6 lg:p-8 shadow-xl border border-emerald-800">
        <div className="absolute top-0 left-0 w-full h-full bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>لوگو اپلوڈ و میڈیا مینجمنٹ</span>
              <span className="text-emerald-300">·</span>
              <span className="font-mono">Supabase Storage</span>
            </div>

            <h1 className="font-calligraphy text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>جامعہ کا لوگو اپلوڈ کریں (Logo Settings)</span>
            </h1>

            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              یہاں سے جامعہ صلاح الدین ایوبی کا سرکاری لوگو یا مونوگرام اپلوڈ کریں۔ نیا لوگو محفوظ ہوتے ہی پوری ویب سائٹ، نیویگیشن بار، ہوم پیج، ایڈمن ڈیش بورڈ، لاگ ان پیج، اسٹوڈنٹ کارڈز اور رسیدوں پر خودکار طور پر نافذ ہو جائے گا۔
            </p>
          </div>

          {/* Quick Back to Dashboard */}
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="py-2.5 px-4 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/70 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <ArrowRight className="w-4 h-4" />
            <span>ایڈمن ڈیش بورڈ پر واپس جائیں</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 transition-all shadow-xs ${
            statusMessage.success
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-red-50 text-red-900 border border-red-300'
          }`}
        >
          {statusMessage.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
          )}
          <span className="font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Upload Zone on Left + Live Previews on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-5 bg-emerald-700 rounded-xs inline-block" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                ۱. نیا لوگو منتخب کریں (Upload Logo)
              </h2>
            </div>
            <span className="text-xs text-stone-400 font-mono">PNG, JPG, SVG (Max 5MB)</span>
          </div>

          {/* Big Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleChangeLogo}
            className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[260px] ${
              dragActive
                ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
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

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-emerald-800" />
            </div>

            {/* Prominent Upload Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleChangeLogo();
              }}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md hover:shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer mb-2"
            >
              <Upload className="w-4 h-4 text-stone-950" />
              <span>Choose Logo / لوگو منتخب کریں</span>
            </button>

            <p className="text-xs text-stone-500 mt-2">
              کمپیوٹر یا موبائل گیلری سے لوگو منتخب کریں، یا فائل یہاں ڈریگ کر کے لائیں۔
            </p>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-200/80 text-[11px] text-stone-500 font-mono">
              <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">.PNG</span>
              <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">.JPG / .JPEG</span>
              <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">.SVG</span>
              <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">.WEBP</span>
            </div>
          </div>

          {/* Selected File Details */}
          {fileDetails && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                  {fileDetails.type}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-stone-900 truncate" dir="ltr">
                    {fileDetails.name}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    سائز: {fileDetails.sizeKb} KB · اپلوڈ کے لیے تیار ہے
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] shrink-0 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>منتخب شدہ</span>
              </span>
            </div>
          )}

          {/* 3 Dedicated Functional Buttons: Save Logo, Change Logo, Remove Logo */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-3">
            {/* Button 1: Save Logo */}
            <button
              type="button"
              onClick={handleSaveLogo}
              disabled={isUploading || (!selectedFile && previewUrl === currentSavedLogo)}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>محفوظ ہو رہا ہے...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save Logo (لوگو محفوظ کریں)</span>
                </>
              )}
            </button>

            {/* Button 2: Change Logo */}
            <button
              type="button"
              onClick={handleChangeLogo}
              disabled={isUploading}
              className="py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-emerald-800" />
              <span>Change Logo (دوسرا منتخب کریں)</span>
            </button>

            {/* Button 3: Remove Logo */}
            <button
              type="button"
              onClick={handleRemoveLogo}
              disabled={isUploading}
              className="py-3 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer mr-auto"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Remove Logo (لوگو حذف کریں)</span>
            </button>
          </div>
        </div>

        {/* Live Preview Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-800" />
                <h3 className="font-bold text-stone-900 text-sm">
                  ۲. براہِ راست پیش نظارہ (Live Preview)
                </h3>
              </div>
              {hasUnsavedChanges && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                  پیش نظارہ غیر محفوظ شدہ
                </span>
              )}
            </div>

            {/* Preview 1: Header / Navbar View (Emerald Dark) */}
            <div className="p-4 rounded-2xl bg-[#042f24] border border-emerald-700/80 shadow-md text-white space-y-2">
              <span className="text-[11px] text-emerald-300 font-semibold block">
                ویب سائٹ نیویگیشن بار اور ایڈمن لاگ ان پر عکس:
              </span>
              <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-emerald-800/60">
                <div className="w-18 h-16 rounded-xl overflow-hidden ring-2 ring-amber-400 bg-black flex items-center justify-center p-1.5 shadow-md shrink-0">
                  <img
                    src={previewUrl}
                    alt="لوگو پیش نظارہ"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-calligraphy text-lg font-bold text-amber-300 truncate">
                    {instituteSettings.instituteName}
                  </h4>
                  <p className="text-[11px] text-emerald-300 truncate">
                    مرکزی دینی ادارہ و دار القرآن · 11G نیو کراچی
                  </p>
                </div>
              </div>
            </div>

            {/* Preview 2: Official Document / Card / Receipt View (White Card) */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] text-stone-500 font-semibold block">
                اسٹوڈنٹ کارڈز، فیس و تنخواہ رسیدوں پر عکس:
              </span>
              <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="w-16 h-14 rounded-xl overflow-hidden border border-emerald-800 bg-black flex items-center justify-center p-1 shrink-0">
                  <img
                    src={previewUrl}
                    alt="لوگو پرنٹ پیش نظارہ"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h5 className="font-calligraphy text-base font-bold text-stone-900">
                    {instituteSettings.instituteName}
                  </h5>
                  <p className="text-[10px] text-stone-500 font-mono">
                    OFFICIAL EMBLEM · WFAQ-PK-1978/542
                  </p>
                </div>
              </div>
            </div>

            {/* Automatic Site-wide Sync Notice */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>خودکار کُلّی نفاذ (Automatic Site-wide Sync):</span>
              </div>
              <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                لوگو تبدیل کرنے کے بعد درج ذیل تمام ۷ مقامات پر یہ خودکار طور پر فوراً اپ ڈیٹ ہو جاتا ہے:
              </p>
              <ul className="text-[11px] text-emerald-900 font-medium list-disc list-inside space-y-0.5 pr-1">
                <li>ویب سائٹ نیویگیشن بار (Navbar)</li>
                <li>مرکزی ہوم پیج (Homepage)</li>
                <li>مرکزی ایڈمن ڈیش بورڈ (Admin Dashboard)</li>
                <li>ایڈمن لاگ ان پیج (Admin Login Page)</li>
                <li>طلباء کے شناختی کارڈز (Student ID Cards)</li>
                <li>ماہانہ فیس کی رسیدیں (Fee Receipts)</li>
                <li>ملازمین و اساتذہ تنخواہ کی رسیدیں (Salary Receipts)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
