import { useState, useEffect } from 'react'
import { X, Copy, Check, Download, ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink, ThumbsUp, ThumbsDown, MessageSquareWarning, Share2 } from 'lucide-react'

type PreviewModalProps = {
  isOpen: boolean
  job: any
  onClose: () => void
}

// Renders the modal with details and copyable code sections of the cheatsheet.
export function PreviewModal({ isOpen, job, onClose }: PreviewModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({})
  const [feedbackStatus, setFeedbackStatus] = useState<'up' | 'down' | null>(null)
  const [isReporting, setIsReporting] = useState(false)
  const [reportText, setReportText] = useState('')
  const [reportStatus, setReportStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [isShared, setIsShared] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setExpandedSources({})
    }
  }, [isOpen, job])

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && (window as any).renderMathInElement) {
      setTimeout(() => {
        (window as any).renderMathInElement(document.body, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ]
        })
      }, 100)
    }
  }, [isOpen, job])

  if (!isOpen || !job || !job.cheatsheetJSON) return null

  const data = job.cheatsheetJSON

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  const handleDownload = () => {
    if (job.downloadUrl) {
      fetch(`/api/jobs/${job.jobId || job._id}/analytics`, { method: 'POST' }).catch(() => {});
      window.open(job.downloadUrl, '_blank')
    }
  }

  const handleVote = async (type: 'up' | 'down') => {
    if (feedbackStatus) return;
    setFeedbackStatus(type);
    try {
      await fetch(`/api/jobs/${job.jobId || job._id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: type })
      });
    } catch (e) { console.error(e) }
  };

  const handleReportSubmit = async () => {
    if (!reportText.trim()) return;
    setReportStatus('submitting');
    try {
      await fetch(`/api/jobs/${job.jobId || job._id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportText })
      });
      setReportStatus('success');
      setTimeout(() => {
        setIsReporting(false);
        setReportStatus('idle');
        setReportText('');
      }, 1500);
    } catch (e) { 
      console.error(e);
      setReportStatus('idle');
    }
  };

  const handleShare = async () => {
    if (!job.downloadUrl) return;
    try {
      await fetch(`/api/jobs/${job.jobId || job._id}/share`, { method: 'POST' });
      await navigator.clipboard.writeText(job.downloadUrl);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (e) { console.error(e) }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-border bg-card shadow-xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {data.title || `${job.topic} Cheatsheet`}
            </h2>
            <div className="mt-1 flex items-center gap-3">
              <p className="text-xs text-muted-foreground">
                Subject: {job.subject} | Level:{' '}
                <span className="capitalize">{job.level}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            {data.sections &&
              data.sections.map((section: any, idx: number) => {
                const isMathOrLatex = section.language === 'latex' || section.language === 'math' || (section.code && section.code.includes('$$'));
                const isMarkdown = section.language?.toLowerCase() === 'markdown' || 
                  (section.code && (
                    section.code.includes('|') || 
                    section.code.includes('**') || 
                    /^\s*[\*\-\+]\s+/m.test(section.code) ||
                    /^\s*#{1,6}\s+/m.test(section.code)
                  ));
                const outputLabel = getOutputLabel(section);
                return (
                  <div
                    key={idx}
                    className="space-y-3 py-4 border-b border-border/40 last:border-0"
                  >
                    <div className="flex items-center justify-between text-base font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{section.name}</span>
                      </div>
                      {section.language && !['markdown', 'text', 'none'].includes(section.language.toLowerCase()) && (
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] uppercase text-muted-foreground font-medium">
                          {section.language}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span dangerouslySetInnerHTML={{ __html: renderMarkdown(section.description) }} />
                    </p>
                    
                    {section.code && (
                      isMarkdown ? (
                        <div 
                          className="my-2 text-sm text-foreground leading-relaxed markdown-content"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(section.code) }}
                        />
                      ) : isMathOrLatex ? (
                        <div className="my-2 py-2 text-center text-sm font-medium text-foreground overflow-x-auto">
                          {section.code}
                        </div>
                      ) : (
                        <div className="relative group">
                          <pre className="rounded-xl bg-muted/60 p-4 border border-border/40 font-mono text-xs overflow-x-auto text-foreground pr-20 whitespace-pre-wrap break-all">
                            <code>{section.code}</code>
                          </pre>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(section.code, idx)}
                            className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold bg-background hover:bg-secondary border border-border px-2 py-1 rounded-md text-muted-foreground transition-colors shadow-sm"
                          >
                            {copiedIndex === idx ? (
                              <Check className="size-3 text-emerald-600" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                            <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )
                    )}

                    {section.codeOutput && (
                      isMathOrLatex ? (
                        <div className="mt-2 flex items-center gap-2 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 p-3 rounded-r-xl text-xs font-semibold">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-500/80 uppercase font-bold">{outputLabel}:</span>
                          <span>{section.codeOutput}</span>
                        </div>
                      ) : (
                        <div className="mt-2 rounded-xl bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 p-4 font-mono text-xs overflow-x-auto">
                          <span className="block text-[10px] text-emerald-600 dark:text-emerald-500/80 uppercase font-semibold mb-1">{outputLabel}:</span>
                          <code>{section.codeOutput}</code>
                        </div>
                      )
                    )}

                    {section.gotchas && section.gotchas.map((gotcha: string, gIdx: number) => (
                      <div
                        key={gIdx}
                        className="mt-2 flex items-start gap-2 bg-slate-500/5 text-slate-600 dark:text-slate-400 border-l-4 border-slate-400 p-3 rounded-r-xl text-xs font-semibold w-full"
                      >
                        <span dangerouslySetInnerHTML={{ __html: 'Note: ' + renderMarkdown(gotcha) }} className="w-full" />
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        </div>



        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border p-6 bg-card">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
            >
              {isShared ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4" />}
              <span className="hidden sm:inline">{isShared ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => setIsReporting(true)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <MessageSquareWarning className="size-4" />
              <span className="hidden sm:inline">Report Error</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-secondary/50 rounded-xl p-1 border border-border/50">
              <button
                onClick={() => handleVote('up')}
                disabled={feedbackStatus !== null}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${feedbackStatus === 'up' ? 'bg-emerald-500/20 text-emerald-600' : 'hover:bg-background hover:shadow-sm text-muted-foreground disabled:opacity-50'}`}
              >
                <ThumbsUp className="size-4" />
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={feedbackStatus !== null}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${feedbackStatus === 'down' ? 'bg-rose-500/20 text-rose-600' : 'hover:bg-background hover:shadow-sm text-muted-foreground disabled:opacity-50'}`}
              >
                <ThumbsDown className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors hidden sm:block"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-xl bg-primary text-primary-foreground px-3 sm:px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">Download</span>
            </button>
          </div>
        </div>

        {isReporting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/95 backdrop-blur-sm p-6 animate-in fade-in zoom-in duration-200">
            <div className="w-full max-w-md space-y-4 bg-card p-6 rounded-2xl border border-border shadow-2xl">
              {reportStatus === 'success' ? (
                <div className="text-center space-y-3 py-8 animate-in fade-in slide-in-from-bottom-2">
                  <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                    <Check className="size-6 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Thank you! Report submitted.</h3>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Report an Error</h3>
                    <p className="text-sm text-muted-foreground mt-1">Please let us know what's wrong with this cheatsheet so we can fix the AI.</p>
                  </div>
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="e.g., The section on Newton's third law is inaccurate..."
                    className="w-full h-32 rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setIsReporting(false)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReportSubmit}
                      disabled={!reportText.trim() || reportStatus === 'submitting'}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {reportStatus === 'submitting' ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
function SectionVerificationBadge({ verification }: { verification: any }) {
  const { status, confidence } = verification;
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
        <ShieldCheck className="size-2.5" />
        Verified ({confidence}%)
      </span>
    );
  }
  if (status === 'syntax_verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase">
        <ShieldCheck className="size-2.5" />
        Syntax Verified
      </span>
    );
  }
  if (status === 'partially_verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase">
        <ShieldAlert className="size-2.5" />
        Partially Verified ({confidence}%)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">
      <ShieldQuestion className="size-2.5" />
      AI Knowledge Only
    </span>
  );
}
function VerificationBadge({ status }: { status?: string }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
        <ShieldCheck className="size-3" />
        Verified
      </span>
    );
  }
  if (status === 'syntax_verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">
        <ShieldCheck className="size-3" />
        Syntax Verified
      </span>
    );
  }
  if (status === 'partially_verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
        <ShieldAlert className="size-3" />
        Partially Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
      <ShieldQuestion className="size-3" />
      AI Knowledge Only
    </span>
  );
}

// Helper to get output label based on section language.
function getOutputLabel(section: any): string {
  const lang = section.language?.toLowerCase() || '';
  if (lang === 'latex' || lang === 'math' || (section.code && section.code.includes('$$'))) {
    return 'Result';
  }
  if (['markdown', 'text', ''].includes(lang)) {
    return 'Key Takeaway';
  }
  return 'Expected Output';
}

// Helper to reconstruct collapsed single-line markdown tables into multi-line tables.
function fixSingleLineTables(text: string): string {
  if (!text) return '';
  return text.split('\n').map(line => {
    if (line.includes('|') && /\|[:\- ]+\|/.test(line)) {
      const parts = line.split('|').map(p => p.trim());
      const separatorIdx = parts.findIndex(p => /^[:\- ]+$/.test(p) && p.length > 0);
      if (separatorIdx !== -1) {
        let colCount = 0;
        let idx = separatorIdx;
        while (idx < parts.length && /^[:\- ]+$/.test(parts[idx]) && parts[idx].length > 0) {
          colCount++;
          idx++;
        }
        if (colCount > 0) {
          const headerCells = parts.slice(1, separatorIdx).filter(c => c !== '');
          const separatorCells = parts.slice(separatorIdx, separatorIdx + colCount);
          const dataCells = parts.slice(separatorIdx + colCount).filter(c => c !== '');
          const rows: string[][] = [];
          if (headerCells.length > 0) {
            rows.push(headerCells);
          }
          rows.push(separatorCells);
          for (let i = 0; i < dataCells.length; i += colCount) {
            const row = dataCells.slice(i, i + colCount);
            if (row.length > 0) {
              rows.push(row);
            }
          }
          let tableMarkdown = rows.map(r => '| ' + r.join(' | ') + ' |').join('\n');
          if (parts[0].trim() !== '') {
            tableMarkdown = parts[0].trim() + '\n\n' + tableMarkdown;
          }
          return tableMarkdown;
        }
      }
    }
    return line;
  }).join('\n');
}

// Preprocesses markdown text to ensure tables have outer pipes for parser matching.
function preprocessTables(text: string): string {
  if (!text) return '';
  const lines = text.split('\n');
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasPipe = line.includes('|');
    const isSeparator = /^[ \t]*[\-\+ \t]+$/.test(line) && line.includes('+');
    
    if (hasPipe || isSeparator) {
      let cleanLine = line.trim();
      if (isSeparator) {
        const parts = cleanLine.split('+');
        cleanLine = '| ' + parts.map(() => '---').join(' | ') + ' |';
      } else {
        if (!cleanLine.startsWith('|')) {
          cleanLine = '| ' + cleanLine;
        }
        if (!cleanLine.endsWith('|')) {
          cleanLine = cleanLine + ' |';
        }
      }
      result.push(cleanLine);
    } else {
      result.push(line);
    }
  }
  return result.join('\n');
}

// Renders markdown content into formatted HTML including tables, lists, bold text, and code.
function renderMarkdown(text: string): string {
  if (!text) return '';
  const preprocessed = preprocessTables(text);
  const fixedText = fixSingleLineTables(preprocessed);
  let escaped = fixedText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const lines = escaped.split('\n');
  const resultLines: string[] = [];
  let inList = false;
  let inTable = false;
  let tableRows: string[][] = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.includes('$$')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && (trimmed.match(/\$\$/g) || []).length === 2) {
        // Standalone block math, keep as $$
      } else {
        line = line.replace(/\$\$/g, '$');
      }
    }
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (inList) {
        resultLines.push('</ul>');
        inList = false;
      }
      const level = headingMatch[1].length;
      const fontSize = level === 1 ? 'text-base font-bold mt-3 mb-1.5' : level === 2 ? 'text-sm font-bold mt-2.5 mb-1' : 'text-xs font-semibold mt-2 mb-1';
      resultLines.push(`<h${level} class="${fontSize} text-foreground">${headingMatch[2]}</h${level}>`);
      continue;
    }
    if (line.startsWith('|') && line.endsWith('|')) {
      if (inList) {
        resultLines.push('</ul>');
        inList = false;
      }
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const isSeparator = cells.every(c => c.startsWith(':') || c.endsWith(':') || c.startsWith('-'));
      if (isSeparator) {
        inTable = true;
        continue;
      }
      tableRows.push(cells);
      continue;
    } else {
      if (tableRows.length > 0) {
        let tableHtml = '<table class="w-full border-collapse border border-border my-2 text-[11px]">';
        tableRows.forEach((row, rowIdx) => {
          tableHtml += '<tr>';
          row.forEach(cell => {
            const tag = (rowIdx === 0 && inTable) ? 'th' : 'td';
            const padding = 'px-3 py-1.5';
            const border = 'border border-border/40';
            const bg = (rowIdx === 0 && inTable) ? 'bg-secondary font-bold' : '';
            tableHtml += `<${tag} class="${padding} ${border} ${bg} text-left">${cell}</${tag}>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</table>';
        resultLines.push(tableHtml);
        tableRows = [];
        inTable = false;
      }
    }
    const listMatch = line.match(/^[\*\-\+]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        resultLines.push('<ul class="list-disc pl-5 my-1 space-y-0.5">');
        inList = true;
      }
      resultLines.push(`<li>${listMatch[1]}</li>`);
      continue;
    } else {
      if (inList) {
        resultLines.push('</ul>');
        inList = false;
      }
    }
    if (line !== '') {
      resultLines.push(`<p class="mb-1">${line}</p>`);
    }
  }
  if (tableRows.length > 0) {
    let tableHtml = '<table class="w-full border-collapse border border-border my-2 text-[11px]">';
    tableRows.forEach((row, rowIdx) => {
      tableHtml += '<tr>';
      row.forEach(cell => {
        const tag = (rowIdx === 0 && inTable) ? 'th' : 'td';
        const padding = 'px-3 py-1.5';
        const border = 'border border-border/40';
        const bg = (rowIdx === 0 && inTable) ? 'bg-secondary font-bold' : '';
        tableHtml += `<${tag} class="${padding} ${border} ${bg} text-left">${cell}</${tag}>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</table>';
    resultLines.push(tableHtml);
  }
  if (inList) {
    resultLines.push('</ul>');
  }
  let finalHtml = resultLines.join('\n');
  finalHtml = finalHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  finalHtml = finalHtml.replace(/\*([^\*\n|]+?)\*/g, '<em>$1</em>');
  finalHtml = finalHtml.replace(/`(.*?)`/g, '<code class="font-mono bg-secondary px-1 py-0.5 rounded text-[90%]">$1</code>');
  return finalHtml;
}
