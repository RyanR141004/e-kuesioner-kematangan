'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MascotProps {
  isEmailFocused: boolean;
  isPasswordFocused: boolean;
  isTyping: boolean;
  emailLength: number;
  mouseX: number; // -1 to 1 (left to right)
  mouseY: number; // -1 to 1 (top to bottom)
}

export default function LoginMascot({
  isEmailFocused, isPasswordFocused, isTyping, emailLength, mouseX, mouseY
}: MascotProps) {
  // Eye tracking: follow mouse when idle, follow input when focused
  const eyeX = isEmailFocused
    ? Math.min(emailLength * 0.8, 6)
    : isPasswordFocused
      ? 0
      : mouseX * 8;
  const eyeY = isEmailFocused
    ? 3
    : isPasswordFocused
      ? 0
      : mouseY * 5;

  // Peeking state — character gets curious before covering eyes
  const peekPhase = isPasswordFocused;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Floating particles that follow mouse */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 4 + i * 2,
            height: 4 + i * 2,
            borderRadius: '50%',
            background: [
              'rgba(139,92,246,0.4)', 'rgba(249,115,22,0.4)', 'rgba(234,179,8,0.35)',
              'rgba(59,130,246,0.3)', 'rgba(236,72,153,0.25)', 'rgba(34,197,94,0.25)',
              'rgba(168,85,247,0.2)', 'rgba(251,146,60,0.2)',
            ][i],
          }}
          animate={{
            x: mouseX * (10 + i * 5) + Math.sin(Date.now() / 1000 + i) * 10,
            y: mouseY * (8 + i * 4) + Math.cos(Date.now() / 1000 + i) * 10,
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            x: { type: 'spring', stiffness: 50, damping: 15 },
            y: { type: 'spring', stiffness: 50, damping: 15 },
            scale: { duration: 3 + i * 0.5, repeat: Infinity },
            opacity: { duration: 3 + i * 0.5, repeat: Infinity },
          }}
        />
      ))}

      <div style={{ position: 'relative', width: 320, height: 300 }}>

        {/* ===== PURPLE BLOB (MAIN CHARACTER) ===== */}
        <motion.div
          style={{ position: 'absolute', left: '50%', top: '42%', x: '-50%', y: '-50%', originX: 0.5, originY: 1 }}
          animate={{
            y: peekPhase
              ? ['-50%', '-35%', '-50%'] // bounce down then peek up
              : isTyping
                ? ['-50%', '-53%', '-50%']
                : ['-50%', '-58%', '-50%'],
            scale: peekPhase ? [1, 1.08, 1.05] : 1,
            rotate: peekPhase ? [0, 3, -3, 0] : mouseX * 3,
          }}
          transition={{
            y: { duration: peekPhase ? 0.6 : isTyping ? 0.3 : 3, repeat: peekPhase ? 0 : Infinity, ease: 'easeInOut' },
            scale: { duration: 0.5 },
            rotate: { type: 'spring', stiffness: 100, damping: 15 },
          }}
        >
          <svg width="160" height="170" viewBox="0 0 160 170">
            {/* Shadow */}
            <ellipse cx="80" cy="155" rx="45" ry="8" fill="rgba(0,0,0,0.15)" />
            {/* Body */}
            <motion.ellipse
              cx="80" cy="85" rx="60" ry="55"
              fill="url(#purpleGrad)"
              animate={{
                ry: isTyping ? [55, 52, 55] : peekPhase ? [55, 58, 56] : 55,
              }}
              transition={{ duration: 0.3, repeat: isTyping ? Infinity : 0 }}
            />
            {/* Body highlight */}
            <ellipse cx="65" cy="65" rx="30" ry="25" fill="rgba(255,255,255,0.08)" />
            {/* Cheeks (blush more when peeking) */}
            <motion.circle
              cx="45" cy="95" r="12"
              fill="rgba(236,72,153,0.2)"
              animate={{ r: peekPhase ? 14 : 12, fill: peekPhase ? 'rgba(236,72,153,0.35)' : 'rgba(236,72,153,0.2)' }}
            />
            <motion.circle
              cx="115" cy="95" r="12"
              fill="rgba(236,72,153,0.2)"
              animate={{ r: peekPhase ? 14 : 12, fill: peekPhase ? 'rgba(236,72,153,0.35)' : 'rgba(236,72,153,0.2)' }}
            />

            {/* EYES */}
            <AnimatePresence mode="wait">
              {isPasswordFocused ? (
                <motion.g
                  key="peeking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Squinting peek eyes first, then hands cover */}
                  <motion.g
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 1, 0] }}
                    transition={{ duration: 0.8, times: [0, 0.4, 0.6] }}
                  >
                    {/* Squint/peek eyes — narrow slits looking sideways */}
                    <motion.ellipse cx="60" cy="80" rx="12" ry="4" fill="white"
                      initial={{ ry: 14 }} animate={{ ry: 4 }} transition={{ duration: 0.3 }}
                    />
                    <motion.ellipse cx="100" cy="80" rx="12" ry="4" fill="white"
                      initial={{ ry: 14 }} animate={{ ry: 4 }} transition={{ duration: 0.3 }}
                    />
                    <motion.circle cx="63" cy="80" r="3" fill="#1e1b4b" />
                    <motion.circle cx="103" cy="80" r="3" fill="#1e1b4b" />
                  </motion.g>

                  {/* Hands slide up to cover eyes */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.ellipse
                      cx="60" cy="78" rx="22" ry="18"
                      fill="url(#purpleGradDark)"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5, ease: 'backOut' }}
                    />
                    <motion.ellipse
                      cx="100" cy="78" rx="22" ry="18"
                      fill="url(#purpleGradDark)"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6, ease: 'backOut' }}
                    />
                    {/* Fingers - left */}
                    {[42, 52, 62, 68].map((x, i) => (
                      <motion.ellipse
                        key={`lf${i}`} cx={x} cy={68} rx="5.5" ry="9"
                        fill="url(#purpleGradDark)"
                        initial={{ y: 25, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.55 + i * 0.05, ease: 'backOut' }}
                      />
                    ))}
                    {/* Fingers - right */}
                    {[92, 98, 108, 118].map((x, i) => (
                      <motion.ellipse
                        key={`rf${i}`} cx={x} cy={68} rx="5.5" ry="9"
                        fill="url(#purpleGradDark)"
                        initial={{ y: 25, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.05, ease: 'backOut' }}
                      />
                    ))}
                  </motion.g>
                </motion.g>
              ) : (
                <motion.g
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Eye whites */}
                  <motion.ellipse
                    cx="60" cy="78" rx="14" ry="16" fill="white"
                    animate={{ ry: isTyping ? [16, 14, 16] : 16 }}
                    transition={{ duration: 0.2, repeat: isTyping ? Infinity : 0 }}
                  />
                  <motion.ellipse
                    cx="100" cy="78" rx="14" ry="16" fill="white"
                    animate={{ ry: isTyping ? [16, 14, 16] : 16 }}
                    transition={{ duration: 0.2, repeat: isTyping ? Infinity : 0 }}
                  />
                  {/* Pupils - follow cursor / email */}
                  <motion.circle
                    cx={60} cy={78} r="7" fill="#1e1b4b"
                    animate={{ cx: 60 + eyeX, cy: 78 + eyeY }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  />
                  <motion.circle
                    cx={100} cy={78} r="7" fill="#1e1b4b"
                    animate={{ cx: 100 + eyeX, cy: 78 + eyeY }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  />
                  {/* Eye shine */}
                  <motion.circle
                    cx={56} cy={73} r="3.5" fill="white" opacity={0.9}
                    animate={{ cx: 56 + eyeX * 0.4, cy: 73 + eyeY * 0.3 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  />
                  <motion.circle
                    cx={96} cy={73} r="3.5" fill="white" opacity={0.9}
                    animate={{ cx: 96 + eyeX * 0.4, cy: 73 + eyeY * 0.3 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Mouth */}
            <motion.path
              d={isEmailFocused
                ? "M 65 102 Q 80 116 95 102"  // big smile
                : peekPhase
                  ? "M 74 104 Q 80 100 86 104"  // small o (surprised)
                  : "M 68 102 Q 80 112 92 102"  // normal smile
              }
              fill={peekPhase ? '#1e1b4b' : 'none'}
              stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"
              transition={{ duration: 0.3 }}
            />

            {/* Eyebrows — react to state */}
            <motion.path
              d="M 48 62 Q 60 58 72 62"
              fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"
              animate={{
                d: peekPhase
                  ? "M 48 60 Q 60 52 72 60"  // worried
                  : isEmailFocused
                    ? "M 48 60 Q 60 56 72 60"  // curious
                    : "M 48 63 Q 60 60 72 63",  // relaxed
              }}
            />
            <motion.path
              d="M 88 62 Q 100 58 112 62"
              fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"
              animate={{
                d: peekPhase
                  ? "M 88 60 Q 100 52 112 60"
                  : isEmailFocused
                    ? "M 88 60 Q 100 56 112 60"
                    : "M 88 63 Q 100 60 112 63",
              }}
            />

            <defs>
              <radialGradient id="purpleGrad" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </radialGradient>
              <radialGradient id="purpleGradDark" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* ===== ORANGE BLOB (LEFT) ===== */}
        <motion.div
          style={{ position: 'absolute', left: 5, top: '58%' }}
          animate={{
            y: [0, -10, 0],
            rotate: peekPhase ? [0, 15, 12] : mouseX * -5,
            x: peekPhase ? 15 : 0,  // leans toward password
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
            rotate: { type: 'spring', stiffness: 80, damping: 12 },
            x: { type: 'spring', stiffness: 100, damping: 15 },
          }}
        >
          <svg width="85" height="85" viewBox="0 0 85 85">
            <ellipse cx="42" cy="48" rx="32" ry="30" fill="url(#orangeGrad2)" />
            <ellipse cx="34" cy="36" rx="14" ry="10" fill="rgba(255,255,255,0.06)" />
            {peekPhase ? (
              <>
                <motion.line x1="30" y1="40" x2="38" y2="40" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <motion.line x1="46" y1="40" x2="54" y2="40" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              </>
            ) : (
              <>
                <ellipse cx="34" cy="40" r="6" fill="white" />
                <ellipse cx="50" cy="40" r="6" fill="white" />
                <motion.circle cx={34} cy={40} r="3.5" fill="#7c2d12"
                  animate={{ cx: 34 + eyeX * 0.5, cy: 40 + eyeY * 0.4 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 12 }}
                />
                <motion.circle cx={50} cy={40} r="3.5" fill="#7c2d12"
                  animate={{ cx: 50 + eyeX * 0.5, cy: 40 + eyeY * 0.4 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 12 }}
                />
                <circle cx="32" cy="37" r="2" fill="white" opacity={0.8} />
                <circle cx="48" cy="37" r="2" fill="white" opacity={0.8} />
              </>
            )}
            <motion.path
              d={peekPhase ? "M 38 52 Q 42 50 46 52" : "M 36 52 Q 42 57 48 52"}
              fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round"
            />
            <defs>
              <radialGradient id="orangeGrad2" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#ea580c" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* ===== YELLOW BLOB (RIGHT) ===== */}
        <motion.div
          style={{ position: 'absolute', right: 5, top: '62%' }}
          animate={{
            y: [0, -12, 0],
            rotate: peekPhase ? [0, -10, -8] : mouseX * 4,
            x: peekPhase ? -12 : 0,  // leans toward password
          }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            rotate: { type: 'spring', stiffness: 80, damping: 12 },
            x: { type: 'spring', stiffness: 100, damping: 15 },
          }}
        >
          <svg width="75" height="75" viewBox="0 0 75 75">
            <ellipse cx="37" cy="42" rx="28" ry="26" fill="url(#yellowGrad2)" />
            <ellipse cx="30" cy="32" rx="12" ry="9" fill="rgba(255,255,255,0.08)" />
            {peekPhase ? (
              <>
                <motion.line x1="26" y1="36" x2="33" y2="36" stroke="#713f12" strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <motion.line x1="41" y1="36" x2="48" y2="36" stroke="#713f12" strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              </>
            ) : (
              <>
                <circle cx="30" cy="36" r="5" fill="white" />
                <circle cx="44" cy="36" r="5" fill="white" />
                <motion.circle cx={30} cy={36} r="3" fill="#713f12"
                  animate={{ cx: 30 + eyeX * 0.4, cy: 36 + eyeY * 0.3 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 12 }}
                />
                <motion.circle cx={44} cy={36} r="3" fill="#713f12"
                  animate={{ cx: 44 + eyeX * 0.4, cy: 36 + eyeY * 0.3 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 12 }}
                />
                <circle cx="28" cy="34" r="1.5" fill="white" opacity={0.8} />
                <circle cx="42" cy="34" r="1.5" fill="white" opacity={0.8} />
              </>
            )}
            <motion.path
              d={peekPhase ? "M 33 48 L 37 46 L 41 48" : "M 33 47 Q 37 51 41 47"}
              fill="none" stroke="#713f12" strokeWidth="2" strokeLinecap="round"
            />
            <defs>
              <radialGradient id="yellowGrad2" cx="35%" cy="28%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ca8a04" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* ===== SPEECH BUBBLE ===== */}
        <AnimatePresence>
          {(isEmailFocused || isPasswordFocused) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)',
                background: 'white', borderRadius: 16, padding: '8px 18px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                fontSize: 13, fontWeight: 600, color: '#4c1d95', whiteSpace: 'nowrap',
              }}
            >
              {isPasswordFocused ? '🙈 Saya tidak mengintip!' : '👀 Hmm, siapa ya...'}
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
