import React, { useState, useCallback } from 'react';
import { Button } from './common/Button';
import { Chip } from './common/Chip';
import { TagInput } from './common/TagInput';
import type { FormState, ToneOption } from '../types';
import { toneOptions } from '../types';

interface FormPanelProps {
  onSubmit: (formData: FormState) => void;
}

export const FormPanel: React.FC<FormPanelProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState<FormState>({
    topicSubject: '',
    tones: ['Professional'],
    audience: [],
    keyPoints: '',
    length: 500,
    seoKeywords: [],
  });

  const handleToneToggle = (tone: ToneOption) => {
    setFormState(prev => ({
      ...prev,
      tones: prev.tones.includes(tone)
        ? prev.tones.filter(t => t !== tone)
        : [...prev.tones, tone],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'length' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('FormPanel: handleSubmit triggered');
    if (!formState.topicSubject || !formState.keyPoints) {
      console.warn('FormPanel: Validation failed - missing required fields');
      alert('Please fill in the Topic and Key Points fields.');
      return;
    }
    console.log('FormPanel: Calling onSubmit with', formState);
    onSubmit(formState);
  }, [onSubmit, formState]);


  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-5 mx-auto">
        <div>
          <label htmlFor="topicSubject" className="block text-sm font-medium text-slate-300 mb-1">Topic / Subject</label>
          <input type="text" name="topicSubject" id="topicSubject" value={formState.topicSubject} onChange={handleChange} className="w-full bg-[#0A101A]/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" placeholder="e.g., The Future of AI" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Tone</label>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map(tone => (
              <Chip key={tone} label={tone} selected={formState.tones.includes(tone)} onClick={() => handleToneToggle(tone)} />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-slate-300 mb-1">Audience</label>
          <TagInput tags={formState.audience} setTags={(tags) => setFormState(p => ({ ...p, audience: tags }))} placeholder="e.g., Tech Enthusiasts" />
        </div>

        <div>
          <label htmlFor="keyPoints" className="block text-sm font-medium text-slate-300 mb-1">Key Points / Examples</label>
          <textarea name="keyPoints" id="keyPoints" rows={3} value={formState.keyPoints} onChange={handleChange} className="w-full bg-[#0A101A]/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" placeholder="Enter main ideas, benefits, or existing copy to improve..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-slate-300 mb-1">Length (approx. words)</label>
            <div className="flex items-center space-x-4">
              <input type="range" name="length" id="length" min="50" max="2000" step="50" value={formState.length} onChange={handleChange} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              <span className="font-semibold text-orange-400 w-16 text-center">{formState.length}</span>
            </div>
          </div>
          <div>
            <label htmlFor="seoKeywords" className="block text-sm font-medium text-slate-300 mb-1">Optional SEO Keywords</label>
            <TagInput tags={formState.seoKeywords} setTags={(tags) => setFormState(p => ({ ...p, seoKeywords: tags }))} placeholder="e.g., AI Writing Tool" />
          </div>
        </div>

        <div className="text-center pt-2">
          <Button type="submit">
            Generate
          </Button>
        </div>
      </form>
    </div>
  );
};