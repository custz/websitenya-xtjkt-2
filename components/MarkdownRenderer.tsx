
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple regex-based markdown-like formatter
  const formatText = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-blue-400">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-5 mb-2 text-blue-300">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3 text-blue-200">{line.replace('# ', '')}</h1>;
        
        // Lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <li key={i} className="ml-6 list-disc mb-1">{line.substring(2)}</li>;
        }

        // Code blocks (simple check)
        if (line.startsWith('```')) return null; // Simplified, we ignore markers

        // Bold & Italic
        let processedLine: any = line;
        processedLine = processedLine.split('**').map((part: string, index: number) => 
          index % 2 === 1 ? <strong key={index} className="text-blue-300">{part}</strong> : part
        );

        return <p key={i} className="mb-2 leading-relaxed">{processedLine}</p>;
      });
  };

  return <div className="markdown-body">{formatText(content)}</div>;
};

export default MarkdownRenderer;
