import React, { useRef, useEffect } from 'react';

const TRAVEL_WORDS = ["JOURNEY", "FLIGHT", "HOTEL", "BEACH", "CITY", "RELAX", "ADVENTURE", "CULTURE", "EXPLORE", "VACATION", "TICKET", "BOOKING", "GUIDE"];

export const MatrixBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
            const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const nums = '0123456789';
            const alphabet = katakana + latin + nums;
            
            const fontSize = 16;
            const columns = Math.floor(canvas.width / fontSize);

            const rainDrops: number[] = [];
            const isWord: (string|null)[] = Array(columns).fill(null);
            const wordProgress: number[] = Array(columns).fill(0);

            for (let x = 0; x < columns; x++) {
                rainDrops[x] = Math.random() * -canvas.height;
            }

            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00E5E5'; // Cyan Blue
                ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

                for (let i = 0; i < rainDrops.length; i++) {
                    let text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                    
                    if (isWord[i]) {
                        text = isWord[i]![wordProgress[i]];
                        wordProgress[i]++;
                        if (wordProgress[i] >= isWord[i]!.length) {
                            isWord[i] = null;
                            wordProgress[i] = 0;
                        }
                    }

                    ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                    if (rainDrops[i] * fontSize > canvas.height) {
                         if (Math.random() > 0.99) { // Start a new word
                            isWord[i] = TRAVEL_WORDS[Math.floor(Math.random() * TRAVEL_WORDS.length)];
                            wordProgress[i] = 0;
                            rainDrops[i] = 0;
                        } else if (Math.random() > 0.95) { // Reset normally
                            rainDrops[i] = 0;
                        }
                    }
                    rainDrops[i]++;
                }
                animationFrameId = window.requestAnimationFrame(draw);
            };

            draw();
        };

        const handleResize = () => {
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
            setup();
        };

        setup();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed top-0 left-0 w-full h-full z-0"
        />
    );
};