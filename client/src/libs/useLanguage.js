import { useState } from 'react';

const translations = {
    en: require('../locales/en.json'),
    fr: require('../locales/fr.json')
}

const useLanguage = () => {
    const [language, setLanguage] = useState(translations['en']);

    const handleSetLanguage = (lang) => {
        setLanguage(translations[lang] || translations['en']);
    }

    return [language, handleSetLanguage];
}

export default useLanguage;