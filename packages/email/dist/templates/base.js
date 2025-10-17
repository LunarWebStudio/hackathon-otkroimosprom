import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Body, Container, Font, Head, Html, Tailwind, } from "@react-email/components";
export default function EmailTemplate({ children }) {
    return (_jsx(Tailwind, { children: _jsxs(Html, { children: [_jsx(Head, { children: _jsx(Font, { webFont: {
                            url: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
                            format: "woff2",
                        }, fontFamily: "Inter", fallbackFontFamily: "sans-serif" }) }), _jsx(Body, { children: _jsx(Container, { className: "max-w-[50ch]", children: children }) })] }) }));
}
