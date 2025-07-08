
import React, { useState } from 'react';
import { AppTranslations } from '../../types';
import { sourceFiles } from '../../services/sourceData';
import { CopyIcon, CheckIcon, XIcon } from './Icons';

type SourceCodeModalProps = {
  onClose: () => void;
  t: AppTranslations;
};

const FileContentDisplay = ({ content, t }: { content: string, t: AppTranslations }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="relative">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded-full text-brand-slate bg-brand-dark-accent hover:text-brand-light hover:bg-brand-light-accent/20 transition-colors z-10"
                aria-label={t.copyCode}
            >
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
            </button>
            <pre className="bg-brand-dark p-4 rounded-md overflow-auto max-h-[60vh] shadow-neumorphic-inner">
                <code className="text-sm text-brand-light whitespace-pre-wrap font-mono">
                    {content}
                </code>
            </pre>
        </div>
    );
};

export function SourceCodeModal({ onClose, t }: SourceCodeModalProps): React.ReactNode {
    const fileNames = Object.keys(sourceFiles).sort();
    const [activeFile, setActiveFile] = useState<string>(fileNames[0] || '');

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-brand-dark/80 border border-brand-light-accent p-6 rounded-2xl shadow-neumorphic-outer w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-brand-light">{t.sourceCodeModalTitle}</h2>
                        <p className="text-brand-slate mt-1 text-sm">{t.sourceCodeDescription}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-brand-slate hover:text-brand-light hover:bg-brand-light-accent/20">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
                    <div className="md:w-1/4 lg:w-1/5 flex-shrink-0 bg-brand-dark/50 p-2 rounded-lg shadow-neumorphic-inner overflow-y-auto">
                        <nav className="flex flex-col gap-1">
                            {fileNames.map(name => (
                                <button
                                    key={name}
                                    onClick={() => setActiveFile(name)}
                                    className={`w-full text-left text-sm p-2 rounded-md transition-colors truncate ${activeFile === name ? 'bg-brand-accent/20 text-brand-accent font-bold' : 'text-brand-slate hover:bg-brand-light-accent/10 hover:text-brand-light'}`}
                                >
                                    {name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-grow md:w-3/4 lg:w-4/5 overflow-y-auto">
                        {activeFile && sourceFiles[activeFile] && (
                            <FileContentDisplay content={sourceFiles[activeFile]} t={t} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
