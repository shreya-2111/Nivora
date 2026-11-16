'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  DoorClosed,
  AlertCircle,
  BellRing,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { RequestUrgency } from '@/types';

interface RoomServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultItem?: string;
}

const CATEGORY_PRESETS: Record<string, string[]> = {
  'Extra Towels': [
    '2 Bath Towels',
    '4 Bath Towels',
    'Full ROOM Set',
    'Floor Mat',
  ],
  'Drinking Water': [
    '2 Still Bottles',
    '2 Sparkling Carafes',
    'Chilled Ice Bucket',
    'Full Hydration Set',
  ],
  'Toiletries': [
    'Dental & Shaving Kit',
    'Bath Foam & Salts',
    'Vanity Grooming Set',
    'Complete Toiletries',
  ],
  'Housekeeping': [
    'Evening Turn-down',
    'Full Room Refresh',
    'Linen Renewal',
    'Quick Tidy-up',
  ],
  'Laundry & Pressing': [
    'Garment Pressing (2 pcs)',
    'Express Dry Clean',
    'Shoe Polish & Valet',
    'Suit Steaming',
  ],
  'Maintenance': [
    'Climate Temperature',
    'Lighting Scene Setting',
    'TV & AV Support',
    'Plumbing Check',
  ],
  'Other Request': [
    'Pillow Menu Selection',
    'Luggage Assistance',
    'Floral Arrangement',
    'Custom Request',
  ],
  'Housekeeping & Linen': [
    'Fresh Plush Bath Sheets & Towels',
    'Bottled Spring Water (Still/Sparkling)',
    'Feather Pillows & Silk Pillowcases',
    'Evening Turndown Service & Chocolates',
    'Extra Luxury Duvet & Warm Throw',
    'Complete Suite Cleaning Service',
    'Laundry & Garment Pressing',
  ],
  'Concierge & Luggage': [
    'Luggage Porter & Valet Assistance',
    'Laundry & Express Dry Cleaning',
    'Airport Luxury Chauffeur Transfer',
    'Scheduled Morning Wake-Up Call',
    'Shoe Polish & Garment Steaming',
    'Private City Tour & Restaurant Reservations',
  ],
  'Hotel Amenities': [
    'Artisan Ice Bucket & Highball Glasses',
    'Chilled Bottled Spring Water',
    'Dental & Grooming Luxury Kit (Toiletries)',
    'Nivora Terry Slippers & Bathrobes',
    'Espresso Pods & Fine Herbal Teas',
    'Universal Power Adapter & Phone Charger',
  ],
  'Spa & Wellness': [
    'In-Suite Swedish Aromatherapy Massage (60m)',
    'Deep Tissue Revival Massage (90m)',
    'Organic Botanical Facial Treatment',
    'Private Thermal Sauna Reservation',
    'Yoga Mat & Guided Meditation Set',
  ],
  'Front Desk & Support': [
    'Maintenance / Thermostat & Room Adjustment',
    'Late Check-Out Inquiry (2:00 PM)',
    'Room Folio & Invoice Delivery',
    'Keycard Replacement / Additional Key',
    'Manager Direct Callback Request',
  ],
};

interface RoomServiceRequestContentProps {
  onClose: () => void;
  defaultCategory: string;
  defaultItem?: string;
}

function RoomServiceRequestContent({
  onClose,
  defaultCategory,
  defaultItem,
}: RoomServiceRequestContentProps) {
  const { guest, addRoomRequest } = useNivora();

  const [category, setCategory] = useState(defaultCategory);
  const [selectedPreset, setSelectedPreset] = useState(defaultItem || '');
  const [customItem, setCustomItem] = useState('');
  const [urgency, setUrgency] = useState<RequestUrgency>('Immediate (10-15 mins)');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const currentPresets = CATEGORY_PRESETS[category] || CATEGORY_PRESETS['Housekeeping & Linen'];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const finalItem = customItem.trim() || selectedPreset;

    if (!finalItem) {
      newErrors.item = 'Please choose a preset request or describe your custom request.';
    }

    if (!urgency) {
      newErrors.urgency = 'Please select your preferred urgency.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalItem = customItem.trim() || selectedPreset;
    const newReq = addRoomRequest({
      roomNumber: guest.roomNumber,
      guestName: guest.name,
      serviceCategory: category,
      requestItem: finalItem,
      urgency,
      notes: notes.trim() || undefined,
    });

    setSubmittedTicket(newReq.ticketNumber);
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    setSelectedPreset('');
    setCustomItem('');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Concierge Service Request</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <DoorClosed className="h-3 w-3 text-amber-400" />
                <span>Room {guest.roomNumber} • {guest.name}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {submittedTicket ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Demo Ticket Created
              </span>
              <h3 className="text-xl font-bold text-white">{submittedTicket} Confirmed</h3>
              <p className="text-xs text-slate-300 max-w-sm">
                Your request has been routed to the hotel concierge team. Attendant assigned to Room {guest.roomNumber}.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 w-full text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Service Department:</span>
                <span className="font-semibold text-amber-300">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Requested Item:</span>
                <span className="font-medium text-slate-200 text-right max-w-[200px] truncate">
                  {customItem || selectedPreset}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expected Timing:</span>
                <span className="text-emerald-400 font-medium">{urgency}</span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-300/80 text-center w-full">
              Demo Simulation: This ticket is saved to local state and visible in the Admin Dashboard.
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Department / Category Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Department
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.keys(CATEGORY_PRESETS).map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setSelectedPreset('');
                        setCustomItem('');
                        setErrors({});
                      }}
                      className={`rounded-xl px-2.5 py-2 text-[11px] font-medium text-center transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {cat.split(' & ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Select Popular Request
              </label>
              <div className="space-y-1.5">
                {currentPresets.map((preset) => {
                  const isChecked = selectedPreset === preset && !customItem;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset);
                        setCustomItem('');
                        if (errors.item) setErrors((prev) => ({ ...prev, item: '' }));
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2 text-xs text-left transition ${
                        isChecked
                          ? 'border border-amber-400 bg-amber-500/15 text-amber-200 font-medium'
                          : 'border border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{preset}</span>
                      {isChecked && <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Item Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="custom-request-item"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wide"
              >
                Or Describe Custom Request
              </label>
              <input
                id="custom-request-item"
                type="text"
                value={customItem}
                onChange={(e) => {
                  setCustomItem(e.target.value);
                  if (errors.item) setErrors((prev) => ({ ...prev, item: '' }));
                }}
                placeholder="e.g. 2 extra wine glasses, baby cot, international adapter..."
                className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden ${
                  errors.item ? 'border-rose-500' : 'border-slate-800 focus:border-amber-400'
                }`}
              />
              {errors.item && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.item}
                </p>
              )}
            </div>

            {/* Urgency Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-400" />
                Preferred Timing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Immediate (10-15 mins)', 'Within 30 mins', 'Later Today'] as RequestUrgency[]).map(
                  (urg) => {
                    const isSelected = urgency === urg;
                    return (
                      <button
                        key={urg}
                        type="button"
                        onClick={() => setUrgency(urg)}
                        className={`rounded-xl border px-2 py-2 text-[11px] font-medium transition ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {urg.split(' ')[0]}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Special Instructions / Notes */}
            <div className="space-y-1.5">
              <label
                htmlFor="special-notes-instructions"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wide"
              >
                Special Delivery Notes (Optional)
              </label>
              <textarea
                id="special-notes-instructions"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please do not knock, leave outside door on luggage bench..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 py-3 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition active:scale-98"
            >
              <span>Submit Request to Concierge</span>
            </button>

            <p className="text-center text-[10px] text-slate-500">
              Demo Mode • All requests are stored locally for interface testing.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export function RoomServiceRequestModal({
  isOpen,
  onClose,
  defaultCategory = 'Housekeeping & Linen',
  defaultItem = '',
}: RoomServiceRequestModalProps) {
  if (!isOpen) return null;

  return (
    <RoomServiceRequestContent
      key={`${defaultCategory}-${defaultItem}`}
      onClose={onClose}
      defaultCategory={defaultCategory}
      defaultItem={defaultItem}
    />
  );
}
