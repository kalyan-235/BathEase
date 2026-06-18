import { useEffect, useState } from 'react';
import { Card } from '@/components/card';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Users, Mail, Phone, MapPin, ShieldCheck, User } from 'lucide-react';

export function LoginUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.allUsers();
        setUsers(data);
      } catch (e) {
        toast.error('Could not load users: ' + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 grid place-items-center py-24">
        <p className="text-muted-foreground animate-pulse">Loading users…</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Registered Users
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            All users who have signed up on BathEase
          </p>
        </div>
        <span className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          {users.length} total
        </span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>WhatsApp</Th>
                <Th>Location</Th>
                <Th>Role</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map((u, i) => (
                <tr key={u._id} className="border-t border-border/60 hover:bg-muted/20 transition-colors">
                  <Td className="text-muted-foreground">{i + 1}</Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      {/* Avatar */}
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        {u.profileImage
                          ? <img src={u.profileImage} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
                          : <User className="h-4 w-4" />
                        }
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {u.email}
                    </span>
                  </Td>
                  <Td>
                    {u.whatsapp
                      ? <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{u.whatsapp}</span>
                      : <span className="text-muted-foreground/50">—</span>
                    }
                  </Td>
                  <Td>
                    {u.location || u.address
                      ? <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{u.location || u.address}</span>
                      : <span className="text-muted-foreground/50">—</span>
                    }
                  </Td>
                  <Td>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      u.role === 'admin'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <ShieldCheck className="h-3 w-3" />
                      {u.role}
                    </span>
                  </Td>
                  <Td className="text-muted-foreground text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left font-semibold">{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
