'use client';

import React, { useEffect, useRef, useState } from 'react';
import nipplejs, { JoystickManager } from 'nipplejs';

interface JoystickPanelProps {
  onJoystickMove?: (left: { x: number; y: number }, right: { x: number; y: number }) => void;
}

export const JoystickPanel: React.FC<JoystickPanelProps> = ({ onJoystickMove }) => {
  const [visible, setVisible] = useState(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftJoystick = useRef<JoystickManager | null>(null);
  const rightJoystick = useRef<JoystickManager | null>(null);
  const leftPos = useRef({ x: 0, y: 0 });
  const rightPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (visible) {
      if (leftRef.current) {
        leftJoystick.current = nipplejs.create({
          zone: leftRef.current,
          mode: 'static',
          position: { left: '20%', bottom: '10%' },
          color: 'white',
        });
        leftJoystick.current.on('move', (evt, data) => {
          if (data && data.vector) {
            leftPos.current = { x: data.vector.x, y: data.vector.y };
          }
        });
        leftJoystick.current.on('end', () => {
          leftPos.current = { x: 0, y: 0 };
        });
      }

      if (rightRef.current) {
        rightJoystick.current = nipplejs.create({
          zone: rightRef.current,
          mode: 'static',
          position: { right: '20%', bottom: '10%' },
          color: 'white',
        });
        rightJoystick.current.on('move', (evt, data) => {
          if (data && data.vector) {
            rightPos.current = { x: data.vector.x, y: data.vector.y };
          }
        });
        rightJoystick.current.on('end', () => {
          rightPos.current = { x: 0, y: 0 };
        });
      }
    }

    return () => {
      leftJoystick.current?.destroy();
      rightJoystick.current?.destroy();
    };
  }, [visible]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (onJoystickMove && visible) {
        onJoystickMove(leftPos.current, rightPos.current);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onJoystickMove, visible]);

  // CSS inline style
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1001,
  };

  return (
    <div>
      <button className="lk-button lk-focus-toggle-button" style={buttonStyle} onClick={() => setVisible(!visible)}>
        {visible ? '❌' : '🕹️'}
      </button>

      {visible && (
        <div style={overlayStyle}>
          <div ref={leftRef}></div>
          <div ref={rightRef}></div>
        </div>
      )}
    </div>
  );
};
