import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { blink } from '@/lib/blink';
import { toast } from 'react-hot-toast';

interface AddressFormProps {
  userId: string;
  region: string;
  onComplete: (address: any) => void;
}

export default function AddressForm({ userId, region, onComplete }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const addressData = {
        id: crypto.randomUUID(),
        user_id: userId,
        region,
        ...formData,
        country: region === 'us' ? 'USA' : 'Haiti',
        is_default: 1
      };
      // For demo, we just pass it back
      onComplete(addressData);
      toast.success('Address saved');
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Shipping Address ({region.toUpperCase()})</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase opacity-50">Full Name</label>
          <Input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase opacity-50">Phone Number</label>
          <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234..." />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase opacity-50">Street Address</label>
        <Input required value={formData.streetAddress} onChange={e => setFormData({...formData, streetAddress: e.target.value})} placeholder="123 Main St" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase opacity-50">City</label>
          <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase opacity-50">{region === 'us' ? 'State' : 'Province'}</label>
          <Input required value={formData.stateProvince} onChange={e => setFormData({...formData, stateProvince: e.target.value})} placeholder={region === 'us' ? 'NY' : 'Ouest'} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase opacity-50">Postal Code</label>
          <Input required value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} placeholder="12345" />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 mt-4" disabled={loading}>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Shipping Address'}
      </Button>
    </form>
  );
}
