import { createContext, useEffect, useMemo, useState } from "react";

const translations = {
    en: require('../../locales/en.json'),
    fr: require('../../locales/fr.json'),
    es: require('../../locales/es.json')
}

export const LanguageContext = createContext({
    language: translations['en'],
    setLanguage: () => { },
});

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(translations['en']);

    const handleSetLanguage = (lang) => {
        window.localStorage.setItem('language', lang);
        setLanguage(translations[lang] || translations['en']);
        document.documentElement.lang = lang || 'en';
    }

    const value = useMemo(
        () => ({ language, setLanguage: handleSetLanguage }),
        [language]
    );

    useEffect(() => {
        const localTheme = window.localStorage.getItem('language');
        localTheme ? handleSetLanguage(localTheme) : handleSetLanguage('en');
    }, []);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export default LanguageProvider;