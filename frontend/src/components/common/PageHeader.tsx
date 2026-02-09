import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className }) => {
    return (
        <div className={`text-center space-y-4 mb-16 ${className}`}>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
                {title}
            </h1>
            {subtitle && (
                <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
            <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full" />
        </div>
    );
};

export default PageHeader;
