import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegionSelector() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleRegionSelect = (region: 'us' | 'haiti') => {
    localStorage.setItem('selected_region', region);
    if (region === 'us') {
      i18n.changeLanguage('en');
    } else {
      i18n.changeLanguage('ht');
    }
    navigate({ to: '/home' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center space-y-8 relative z-10"
      >
        <div className="space-y-4">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl mb-8 border border-border overflow-hidden">
            <img 
              src="/images/mhanac logo1.png" 
              alt="MHANAC" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=MHANAC&background=004B91&color=fff";
              }}
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary">
            MHANAC
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-lg mx-auto italic">
            Connecting the Diaspora. Empowering Local Commerce.
          </p>
        </div>

        <div className="py-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-30 mb-8">Choose your region to start</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* USA Option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRegionSelect('us')}
              className="group relative flex flex-col items-center p-8 bg-card border-2 border-border hover:border-primary rounded-2xl shadow-lg transition-all"
            >
              <div className="w-40 h-28 mb-6 overflow-hidden rounded-lg shadow-md">
                <img 
                  src="https://flagcdn.com/us.svg" 
                  alt="USA Flag" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('usa')}</h2>
              <p className="text-muted-foreground mb-4">Default Language: English</p>
              <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Continue</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </motion.button>

            {/* Haiti Option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRegionSelect('haiti')}
              className="group relative flex flex-col items-center p-8 bg-card border-2 border-border hover:border-primary rounded-2xl shadow-lg transition-all"
            >
              <div className="w-40 h-28 mb-6 overflow-hidden rounded-lg shadow-md">
                <img 
                  src="https://flagcdn.com/ht.svg" 
                  alt="Haiti Flag" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('haiti')}</h2>
              <p className="text-muted-foreground mb-4">Default Language: Haitian Creole</p>
              <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Kontinye</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}