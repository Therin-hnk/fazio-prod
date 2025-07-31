'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 text-md sm:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-0">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-200 last:border-b-0"
          >
            {/* Question Button */}
            <button
              onClick={() => toggleItem(index)}
              className="w-full py-8 px-2 text-left flex items-center justify-between focus:outline-none transition-colors duration-200 group"
              aria-expanded={openItems.has(index)}
            >
              <span className="text-base sm:text-xl font-semibold text-gray-900 pr-4 group-hover:text-blue-700 transition-colors duration-200">
                {item.question}
              </span>
              <ChevronDown
                className={`w-6 h-6 text-blue-600 transition-transform duration-300 flex-shrink-0 ${
                  openItems.has(index) ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {/* Answer Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItems.has(index) 
                  ? 'max-h-96 pb-8' 
                  : 'max-h-0 pb-0'
              }`}
            >
              <div className="px-2 pr-12">
                <p className="text-gray-700 leading-relaxed text-xs sm:text-lg">
                  {item.response}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactFaqSection;