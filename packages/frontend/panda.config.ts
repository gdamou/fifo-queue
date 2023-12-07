import { defineConfig } from '@pandacss/dev';

export default defineConfig({
    globalCss: {
        '::-webkit-scrollbar': {
            backgroundColor: '#eff0f6',
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '1rem',
        },
        '::-webkit-scrollbar-thumb': {
            backgroundColor: '#a0a3bd',
            borderRadius: '1rem',
        },
    },
    // Whether to use css reset
    preflight: true,

    presets: ['@pandacss/preset-base', '@park-ui/panda-preset'],

    // Where to look for your css declarations
    include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

    // Files to exclude
    exclude: [],

    // Useful for theme customization
    theme: {
        extend: {
            tokens: {
                colors: {
                    primary: { value: '#315AE7' },
                    secondary: { value: '#66A6FF' },
                    success: { value: '#00ba88' },
                    error: { value: '#ea3f4a' },
                    background: {
                        primary: { value: '#E8ECFC' },
                        secondary: { value: '#f4f6fe' },
                        separation: { value: '#d6d8e7' },
                        success: { value: '#caefe5' },
                        error: { value: '#e7c1c3' },
                    },
                },
                fonts: {
                    body: { value: 'Helvetica Neue,Helvetica' },
                },
            },
        },
    },

    // The output directory for your css system
    outdir: 'styled-system',

    jsxFramework: 'react',
});
