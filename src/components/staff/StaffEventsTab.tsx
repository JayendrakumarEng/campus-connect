import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const eventTypes = ['workshop', 'seminar', 'hackathon', 'placement_drive', 'cultural', 'sports', 'other'];

const StaffEventsTab = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [eventType, setEventType] = useState('workshop');
  const [department, setDepartment] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    setEvents(data || []);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('events').insert({
      title,
      description,
      event_date: eventDate,
      venue: venue || null,
      event_type: eventType,
      department: department || null,
      created_by: user.id,
    });
    if (error) {
      toast.error('Failed to create event');
    } else {
      toast.success('Event created!');
      setTitle(''); setDescription(''); setEventDate(''); setVenue(''); setDepartment('');
      setShowForm(false);
      fetchEvents();
    }
    setSaving(false);
  };

  const deleteEvent = async (id: string) => {
    await supabase.from('events').delete().eq('id', id);
    toast.success('Event deleted');
    fetchEvents();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">College Events</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Create Event
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label>Event Title *</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. AI Workshop 2026" />
              </div>
              <div className="space-y-1">
                <Label>Description *</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="Event details, speakers, agenda..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Date & Time *</Label>
                  <Input type="datetime-local" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label>Venue</Label>
                  <Input value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Auditorium, Lab 301" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Event Type</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(t => (
                        <SelectItem key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. CSE, ECE" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Event'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {events.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No events yet.</p>
      ) : (
        events.map(event => (
          <Card key={event.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{event.title}</span>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">{event.event_type?.replace('_', ' ')}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(event.event_date), 'PPp')}</span>
                    {event.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.venue}</span>}
                    {event.department && <span>Dept: {event.department}</span>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default StaffEventsTab;
