import React, { useState } from 'react';
import {
  X,
  Building,
  Upload,
  Save,
  CheckCircle,
  Database,
  Sparkles,
  RefreshCw,
  Copy,
  ExternalLink,
  Shield,
  Image as ImageIcon
} from 'lucide-react';
import { InstituteSettings, SupabaseConfig } from '../../types';
import { supabaseService } from '../../services/supabaseClient';

interface InstituteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: InstituteSettings;
  onSaveSettings: (settings: InstituteSettings) => void;
  onConfigUpdated: () => void;
  initialTab?: 'general' | 'logo' | 'supabase';
}

export const InstituteSettingsModal: React.FC<InstituteSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onConfigUpdated,
  initialTab = 'general',
}) => {
  const [formData, setFormData] = useState<InstituteSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'logo' | 'supabase'>(initialTab);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(settings);
      setActiveTab(initialTab);
    }
  }, [isOpen, settings, initialTab]);

  // Supabase connection state
  const config = supabaseService.getConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(config.url || '');
  const [supabaseKey, setSupabaseKey] = useState(config.anonKey || '');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await supabaseService.uploadFile(file, 'logos');
      setFormData((prev) => ({ ...prev, logoUrl: publicUrl }));
    } catch (err) {
      alert('لوگو اپلوڈ کرنے میں خرابی ہوئی۔');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCampusPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await supabaseService.uploadFile(file, 'campus');
      setFormData((prev) => ({ ...prev, campusPhotoUrl: publicUrl }));
    } catch (err) {
      alert('تصویر اپلوڈ کرنے میں خرابی ہوئی۔');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMadinaHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await supabaseService.uploadFile(file, 'campus');
      setFormData((prev) => ({ ...prev, madinaHeroPhotoUrl: publicUrl }));
    } catch (err) {
      alert('مدینہ منورہ ہیرو تصویر اپلوڈ کرنے میں خرابی ہوئی۔');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleSaveSupabaseConfig = async () => {
    setTestingConnection(true);
    setConnectionResult(null);

    supabaseService.saveConfig(supabaseUrl.trim(), supabaseKey.trim());
    onConfigUpdated();

    const result = await supabaseService.testConnection();
    setConnectionResult(result);
    setTestingConnection(false);
  };

  const copySqlSchema = () => {
    const schemaSql = `-- جامعہ صلاح الدین ایوبی — Supabase Tables
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, arabic_title TEXT NOT NULL, description TEXT, head_of_department TEXT NOT NULL, timing TEXT NOT NULL, total_students INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY, full_name TEXT NOT NULL, father_name TEXT NOT NULL, department_id TEXT REFERENCES departments(id), gender TEXT, date_of_birth DATE, admission_date DATE, current_para_or_level TEXT, teacher_name TEXT, address TEXT, city TEXT, father_mobile_number TEXT, guardian_name TEXT, guardian_relation TEXT, guardian_phone TEXT, photo_url TEXT, monthly_fee NUMERIC, fee_status TEXT, status TEXT, notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), student_id TEXT REFERENCES students(id), date DATE, status TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(student_id, date)
);
CREATE TABLE IF NOT EXISTS institute_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary', institute_name TEXT NOT NULL, sub_title TEXT, registration_number TEXT, phone TEXT, email TEXT, address TEXT, city TEXT, logo_url TEXT, campus_photo_url TEXT, principal_name TEXT, academic_year TEXT
);
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access" ON students FOR ALL TO authenticated USING (true);`;

    navigator.clipboard.writeText(schemaSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-calligraphy text-xl font-bold text-amber-300">
                جامعہ کی ترتیبات و سپابیس کنکشن
              </h3>
              <p className="text-xs text-emerald-200">
                لوگو، تعلیمی سال، رابطہ معلومات اور کلاؤڈ ڈیٹا بیس سیٹنگز
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            بنیادی معلومات و پتہ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'logo'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            لوگو و تصاویر (Storage)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            سپابیس کنکشن (Supabase DB)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {saveSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>جامعہ کی ترتیبات کامیابی کے ساتھ محفوظ ہو گئیں!</span>
            </div>
          )}

          {/* TAB 1: General Info */}
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    جامعہ کا سرکاری نام
                  </label>
                  <input
                    type="text"
                    value={formData.instituteName}
                    onChange={(e) =>
                      setFormData({ ...formData, instituteName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ذیلی عنوان / ٹیگ لائن
                  </label>
                  <input
                    type="text"
                    value={formData.subTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    مہتمم / ناظمِ اعلیٰ کا نام
                  </label>
                  <input
                    type="text"
                    value={formData.principalName}
                    onChange={(e) =>
                      setFormData({ ...formData, principalName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    حالیہ تعلیمی سال
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) =>
                      setFormData({ ...formData, academicYear: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    رابطہ فون نمبر / لینڈ لائن
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    سرکاری ای میل ایڈریس
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 font-mono text-left"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    جامعہ کا پتہ
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>معلومات محفوظ کریں</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Logo & Media */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              {/* Institute Logo Upload Box */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-amber-400 shadow-md bg-emerald-950 shrink-0">
                  <img
                    src={formData.logoUrl}
                    alt="مونوگرام"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 text-center sm:text-right flex-1">
                  <h4 className="font-bold text-stone-900 text-sm">
                    جامعہ کا سرکاری مونوگرام / لوگو (Supabase Storage)
                  </h4>
                  <p className="text-xs text-stone-500">
                    یہ لوگو داخلہ سلپ، شناختی کارڈ، ڈیش بورڈ اور تمام پرنٹس پر نمودار ہوتا ہے۔
                  </p>
                  <label className="inline-flex items-center gap-2 py-1.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'اپلوڈ جاری ہے...' : 'نیا لوگو اپلوڈ کریں'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Campus Photo Upload Box */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-emerald-800 shadow-xs bg-emerald-950 shrink-0">
                  <img
                    src={formData.campusPhotoUrl}
                    alt="کیمپس تصویر"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 text-center sm:text-right flex-1">
                  <h4 className="font-bold text-stone-900 text-sm">
                    جامعہ کیمپس کا احاطہ / بینر
                  </h4>
                  <p className="text-xs text-stone-500">
                    ڈیش بورڈ اور تعلیمی رپورٹس کے پس منظر کے لیے مرکزی تصویر۔
                  </p>
                  <label className="inline-flex items-center gap-2 py-1.5 px-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    <span>{isUploading ? 'اپلوڈ جاری ہے...' : 'کیمپس تصویر تبدیل کریں'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCampusPhotoUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Madina Munawwara Hero Photo Upload Box */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-emerald-800 shadow-xs bg-emerald-950 shrink-0">
                  <img
                    src={formData.madinaHeroPhotoUrl}
                    alt="مدینہ منورہ ہیرو تصویر"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 text-center sm:text-right flex-1">
                  <h4 className="font-bold text-stone-900 text-sm">
                    مدینہ منورہ ہیرو بینر تصویر (مسجدِ نبوی ﷺ و گنبدِ خضراء)
                  </h4>
                  <p className="text-xs text-stone-500">
                    ہوم پیج کے ٹاپ فل وڈتھ ہیرو سیکشن کا دلکش اسلامی پس منظر۔
                  </p>
                  <label className="inline-flex items-center gap-2 py-1.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'اپلوڈ جاری ہے...' : 'مدینہ ہیرو تصویر تبدیل کریں'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMadinaHeroUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onSaveSettings(formData);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className="py-2 px-5 rounded-xl bg-emerald-800 text-white font-medium text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>تصاویر محفوظ کریں</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Supabase Database Config */}
          {activeTab === 'supabase' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-sm text-amber-300">
                      سپابیس کلاؤڈ کنکشن (Supabase Database)
                    </h4>
                  </div>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono ${
                      config.isConfigured
                        ? 'bg-emerald-800 text-emerald-200 border border-emerald-700'
                        : 'bg-amber-900/60 text-amber-200 border border-amber-700'
                    }`}
                  >
                    {config.isConfigured ? 'Connected / Ready' : 'Standby Mode'}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  جامعہ صلاح الدین ایوبی کا ڈیٹا پرماننٹلی سپابیس PostgreSQL ڈیٹا بیس میں محفوظ ہوتا ہے۔
                  اگر آپ کا اپنا سپابیس پروجیکٹ موجود ہے تو نیچے URL اور Anon Key درج کریں، ورنہ سسٹم کا بلٹ ان محفوظ ڈیٹا بیس خودکار کام جاری رکھے گا۔
                </p>
              </div>

              {connectionResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    connectionResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{connectionResult.message}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={copySqlSchema}
                  className="py-2 px-3.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-emerald-800" />
                  <span>{copiedSql ? 'SQL سکیما کاپی ہو گیا!' : 'Supabase SQL اسکرپٹ کاپی کریں'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveSupabaseConfig}
                    disabled={testingConnection}
                    className="py-2 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {testingConnection ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>محفوظ کریں و ٹیسٹ کنکشن</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
