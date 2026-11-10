import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Lock,
  KeyRound,
  ShieldAlert,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Users
} from 'lucide-react';
import { AdminUser, InstituteSettings } from '../../types';
import { supabaseService, StoredAdminAccount } from '../../services/supabaseClient';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: AdminUser | null;
  onUpdateAdminUser: (user: AdminUser) => void;
  instituteSettings: InstituteSettings;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
  adminUser,
  onUpdateAdminUser,
  instituteSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'accounts'>('profile');

  // Profile Form State
  const [fullName, setFullName] = useState(adminUser?.fullName || '');
  const [email, setEmail] = useState(adminUser?.email || '');
  const [profileMsg, setProfileMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ text: string; success: boolean } | null>(null);

  // New Admin Form State
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'super_admin' | 'nazim' | 'mudarris'>('nazim');
  const [accountMsg, setAccountMsg] = useState<{ text: string; success: boolean } | null>(null);

  // List of accounts
  const [adminAccounts, setAdminAccounts] = useState<StoredAdminAccount[]>(() =>
    supabaseService.getAdminAccounts()
  );

  if (!isOpen) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;

    const res = await supabaseService.updateAdminProfile(
      adminUser.username,
      fullName.trim(),
      email.trim()
    );

    if (res.success && res.user) {
      onUpdateAdminUser(res.user);
      setProfileMsg({ text: 'پروفائل کوائف کامیابی کے ساتھ اپ ڈیٹ ہو گئے۔', success: true });
    } else {
      setProfileMsg({ text: 'پروفائل اپ ڈیٹ میں خرابی پیش آئی۔', success: false });
    }
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword.length < 6) {
      setPassMsg({ text: 'نیا پاس ورڈ کم از کم ۶ حروف پر مشتمل ہونا چاہیے۔', success: false });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ text: 'نیا پاس ورڈ اور تصدیقی پاس ورڈ مماثل نہیں ہیں۔', success: false });
      return;
    }

    if (!adminUser) return;

    const res = await supabaseService.changeAdminPassword(
      adminUser.username,
      oldPassword,
      newPassword
    );

    if (res.success) {
      setPassMsg({ text: 'پاس ورڈ کامیابی سے تبدیل ہو گیا ہے۔ اگلی بار نیا پاس ورڈ استعمال کریں۔', success: true });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassMsg({ text: res.error || 'پاس ورڈ تبدیل کرنے میں خرابی پیش آئی۔', success: false });
    }
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMsg(null);

    if (!newAdminUser.trim() || !newAdminPass.trim()) {
      setAccountMsg({ text: 'یوزرنیم اور پاس ورڈ لازمی ہیں۔', success: false });
      return;
    }

    const res = await supabaseService.registerAdminAccount({
      username: newAdminUser.trim(),
      email: newAdminEmail.trim() || `${newAdminUser.trim()}@jamia-salahuddin.edu.pk`,
      fullName: newAdminName.trim() || newAdminUser.trim(),
      password: newAdminPass.trim(),
      role: newAdminRole,
    });

    if (res.success) {
      setAccountMsg({ text: 'نیا ایڈمن اکاؤنٹ کامیابی کے ساتھ رجسٹر ہو گیا!', success: true });
      setNewAdminUser('');
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPass('');
      setAdminAccounts(supabaseService.getAdminAccounts());
    } else {
      setAccountMsg({ text: res.error || 'اکاؤنٹ بنانے میں خرابی پیش آئی۔', success: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-calligraphy text-xl font-bold text-amber-300">
                ایڈمن پروفائل و سیکیورٹی کنٹرول
              </h3>
              <p className="text-xs text-emerald-200">
                پاس ورڈ تبدیلی، پروفائل کی تدوین اور نئے منتظمین کی رجسٹریشن
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

        {/* Tab Buttons */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            پروفائل کوائف
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            پاس ورڈ تبدیل کریں
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            تمام ایڈمن اکاؤنٹس
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: Profile Details */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {profileMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    profileMsg.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-800 border-2 border-amber-400 flex items-center justify-center text-xl font-bold text-amber-300">
                  {adminUser?.fullName?.charAt(0) || 'ص'}
                </div>
                <div>
                  <h4 className="font-calligraphy text-lg font-bold text-amber-300">
                    {adminUser?.fullName || 'حضرت مولانا مفتی مجیب الرحمٰن صاحب'}
                  </h4>
                  <p className="text-xs text-emerald-200 font-mono" dir="ltr">
                    Username: @{adminUser?.username} | Role: {adminUser?.role || 'super_admin'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  پورا نام (عہدہ دار / منتظم)
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  ای میل ایڈریس
                </label>
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-xs transition-colors"
                >
                  کوائف محفوظ کریں
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Change Password */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    passMsg.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {passMsg.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  )}
                  <span>{passMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  موجودہ (پرانا) پاس ورڈ
                </label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    required
                    dir="ltr"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="موجودہ پاس ورڈ درج کریں"
                    className="w-full pr-3 pl-10 py-2.5 text-sm font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  نیا محفوظ پاس ورڈ
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    dir="ltr"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="کم از کم ۶ حروف"
                    className="w-full pr-3 pl-10 py-2.5 text-sm font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  نئے پاس ورڈ کی تصدیق
                </label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="نیا پاس ورڈ دوبارہ درج کریں"
                  className="w-full px-3 py-2.5 text-sm font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>پاس ورڈ تبدیل کریں</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: All Admin Accounts & Register */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              {/* Account list */}
              <div>
                <h4 className="text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-800" />
                  <span>جامعہ کے مجاز ایڈمن اکاؤنٹس ({adminAccounts.length})</span>
                </h4>
                <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                  {adminAccounts.map((acc) => (
                    <div key={acc.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-stone-900">{acc.fullName}</p>
                        <p className="text-[11px] text-stone-500 font-mono" dir="ltr">
                          @{acc.username} • {acc.email}
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {acc.role === 'super_admin' ? 'مہتمم / سپر ایڈمن' : acc.role === 'nazim' ? 'ناظم تعلیمات' : 'مدرس'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Admin Form */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-4">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-amber-600" />
                  <span>نیا منتظم / ایڈمن اکاؤنٹ بنائیں</span>
                </h4>

                {accountMsg && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      accountMsg.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {accountMsg.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    )}
                    <span>{accountMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleCreateNewAdmin} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        پورا نام
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="مولانا عبد الرحمن"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        یوزرنیم (Username)
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={newAdminUser}
                        onChange={(e) => setNewAdminUser(e.target.value)}
                        placeholder="abdurrehman"
                        className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        ای میل
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="abdurrehman@jamia.edu.pk"
                        className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        خفیہ پاس ورڈ
                      </label>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="py-2 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>ایڈمن شامل کریں</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
