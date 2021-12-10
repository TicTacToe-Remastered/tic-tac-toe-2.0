import { useEffect, useState } from 'react';

const translations = {
    en: require('../../locales/en.json'),
    fr: require('../../locales/fr.json'),
    es: require('../../locales/es.json')
}

export const useLanguage = () => {
    const [language, setLanguage] = useState(translations['en']);

    const handleSetLanguage = (lang) => {
        window.localStorage.setItem('language', lang);
        setLanguage(translations[lang] || translations['en']);
        document.documentElement.lang = lang || 'en';
    }

    useEffect(() => {
        const localTheme = window.localStorage.getItem('language');
        localTheme ? handleSetLanguage(localTheme) : handleSetLanguage('en');
    }, []);

    return [language, handleSetLanguage];
};