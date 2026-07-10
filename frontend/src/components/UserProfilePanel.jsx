import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, session } from '@/lib/api';
import { toast } from 'sonner';
import {
  X, Camera, Save, LogOut, Mail, Phone,
  MapPin, User, Edit3, Check, CalendarDays,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/button';

export function UserProfilePanel({ user, onClose, onLogout, onUserUpdate }) {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [name,     setName]     = useState(user?.name     ?? '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [address,  setAddress]  = useState(user?.address  ?? '');
  const [img,      setImg]      = useState(user?.profileImage ?? '');

  const initials = (user?.name ?? 'U')
    .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  const onFileChange = (f) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImg(String(reader.result));
    reader.readAsDataURL(f);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProfile({ name, whatsapp, location, address, profileImage: img });
      session.updateUser(updated);
      onUserUpdate?.(updated);
      setEditing(false);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name ?? '');
    setWhatsapp(user?.whatsapp ?? '');
    setLocation(user?.location ?? '');
    setAddress(user?.address ?? '');
    setImg(user?.profileImage ?? '');
    setEditing(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel — right side */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-background z-50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="font-bold text-base">My Profile</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Cover + avatar */}
          <div className="relative">
            <div className="h-24 bg-gradient-hero" />
            <div className="px-5 -mt-10 flex items-end justify-between pb-4">
              {/* Avatar */}
              <div className="relative">
                {img ? (
                  <img
                    src={img}
                    alt={user?.name}
                    className="h-20 w-20 rounded-2xl object-cover border-4 border-background shadow-md"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-hero text-primary-foreground border-4 border-background shadow-md grid place-items-center text-xl font-bold">
                    {initials}
                  </div>
                )}
                {editing && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center shadow hover:bg-primary/90 transition-colors"
                    title="Change photo"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFileChange(e.target.files?.[0])}
                />
              </div>

              {/* Edit / Save / Cancel buttons */}
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors mb-1"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2 mb-1">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {saving
                      ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      : <Save className="h-3.5 w-3.5" />
                    }
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Name + role */}
          <div className="px-5 pb-4 border-b border-border/60">
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg font-bold bg-transparent border-b-2 border-primary outline-none w-full pb-0.5"
                placeholder="Your name"
              />
            ) : (
              <h3 className="text-lg font-bold">{user?.name}</h3>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {user?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                  <ShieldCheck className="h-3 w-3" /> Admin
                </span>
              )}
              {joinedDate && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CalendarDays className="h-3 w-3" /> Joined {joinedDate}
                </span>
              )}
            </div>
          </div>

          {/* Detail fields */}
          <div className="px-5 py-4 space-y-4">

            {/* Email — read only */}
            <Field icon={<Mail className="h-4 w-4" />} label="Email" color="text-blue-500">
              <p className="text-sm font-medium break-all">{user?.email}</p>
            </Field>

            {/* WhatsApp */}
            <Field icon={<Phone className="h-4 w-4" />} label="WhatsApp" color="text-green-500">
              {editing ? (
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              ) : (
                <p className="text-sm">{whatsapp || <span className="text-muted-foreground">Not set</span>}</p>
              )}
            </Field>

            {/* City */}
            <Field icon={<MapPin className="h-4 w-4" />} label="City / Location" color="text-orange-500">
              {editing ? (
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Hyderabad, Telangana"
                  className="w-full h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              ) : (
                <p className="text-sm">{location || <span className="text-muted-foreground">Not set</span>}</p>
              )}
            </Field>

            {/* Address */}
            <Field icon={<User className="h-4 w-4" />} label="Service Address" color="text-teal-500">
              {editing ? (
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Flat, building, street, city…"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              ) : (
                <p className="text-sm leading-relaxed">
                  {address || <span className="text-muted-foreground">Not set</span>}
                </p>
              )}
            </Field>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-border/60 space-y-2">
          <button
            onClick={() => { onClose(); navigate('/dashboard'); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <CalendarDays className="h-4 w-4" /> View My Bookings
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </>
  );
}

function Field({ icon, label, color, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className={color}>{icon}</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className="pl-5">{children}</div>
    </div>
  );
}
