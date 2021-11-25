import { createContext, useMemo, useState } from "react";

const translations = {
    en: require('../locales/en.json'),
    fr: require('../locales/fr.json')
}

export const LanguageContext = createContext({
    language: translations['en'],
    setLanguage: () => { },
});

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(translations['en']);

    const handleSetLanguage = (lang) => {
        setLanguage(translations[lang] || translations['en']);
    }

    const value = useMemo(
        () => ({ language, setLanguage: handleSetLanguage }),
        [language]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export default LanguageProvider;