import { useState, useEffect, useRef } from 'react';

interface LogEntry {
  id: number;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

let logId = 0;
const listeners: Set<(entry: LogEntry) => void> = new Set();

export function addLog(message: string, type: LogEntry['type'] = 'info') {
  const entry = { id: logId++, timestamp: new Date(), message, type };
  listeners.forEach(listener => listener(entry));
}

export default function DiagnosticConsole() {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (entry: LogEntry) => {
      setLogs(prev => {
        const newLogs = [...prev, entry];
        if (newLogs.length > 100) {
          return newLogs.slice(-100);
        }
        return newLogs;
      });
    };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: '#333',
          color: '#fff',
          border: '1px solid #555',
          borderRadius: '4px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 9999,
        }}
      >
        📋 Console
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      width: '400px',
      maxHeight: '250px',
      background: '#1a1a1a',
      border: '1px solid #444',
      borderRadius: '8px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      fontSize: '11px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: '#2a2a2a',
        borderBottom: '1px solid #444',
        borderRadius: '8px 8px 0 0',
      }}>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>🔧 Diagnostic Console</span>
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          −
        </button>
      </div>
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px',
        background: '#0d0d0d',
      }}>
        {logs.length === 0 && (
          <div style={{ color: '#666', padding: '4px' }}>Waiting for activity...</div>
        )}
        {logs.map(log => (
          <div key={log.id} style={{
            padding: '3px 0',
            color: log.type === 'error' ? '#ff6b6b' : 
                   log.type === 'success' ? '#51cf66' : 
                   log.type === 'warning' ? '#ffd43b' : '#adb5bd',
          }}>
            <span style={{ color: '#666' }}>
              [{log.timestamp.toLocaleTimeString()}]
            </span>{' '}
            {log.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}