import { useState, useRef } from 'react';
import { api, session } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/button';
import {
  User, Mail, Phone, MapPin, Camera, Save,
  ShieldCheck, Calendar, Edit3, X, Check,
} from 'lucide-react';

export function AdminProfile() {
  const raw  = session.getUser();
  const [user, setUser]     = useState(raw);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);

  // Editable fields
  const [name,     setName]     = useState(raw?.name     ?? '');
  const [whatsapp, setWhatsapp] = useState(raw?.whatsapp ?? '');
  const [location, setLocation] = useState(raw?.location ?? '');
  const [address,  setAddress]  = useState(raw?.address  ?? '');
  const [img,      setImg]      = useState(raw?.profileImage ?? '');

  const fileRef = useRef(null);

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
      setUser({ ...user, ...updated });
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

  const initials = (user?.name ?? 'A').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="flex-1 p-6 sm:p-8 space-y-6 max-w-3xl">

      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold">Admin Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details and contact information.</p>
      </div>

      {/* Profile card */}
      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">

        {/* Cover gradient */}
        <div className="h-28 bg-gradient-hero relative">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent_60%)]" />
        </div>

        {/* Avatar + name row */}
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between flex-wrap gap-4">
            {/* Avatar */}
            <div className="relative">
              {img ? (
                <img
                  src={img}
                  alt={user?.name}
                  className="h-24 w-24 rounded-2xl object-cover border-4 border-card shadow-md"
                />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-gradient-hero text-primary-foreground border-4 border-card shadow-md grid place-items-center text-2xl font-bold">
                  {initials}
                </div>
              )}
              {editing && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-md hover:bg-primary/90 transition-colors"
                  title="Change photo"
                >
                  <Camera className="h-4 w-4" />
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

            {/* Actions */}
            <div className="flex gap-2 mb-2">
              {!editing ? (
                <Button onClick={() => setEditing(true)} variant="outline" className="gap-2">
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving
                      ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      : <Save className="h-4 w-4" />
                    }
                    {saving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Name & role */}
          <div className="mt-4">
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-bold bg-transparent border-b-2 border-primary outline-none w-full max-w-xs pb-1"
                placeholder="Full name"
              />
            ) : (
              <h3 className="text-xl font-bold">{user?.name}</h3>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrator
              </span>
              {joinedDate && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {joinedDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Email */}
        <DetailCard
          icon={<Mail className="h-4 w-4" />}
          label="Email address"
          color="text-blue-600"
          bg="bg-blue-50 dark:bg-blue-950/30"
        >
          <p className="text-sm font-medium break-all">{user?.email ?? '—'}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Cannot be changed</p>
        </DetailCard>

        {/* WhatsApp */}
        <DetailCard
          icon={<Phone className="h-4 w-4" />}
          label="WhatsApp number"
          color="text-green-600"
          bg="bg-green-50 dark:bg-green-950/30"
        >
          {editing ? (
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          ) : (
            <p className="text-sm font-medium">{user?.whatsapp || <span className="text-muted-foreground">Not set</span>}</p>
          )}
        </DetailCard>

        {/* City / Location */}
        <DetailCard
          icon={<MapPin className="h-4 w-4" />}
          label="City / Location"
          color="text-orange-600"
          bg="bg-orange-50 dark:bg-orange-950/30"
        >
          {editing ? (
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Hyderabad, Telangana"
              className="w-full h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          ) : (
            <p className="text-sm font-medium">{user?.location || <span className="text-muted-foreground">Not set</span>}</p>
          )}
        </DetailCard>

        {/* Role */}
        <DetailCard
          icon={<User className="h-4 w-4" />}
          label="Account role"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/30"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <p className="text-sm font-medium capitalize">{user?.role ?? 'admin'}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Full dashboard access</p>
        </DetailCard>
      </div>

      {/* Address — full width */}
      <div className="bg-card rounded-2xl border border-border/60 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-50 dark:bg-teal-950/30 text-teal-600">
            <MapPin className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Service Address</p>
        </div>
        {editing ? (
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Flat, building, street, city…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        ) : (
          <p className="text-sm text-foreground leading-relaxed">
            {user?.address || <span className="text-muted-foreground">No address set</span>}
          </p>
        )}
      </div>

    </div>
  );
}

function DetailCard({ icon, label, color, bg, children }) {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${bg} ${color}`}>
          {icon}
        </div>
        <p className={`text-sm font-semibold ${color}`}>{label}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
