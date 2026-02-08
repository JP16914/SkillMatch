'use client';

import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react';

interface ParsedData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: string[];
  headline?: string;
  summary?: string;
  skills?: string[];
  education?: any[];
  experience?: any[];
  projects?: any[];
  confidence?: Record<string, number>;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedData: ParsedData;
  onSave: (data: ParsedData) => Promise<void>;
}

export default function ReviewModal({ isOpen, onClose, parsedData, onSave }: ReviewModalProps) {
  const [formData, setFormData] = useState<ParsedData>(parsedData);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleLinksChange = (value: string) => {
    const links = value.split('\n').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, links }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const getConfidenceBadge = (field: string) => {
    const confidence = parsedData.confidence?.[field] || 0;
    const color = confidence > 0.7 ? 'bg-emerald-500' : confidence > 0.4 ? 'bg-amber-500' : 'bg-slate-400';
    return (
      <span className={`${color} text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider`}>
        {Math.round(confidence * 100)}%
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Review Your Profile</h2>
              <p className="text-primary-100 font-medium">Verify and edit the extracted information</p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wide">First Name</span>
                  {getConfidenceBadge('firstName')}
                </label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Last Name</span>
                  {getConfidenceBadge('lastName')}
                </label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Username</span>
                {getConfidenceBadge('username')}
              </label>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors"
                placeholder="john.doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Email</span>
                  {getConfidenceBadge('email')}
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Phone</span>
                  {getConfidenceBadge('phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Location</span>
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Headline</span>
              </label>
              <input
                type="text"
                value={formData.headline || ''}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors"
                placeholder="Full Stack Developer"
              />
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Summary</span>
              </label>
              <textarea
                value={formData.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors resize-none"
                placeholder="Brief professional summary..."
              />
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Links</span>
                {getConfidenceBadge('links')}
              </label>
              <textarea
                value={formData.links?.join('\n') || ''}
                onChange={(e) => handleLinksChange(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors resize-none"
                placeholder="https://linkedin.com/in/johndoe&#10;https://github.com/johndoe&#10;https://portfolio.com"
              />
              <p className="text-xs text-slate-400 mt-2 font-medium">One link per line</p>
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Skills</span>
                {getConfidenceBadge('skills')}
              </label>
              <textarea
                value={formData.skills?.join(', ') || ''}
                onChange={(e) => handleSkillsChange(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none font-medium transition-colors resize-none"
                placeholder="React, TypeScript, Node.js, Python"
              />
              <p className="text-xs text-slate-400 mt-2 font-medium">Comma-separated list</p>
            </div>

            {/* Overall Confidence */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Overall Confidence</p>
                    <p className="text-xs text-slate-500 font-medium">Based on extraction quality</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-primary-600">
                    {Math.round((parsedData.confidence?.overall || 0) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50">
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-black text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 rounded-2xl font-black bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Confirm & Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
