'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Zap, MessageCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  response: string;
}

interface ContactFaqSectionProps {
  faqItems: FaqItem[];
  title?: string;
  subtitle?: string;
}

const ContactFaqSection: React.FC<ContactFaqSectionProps> = ({
  faqItems,
  title = "Questions fréquentes",
  subtitle = "Trouvez rapidement des réponses aux questions les plus courantes"
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Formes décoratives */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full opacity-40 translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full opacity-30 -translate-x-32 translate-y-32"></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-orange-200 rounded-full opacity-20"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header moderne */}
        <div className="text-center mb-16">
          {/* Badge FAQ */}
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full border border-orange-200 mb-6">
            <HelpCircle className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-orange-700 tracking-wide">{"Centre d'aide"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            <span className="">Questions </span>
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              fréquentes
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Statistiques */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Réponses instantanées</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
              <MessageCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">{faqItems.length} questions</span>
            </div>
          </div>
        </div>

        {/* FAQ Items modernes */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded-2xl transition-all duration-200"
                aria-expanded={openItems.has(index)}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Numéro de question */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    openItems.has(index) 
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  <span className={`text-lg sm:text-xl font-semibold pr-4 transition-colors duration-200 ${
                    openItems.has(index) 
                      ? 'text-orange-700' 
                      : 'text-gray-900 group-hover:text-orange-600'
                  }`}>
                    {item.question}
                  </span>
                </div>
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  openItems.has(index) 
                    ? 'bg-orange-100 rotate-180' 
                    : 'bg-gray-100 group-hover:bg-orange-50'
                }`}>
                  <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                    openItems.has(index) ? 'text-orange-600' : 'text-gray-600'
                  }`} />
                </div>
              </button>

              {/* Answer Content */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  openItems.has(index) 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="ml-12 pl-4 border-l-2 border-orange-200">
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      {item.response}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section d'aide supplémentaire */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-3xl p-8 border border-orange-200/50">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe support est là pour vous aider personnellement
            </p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg active:scale-95">
              <MessageCircle className="w-5 h-5" />
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFaqSection;