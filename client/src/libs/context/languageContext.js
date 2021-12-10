import { createContext, useMemo } from "react";
import { useLanguage } from "../hook/useLanguage";

export const LanguageContext = createContext({
    language: {},
    setLanguage: () => { },
});

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useLanguage();

    const value = useMemo(
        () => ({ language, setLanguage }),
        [language, setLanguage]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export default LanguageProvider;