'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MascotProps {
  isEmailFocused: boolean;
  isPasswordFocused: boolean;
  isTyping: boolean;
  emailLength: number;
}

export default function LoginMascot({ isEmailFocused, isPasswordFocused, isTyping, emailLength }: MascotProps) {
  // Eye position based on email typing progress
  const eyeOffsetX = isEmailFocused ? Math.min(emailLength * 0.8, 6) : 0;
  const eyeOffsetY = isEmailFocused ? 2 : 0;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background blobs */}
      <svg width="0" height="0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>
      </svg>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 6 + i * 3,
            height: 6 + i * 3,
            borderRadius: '50%',
            background: ['rgba(139,92,246,0.3)', 'rgba(249,115,22,0.3)', 'rgba(234,179,8,0.3)', 'rgba(59,130,246,0.2)', 'rgba(236,72,153,0.2)', 'rgba(34,197,94,0.2)'][i],
          }}
          animate={{
            x: [0, 15 * Math.sin(i * 60), -10 * Math.cos(i * 45), 0],
            y: [0, -20 * Math.cos(i * 30), 15 * Math.sin(i * 50), 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div style={{ position: 'relative', width: 320, height: 280 }}>
        {/* Purple blob mascot (main - center) */}
        <motion.div
          style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}
          animate={{
            y: isTyping ? [0, -3, 0] : [0, -8, 0],
            rotate: isPasswordFocused ? [0, -2, 2, 0] : 0,
          }}
          transition={{ duration: isTyping ? 0.3 : 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Body */}
            <motion.ellipse
              cx="80" cy="85" rx="60" ry="55"
              fill="url(#purpleGrad)"
              animate={{ ry: isTyping ? [55, 52, 55] : 55 }}
              transition={{ duration: 0.3, repeat: isTyping ? Infinity : 0 }}
            />
            {/* Cheeks */}
            <circle cx="45" cy="95" r="12" fill="rgba(236,72,153,0.2)" />
            <circle cx="115" cy="95" r="12" fill="rgba(236,72,153,0.2)" />
            {/* Eyes */}
            <AnimatePresence mode="wait">
              {isPasswordFocused ? (
                // Covered eyes (password mode)
                <motion.g
                  key="closed"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hands covering eyes */}
                  <motion.ellipse
                    cx="60" cy="78" rx="22" ry="18"
                    fill="url(#purpleGradDark)"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'backOut' }}
                  />
                  <motion.ellipse
                    cx="100" cy="78" rx="22" ry="18"
                    fill="url(#purpleGradDark)"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: 'backOut' }}
                  />
                  {/* Fingers */}
                  {[42, 52, 62, 68].map((x, i) => (
                    <motion.ellipse
                      key={`lf${i}`} cx={x} cy={70} rx="5" ry="8"
                      fill="url(#purpleGradDark)"
                      initial={{ y: -15 }} animate={{ y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                    />
                  ))}
                  {[92, 98, 108, 118].map((x, i) => (
                    <motion.ellipse
                      key={`rf${i}`} cx={x} cy={70} rx="5" ry="8"
                      fill="url(#purpleGradDark)"
                      initial={{ y: -15 }} animate={{ y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                    />
                  ))}
                </motion.g>
              ) : (
                // Open eyes
                <motion.g
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Eye whites */}
                  <ellipse cx="60" cy="78" rx="14" ry="16" fill="white" />
                  <ellipse cx="100" cy="78" rx="14" ry="16" fill="white" />
                  {/* Pupils - track email input */}
                  <motion.circle
                    cx={60} cy={78} r="7" fill="#1e1b4b"
                    animate={{ cx: 60 + eyeOffsetX, cy: 78 + eyeOffsetY }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                  <motion.circle
                    cx={100} cy={78} r="7" fill="#1e1b4b"
                    animate={{ cx: 100 + eyeOffsetX, cy: 78 + eyeOffsetY }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                  {/* Eye shine */}
                  <motion.circle
                    cx={56} cy={74} r="3" fill="white" opacity={0.8}
                    animate={{ cx: 56 + eyeOffsetX * 0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                  <motion.circle
                    cx={96} cy={74} r="3" fill="white" opacity={0.8}
                    animate={{ cx: 96 + eyeOffsetX * 0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                </motion.g>
              )}
            </AnimatePresence>
            {/* Mouth */}
            <motion.path
              d={isEmailFocused
                ? "M 68 100 Q 80 112 92 100"  // smile
                : isPasswordFocused
                  ? "M 72 102 Q 80 98 88 102"  // worried
                  : "M 70 100 Q 80 108 90 100"  // neutral smile
              }
              fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* Eyebrows */}
            <motion.line
              x1="48" y1="62" x2="72" y2="62"
              stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"
              animate={{
                y1: isPasswordFocused ? 58 : isEmailFocused ? 60 : 62,
                y2: isPasswordFocused ? 66 : isEmailFocused ? 60 : 62,
              }}
            />
            <motion.line
              x1="88" y1="62" x2="112" y2="62"
              stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"
              animate={{
                y1: isPasswordFocused ? 66 : isEmailFocused ? 60 : 62,
                y2: isPasswordFocused ? 58 : isEmailFocused ? 60 : 62,
              }}
            />
            {/* Gradients */}
            <defs>
              <radialGradient id="purpleGrad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </radialGradient>
              <radialGradient id="purpleGradDark" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Orange blob (left) */}
        <motion.div
          style={{ position: 'absolute', left: 10, top: '55%' }}
          animate={{
            y: [0, -10, 0],
            rotate: isPasswordFocused ? 15 : [0, 5, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            <ellipse cx="40" cy="42" rx="30" ry="28" fill="url(#orangeGrad)" />
            {isPasswordFocused ? (
              <>
                <line x1="28" y1="36" x2="38" y2="36" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="42" y1="36" x2="52" y2="36" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="32" cy="35" r="5" fill="white" />
                <circle cx="48" cy="35" r="5" fill="white" />
                <motion.circle cx={32} cy={35} r="3" fill="#7c2d12" animate={{ cx: 32 + eyeOffsetX * 0.5 }} />
                <motion.circle cx={48} cy={35} r="3" fill="#7c2d12" animate={{ cx: 48 + eyeOffsetX * 0.5 }} />
              </>
            )}
            <path d="M 35 46 Q 40 50 45 46" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <radialGradient id="orangeGrad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#f97316" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Yellow blob (right) */}
        <motion.div
          style={{ position: 'absolute', right: 10, top: '60%' }}
          animate={{
            y: [0, -12, 0],
            rotate: isPasswordFocused ? -10 : [0, -5, 5, 0],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <svg width="70" height="70" viewBox="0 0 70 70">
            <ellipse cx="35" cy="38" rx="26" ry="24" fill="url(#yellowGrad)" />
            {isPasswordFocused ? (
              <>
                <line x1="24" y1="32" x2="32" y2="32" stroke="#713f12" strokeWidth="2" strokeLinecap="round" />
                <line x1="38" y1="32" x2="46" y2="32" stroke="#713f12" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="28" cy="32" r="4" fill="white" />
                <circle cx="42" cy="32" r="4" fill="white" />
                <motion.circle cx={28} cy={32} r="2.5" fill="#713f12" animate={{ cx: 28 + eyeOffsetX * 0.4 }} />
                <motion.circle cx={42} cy={32} r="2.5" fill="#713f12" animate={{ cx: 42 + eyeOffsetX * 0.4 }} />
              </>
            )}
            <circle cx="35" cy="42" r="4" fill="#713f12" opacity={0.3} />
            <defs>
              <radialGradient id="yellowGrad" cx="40%" cy="30%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#eab308" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Speech bubble */}
        <AnimatePresence>
          {(isEmailFocused || isPasswordFocused) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                background: 'white', borderRadius: 16, padding: '8px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: 13, fontWeight: 600, color: '#4c1d95', whiteSpace: 'nowrap',
              }}
            >
              {isPasswordFocused ? '🙈 Saya tidak mengintip!' : '👀 Ketik email Anda...'}
              <div style={{
                position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
                width: 12, height: 12, background: 'white',
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
