import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, X } from 'lucide-react';
import ContactForm from '@/components/about/ContactForm';

const ServicesContactCTA = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  
  const toggleContactForm = () => {
    setShowContactForm(prev => !prev);
  };
  
  return (
    <section className="py-16 md:py-20 relative overflow-hidden bg-white">
      <div className="container relative z-10 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col items-center p-6 md:p-10 w-full max-w-4xl relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <motion.h3 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-3 text-2xl md:text-3xl font-bold text-center max-w-xl"
          >
            Нуждаете се от помощ?
          </motion.h3>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6 text-muted-foreground text-center max-w-2xl"
          >
            Нашият екип от професионалисти е готов да ви помогне с всички въпроси, свързани с недвижимите имоти.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4,
                type: "spring",
                stiffness: 200
              }}
              viewport={{ once: true }}
            >
              <Button 
                onClick={toggleContactForm}
                className="w-full group bg-red-600 hover:bg-red-700 text-white border-0"
              >
                <Phone className="mr-2 h-5 w-5" />
                Свържете се с нас
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="ml-2"
                >
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Contact Form that appears/disappears */}
          <AnimatePresence>
            {showContactForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full mt-6 overflow-hidden"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 relative"
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleContactForm}
                    className="absolute right-2 top-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <h4 className="text-xl font-semibold mb-4">Изпратете запитване</h4>
                  <ContactForm />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesContactCTA;
