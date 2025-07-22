import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  children: string;
  components?: object;
}

const Markdown: React.FC<MarkdownProps> = ({ children, components }) => {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

export default Markdown;
