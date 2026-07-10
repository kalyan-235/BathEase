import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import {
  Plus, Pencil, Trash2, Save, X, ChevronDown, ChevronUp,
  Package, Wrench, Tag, Sparkles, Hammer,
} from 'lucide-react';
import {
  BATHROOM_PACKAGES, MINI_SERVICES, VALUE_DEALS,
} from '@/lib/bathease';

// ── Section configs ───────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key:     'packages',
    label:   'Bathroom Packages',
    icon:    Package,
    color:   'text-blue-600',
    bgColor: 'bg-blue-50',
    defaults: BATHROOM_PACKAGES,
    fields: [
      { key: 'title',         label: 'Title',           type: 'text' },
      { key: 'bathrooms',     label: 'Bathrooms',       type: 'number' },
      { key: 'price',         label: 'Price (₹)',       type: 'number' },
      { key: 'originalPrice', label: 'Original Price',  type: 'number', optional: true },
      { key: 'badge',         label: 'Badge',           type: 'text',   optional: true },
      { key: 'duration',      label: 'Duration',        type: 'text' },
      { key: 'image',         label: 'Image path',      type: 'text' },
      { key: 'features',      label: 'Features',        type: 'tags' },
    ],
  },
  {
    key:     'miniServices',
    label:   'Mini Services',
    icon:    Wrench,
    color:   'text-green-600',
    bgColor: 'bg-green-50',
    defaults: MINI_SERVICES,
    fields: [
      { key: 'id',          label: 'ID (unique)',   type: 'text' },
      { key: 'name',        label: 'Name',          type: 'text' },
      { key: 'price',       label: 'Price (₹)',     type: 'number' },
      { key: 'description', label: 'Description',   type: 'text' },
      { key: 'image',       label: 'Image path',    type: 'text' },
    ],
  },
  {
    key:     'valueDeals',
    label:   'Value Deals',
    icon:    Tag,
    color:   'text-purple-600',
    bgColor: 'bg-purple-50',
    defaults: VALUE_DEALS,
    fields: [
      { key: 'title',         label: 'Title',           type: 'text' },
      { key: 'bathrooms',     label: 'Bathrooms',       type: 'number' },
      { key: 'totalPrice',    label: 'Total Price (₹)', type: 'number' },
      { key: 'originalPrice', label: 'Original Price',  type: 'number', optional: true },
      { key: 'badge',         label: 'Badge',           type: 'text',   optional: true },
      { key: 'duration',      label: 'Duration',        type: 'text' },
      { key: 'image',         label: 'Image path',      type: 'text' },
      { key: 'features',      label: 'Features',        type: 'tags' },
    ],
  },
  {
    key:     'offers',
    label:   'Offers & Banners',
    icon:    Sparkles,
    color:   'text-orange-600',
    bgColor: 'bg-orange-50',
    defaults: [
      { id: 1, title: 'Weekday Special', subtitle: 'Up to 20% off', type: 'weekday', active: true,
        points: ['2 bathrooms → 10% off', '3+ bathrooms → 20% off', 'Bundle ₹100 off', 'SHINE10 stacks on top'] },
      { id: 2, title: 'Weekend Special', subtitle: '20% off every booking', type: 'weekend', active: true,
        points: ['Saturday & Sunday only', 'No restrictions', 'No combo required', 'Pure savings'] },
    ],
    fields: [
      { key: 'title',    label: 'Title',    type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'type',     label: 'Type',     type: 'text' },
      { key: 'active',   label: 'Active',   type: 'boolean' },
      { key: 'points',   label: 'Points',   type: 'tags' },
    ],
  },
  {
    key:     'cleaningRequirements',
    label:   'Cleaning Requirements',
    icon:    Hammer,
    color:   'text-teal-600',
    bgColor: 'bg-teal-50',
    defaults: [
      { id: 1, label: 'Floor Scrubber',    image: '/floor_scrubber.jpeg' },
      { id: 2, label: 'Vacuum Clean',      image: '/vacuum_cleaner.jpeg' },
      { id: 3, label: 'Wiper',             image: '/wiper.jpeg' },
      { id: 4, label: 'Buffing Machine',   image: '/buffing_machine.jpeg' },
      { id: 5, label: 'Cleaning Solutions',image: '/cleaning_solutions.jpeg' },
      { id: 6, label: 'Fine Brush',        image: '/fine_brushes.jpeg' },
      { id: 7, label: 'Microfibre Cloths', image: '/microsoft_cloths.jpeg' },
      { id: 8, label: 'Sponge',            image: '/sponge.jpeg' },
    ],
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'image', label: 'Image path', type: 'text' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function blankItem(fields) {
  const obj = { id: newId() };
  fields.forEach(({ key, type }) => {
    obj[key] = type === 'number' ? 0 : type === 'boolean' ? true : type === 'tags' ? [] : '';
  });
  return obj;
}

// ── TagsInput ─────────────────────────────────────────────────────────────────
function TagsInput({ value = [], onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !value.includes(v)) { onChange([...value, v]); }
    setInput('');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {value.map((t, i) => (
          <span key={i} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {t}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="hover:text-red-500">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter…"
        />
        <Button size="sm" variant="outline" onClick={add}>Add</Button>
      </div>
    </div>
  );
}

// ── ItemEditor (modal) ────────────────────────────────────────────────────────
function ItemEditor({ item, fields, onSave, onClose }) {
  const [form, setForm] = useState(() => ({ ...item }));

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-card border-b border-border/30 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-lg">Edit Item</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-muted/80">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {fields.map(({ key, label, type, optional }) => (
            <div key={key}>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                {label} {optional && <span className="text-muted-foreground/50">(optional)</span>}
              </label>
              {type === 'tags' ? (
                <TagsInput value={form[key] || []} onChange={(v) => set(key, v)} />
              ) : type === 'boolean' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!form[key]} onChange={(e) => set(key, e.target.checked)}
                    className="h-4 w-4 rounded" />
                  <span className="text-sm">{form[key] ? 'Active' : 'Inactive'}</span>
                </label>
              ) : (
                <input
                  type={type === 'number' ? 'number' : 'text'}
                  value={form[key] ?? ''}
                  onChange={(e) => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => onSave(form)} className="flex-1">
            <Save className="h-4 w-4 mr-1.5" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Section Panel ─────────────────────────────────────────────────────────────
function SectionPanel({ section }) {
  const { key, label, icon: Icon, color, bgColor, defaults, fields } = section;

  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [editing,  setEditing]  = useState(null); // item being edited
  const [expanded, setExpanded] = useState(true);

  // Load from backend — fall back to static defaults if none saved yet
  useEffect(() => {
    (async () => {
      try {
        const data = await api.getContent(key);
        setItems(data?.length ? data : JSON.parse(JSON.stringify(defaults)));
      } catch {
        setItems(JSON.parse(JSON.stringify(defaults)));
      } finally {
        setLoading(false);
      }
    })();
  }, [key]);

  const save = async (list) => {
    setSaving(true);
    try {
      await api.saveContent(key, list);
      setItems(list);
      toast.success(`${label} saved`);
    } catch (e) {
      toast.error('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => setEditing(item);

  const handleSave = (updated) => {
    const next = items.map((i) => (i.id === updated.id ? updated : i));
    setEditing(null);
    save(next);
  };

  const handleAdd = () => {
    const item = blankItem(fields);
    setEditing(item);
    setItems((p) => [...p, item]);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this item?')) return;
    const next = items.filter((i) => i.id !== id);
    save(next);
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    save(next);
  };

  const moveDown = (idx) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    save(next);
  };

  const resetToDefaults = () => {
    if (!window.confirm('Reset to default content? This cannot be undone.')) return;
    save(JSON.parse(JSON.stringify(defaults)));
  };

  // Primary display field per section
  const getTitle = (item) =>
    item.title || item.name || item.label || item.id || 'Item';

  const getSubtitle = (item) => {
    if (item.price != null)      return `₹${item.price}`;
    if (item.totalPrice != null) return `₹${item.totalPrice}`;
    if (item.subtitle)           return item.subtitle;
    return '';
  };

  return (
    <Card className="overflow-hidden">
      {/* Section header */}
      <div
        className={`px-5 py-4 flex items-center gap-3 cursor-pointer select-none border-b border-border/40 ${bgColor}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <div className={`grid h-9 w-9 place-items-center rounded-xl bg-white/70 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${color}`}>{label}</p>
          <p className="text-xs text-muted-foreground">{items.length} items</p>
        </div>
        {saving && <span className="text-xs text-muted-foreground animate-pulse">Saving…</span>}
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          {/* Toolbar */}
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={handleAdd} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </Button>
            <Button size="sm" variant="outline" onClick={resetToDefaults} className="text-muted-foreground">
              Reset to defaults
            </Button>
          </div>

          {/* Item list */}
          {loading ? (
            <p className="text-sm text-muted-foreground py-4 text-center animate-pulse">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No items yet. Click "Add Item" to start.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id ?? idx}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background hover:bg-muted/20 transition-colors group"
                >
                  {/* Image preview */}
                  {item.image && (
                    <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img src={item.image} alt="" className="h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{getTitle(item)}</p>
                    {getSubtitle(item) && (
                      <p className="text-xs text-muted-foreground">{getSubtitle(item)}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveUp(idx)}
                      className="grid h-7 w-7 place-items-center rounded-lg hover:bg-muted transition-colors"
                      title="Move up" disabled={idx === 0}>
                      <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => moveDown(idx)}
                      className="grid h-7 w-7 place-items-center rounded-lg hover:bg-muted transition-colors"
                      title="Move down" disabled={idx === items.length - 1}>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleEdit(item)}
                      className="grid h-7 w-7 place-items-center rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                      title="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="grid h-7 w-7 place-items-center rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <ItemEditor
          item={editing}
          fields={fields}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}

// ── Main ContentManager ───────────────────────────────────────────────────────
export function ContentManager() {
  return (
    <div className="flex-1 p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Hammer className="h-6 w-6 text-primary" /> Content Manager
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add, edit, reorder or delete any content shown on the website. Changes save instantly to the database.
        </p>
      </div>

      {/* One panel per section */}
      {SECTIONS.map((section) => (
        <SectionPanel key={section.key} section={section} />
      ))}
    </div>
  );
}
