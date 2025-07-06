import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// WhisprSpace Custom Colors
				'whisper-float': 'hsl(var(--whisper-float))',
				'whisper-ambient': 'hsl(var(--whisper-ambient))',
				'whisper-mist': 'hsl(var(--whisper-mist))',
				'cyber-cyan': 'hsl(var(--cyber-cyan))',
				'cyber-purple': 'hsl(var(--cyber-purple))',
				'cyber-glow': 'hsl(var(--cyber-glow))',
				'ambient-primary': 'hsl(var(--ambient-primary))',
				'ambient-secondary': 'hsl(var(--ambient-secondary))',
				'ambient-tertiary': 'hsl(var(--ambient-tertiary))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'whisper-float': {
					'0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.4' },
					'50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '1' }
				},
				'cyber-pulse': {
					'0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' }
				},
				'ambient-glow': {
					'0%, 100%': { filter: 'blur(1px) brightness(1)' },
					'50%': { filter: 'blur(2px) brightness(1.2)' }
				},
				'sound-wave': {
					'0%, 100%': { transform: 'scaleY(1)' },
					'50%': { transform: 'scaleY(1.5)' }
				},
				'shadow-run': {
					'0%': { transform: 'translateX(-100px) skewX(0deg)' },
					'50%': { transform: 'translateX(50vw) skewX(-2deg)' },
					'100%': { transform: 'translateX(calc(100vw + 100px)) skewX(0deg)' }
				},
				'whisper-spread': {
					'0%': { transform: 'scale(0) rotate(0deg)', opacity: '0.8' },
					'50%': { transform: 'scale(2) rotate(180deg)', opacity: '0.4' },
					'100%': { transform: 'scale(4) rotate(360deg)', opacity: '0' }
				},
				'echo-return': {
					'0%': { transform: 'scale(2) translateX(100px)', opacity: '0' },
					'50%': { transform: 'scale(1) translateX(50px)', opacity: '0.8' },
					'100%': { transform: 'scale(0.5) translateX(0px)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'whisper-float': 'whisper-float 4s ease-in-out infinite',
				'cyber-pulse': 'cyber-pulse 2s ease-in-out infinite',
				'ambient-glow': 'ambient-glow 3s ease-in-out infinite',
				'sound-wave': 'sound-wave 0.5s ease-in-out infinite',
				'shadow-run': 'shadow-run 15s linear infinite',
				'whisper-spread': 'whisper-spread 3s ease-out infinite',
				'echo-return': 'echo-return 2s ease-in infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
