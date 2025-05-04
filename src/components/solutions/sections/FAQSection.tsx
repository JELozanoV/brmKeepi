import React from 'react';
import './FAQSection.scss';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

const FAQSection: React.FC<Props> = ({ faqs }) => {
  return (
    <div className="faq-section">
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <h4 className="faq-question">{faq.question}</h4>
          <p className="faq-answer">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQSection; 