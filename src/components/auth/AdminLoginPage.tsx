import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Database,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  HelpCircle,
  X,
  UserPlus
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseClient';
import { AdminUser, InstituteSettings } from '../../types';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  instituteSettings: InstituteSettings;
  onBackToHome?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  instituteSettings,
  onBackToHome,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Initial Admin Setup modal
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupUsername, setSetupUsername] = useState('');
  const [setupFullName, setSetupFullName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupMsg, setSetupMsg] = useState<{ text: string; success: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await supabaseService.signIn(username, password, rememberMe);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(
          res.error || 'صارف کا نام یا پاس ورڈ غلط ہے۔ برائے مہربانی دوبارہ کوشش کریں۔'
        );
      }
    } catch (err: any) {
      setErrorMessage('لاگ ان میں فنی خرابی پیش آئی ہے۔ برائے مہربانی دوبارہ کوشش کریں۔');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setIsResetting(true);
    setForgotMsg(null);
    try {
      const res = await supabaseService.requestPasswordReset(forgotEmail);
      setForgotMsg({
        text: res.message || 'پاس ورڈ ری سیٹ کی ہدایات آپ کی ای میل پر روانہ کر دی گئی ہیں۔',
        success: res.success,
      });
    } catch {
      setForgotMsg({
        text: 'پاس ورڈ ری سیٹ بھیجنے میں خرابی پیش آئی۔',
        success: false,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleInitialAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupMsg(null);

    if (!setupUsername.trim() || !setupFullName.trim() || !setupPassword.trim()) {
      setSetupMsg({ text: 'برائے مہربانی تمام لازمی خانے پُر کریں۔', success: false });
      return;
    }

    if (setupPassword.length < 6) {
      setSetupMsg({ text: 'پاس ورڈ کم از کم ۶ حروف پر مشتمل ہونا چاہیے۔', success: false });
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setSetupMsg({ text: 'پاس ورڈ اور تصدیقی پاس ورڈ مماثل نہیں ہیں۔', success: false });
      return;
    }

    setSetupLoading(true);
    try {
      const res = await supabaseService.registerAdminAccount({
        username: setupUsername.trim(),
        email: setupEmail.trim() || `${setupUsername.trim()}@jamia-salahuddin.edu.pk`,
        fullName: setupFullName.trim(),
        password: setupPassword.trim(),
        role: 'super_admin',
      });

      if (res.success) {
        setSetupMsg({
          text: 'ماشاء اللہ! ابتدائی ایڈمن اکاؤنٹ کامیابی سے تیار ہو گیا۔ اب آپ لاگ ان کر سکتے ہیں۔',
          success: true,
        });
        setUsername(setupUsername.trim());
        setPassword(setupPassword.trim());
        setTimeout(() => {
          setShowSetupModal(false);
        }, 1800);
      } else {
        setSetupMsg({ text: res.error || 'ایڈمن اکاؤنٹ بنانے میں خرابی پیش آئی۔', success: false });
      }
    } catch (err: any) {
      setSetupMsg({ text: 'اکاؤنٹ سیٹ اپ میں غیر متوقع خرابی پیش آئی۔', success: false });
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#021d16] bg-islamic-pattern flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Back to Home Button if provided */}
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 hover:text-white hover:bg-emerald-900 transition-colors text-xs font-semibold cursor-pointer shadow-md"
        >
          <ArrowRight className="w-4 h-4" />
          <span>مرکزی ویب سائٹ پر واپس جائیں</span>
        </button>
      )}

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-800/40 overflow-hidden z-10">
        {/* Top Islamic Crest Header */}
        <div className="bg-gradient-to-b from-[#042f24] to-[#064e3b] p-7 text-center text-white relative">
          <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

          {/* Close button if in modal mode */}
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="absolute top-4 left-4 p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Emblem */}
            <div className="w-24 h-20 rounded-2xl overflow-hidden ring-4 ring-amber-400/80 shadow-xl mb-3.5 bg-black flex items-center justify-center p-1.5">
              <img
                src={instituteSettings.logoUrl}
                alt="جامعہ لوگو"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-amber-300 text-[11px] mb-2 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</span>
            </div>

            <h1 className="font-calligraphy text-2xl font-bold text-amber-300">
              {instituteSettings.instituteName}
            </h1>
            <p className="text-xs text-emerald-200 mt-0.5 font-medium">
              دفترِ اہتمام و داخلہ — ایڈمن لاگ ان
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              صارف کا نام (Username) یا ای میل
            </label>
            <div className="relative">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                dir="ltr"
                placeholder="admin یا nazim@jamia.edu.pk"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-left font-mono transition-all"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700">
                خفیہ پاس ورڈ (Password)
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotMsg(null);
                }}
                className="text-[11px] text-amber-700 hover:text-amber-800 hover:underline font-medium cursor-pointer"
              >
                پاس ورڈ بھول گئے؟
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-11 py-2.5 text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-left font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                aria-label={showPassword ? 'پاس ورڈ چھپائیں' : 'پاس ورڈ دکھائیں'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Security Badge */}
          <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300 cursor-pointer"
              />
              <span>مجھے لاگ ان رکھیں</span>
            </label>

            <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>محفوظ کنکشن</span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>تصدیق ہو رہی ہے...</span>
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>ایڈمن پینل میں داخل ہوں</span>
              </>
            )}
          </button>

          {/* Initial Admin Setup Option & Helper Box */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-2">
            <div className="flex items-center justify-between font-semibold text-stone-700">
              <span className="flex items-center gap-1 text-emerald-800">
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                ڈیفالٹ ایڈمن کوائف:
              </span>
              <span className="text-emerald-700 font-mono text-[10px]">Supabase Auth</span>
            </div>
            <div className="flex items-center justify-between text-stone-600 font-mono bg-white p-2 rounded-lg border border-stone-200" dir="ltr">
              <span>Username: <strong>admin</strong></span>
              <span>Password: <strong>admin123</strong></span>
            </div>
            <div className="pt-1 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[10px] text-stone-500">پہلی بار ایڈمن ترتیب دے رہے ہیں؟</span>
              <button
                type="button"
                onClick={() => {
                  setShowSetupModal(true);
                  setSetupMsg(null);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
              >
                <UserPlus className="w-3 h-3 text-amber-600" />
                <span>ابتدائی ایڈمن اکاؤنٹ بنائیں</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 text-center text-[11px] text-stone-400">
          <span>نظامِ انتظامِ جامعہ صلاح الدین ایوبی © ۱۴۴۷ھ / ۲۰۲۶ء</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>پاس ورڈ کی بازیابی</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              اپنا رجسٹرڈ ای میل ایڈریس درج کریں۔ آپ کو پاس ورڈ ری سیٹ کی ہدایات روانہ کی جائیں گی:
            </p>

            {forgotMsg && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  forgotMsg.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {forgotMsg.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                )}
                <span>{forgotMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                dir="ltr"
                placeholder="nazim@jamia-salahuddin.edu.pk"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
              />

              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                ڈیفالٹ ایڈمن پاس ورڈ <strong>admin123</strong> ہے۔ اگر تبدیل کیا ہے تو ایڈمن پروفائل سے دوبارہ ری سیٹ کیا جا سکتا ہے۔
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium"
                >
                  بند کریں
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-60"
                >
                  {isResetting ? 'روانہ ہو رہا ہے...' : 'ری سیٹ لنک بھیجیں'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Initial Admin Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>ابتدائی ایڈمنسٹریٹر اکاؤنٹ سیٹ اپ</span>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              جامعہ کے نظام کو چلانے کے لیے بااختیار ایڈمنسٹریٹر (ناظمِ اعلیٰ / پرنسپل) کا نیا محفوظ اکاؤنٹ بنائیں:
            </p>

            {setupMsg && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  setupMsg.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {setupMsg.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                )}
                <span>{setupMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleInitialAdminSetup} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  ایڈمنسٹریٹر کا مکمل نام
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: حضرت مولانا مفتی مجیب الرحمٰن صاحب"
                  value={setupFullName}
                  onChange={(e) => setSetupFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  صارف کا نام (Username)
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="nazim یا principal"
                  value={setupUsername}
                  onChange={(e) => setSetupUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  سرکاری ای میل ایڈریس
                </label>
                <input
                  type="email"
                  dir="ltr"
                  placeholder="nazim@jamia-salahuddin.edu.pk"
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    خفیہ پاس ورڈ
                  </label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    placeholder="کم از کم ۶ حروف"
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    تصدیق پاس ورڈ
                  </label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    placeholder="پاس ورڈ دوبارہ لکھیں"
                    value={setupConfirmPassword}
                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 leading-relaxed">
                یہ کوائف براؤزر کی سیکیور ریلے اور سپابیس (Supabase Auth) میں محفوظ ہوں گے۔ سیکیورٹی کی خاطر پاس ورڈ کبھی کوڈ میں ایکسپوز نہیں کیا جائے گا۔
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  disabled={setupLoading}
                  className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-60 shadow-xs"
                >
                  {setupLoading ? 'محفوظ ہو رہا ہے...' : 'اکاؤنٹ بنائیں و محفوظ کریں'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
