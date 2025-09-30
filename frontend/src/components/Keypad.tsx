import React from 'react';
import type { KeypadProps } from '../types';

const Keypad: React.FC<KeypadProps> = ({ value, onChange }) => {
  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key === '.') {
      if (!value.includes('.')) {
        onChange(value + key);
      }
    } else {
      onChange(value + key);
    }
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '⌫']
  ];

  return (
    <div className="keypad">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {row.map((key, keyIndex) => (
            <button
              key={keyIndex}
              onClick={() => handleKeyPress(key)}
              style={{
                flex: 1,
                height: 60,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: '#e8e8f0',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keypad;
