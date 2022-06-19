// Default settings!
const _defaultSettings = {
    background: "#008080",
    corsAnywhereUrl: (import.meta.env.DEV ? "http://localhost:49154/" : "https://cors.vkabc.xyz/"),
    sequenceWalletWebappUrl: "https://sequence.app",
    debugModeSetMeToTheStringTrue: import.meta.env.DEV ? "true" : "false",
    testnetModeSetMeToTheStringTrue: import.meta.env.DEV ? "false" : "false",
}

export const defaultSettings: {
    readonly [K in keyof typeof _defaultSettings]: string
} = _defaultSettings

const settings = {
    ...defaultSettings,
}

const settingsVersions: { [K in keyof typeof settings]: number } = {
    background: 0,
    corsAnywhereUrl: 1,
    sequenceWalletWebappUrl: 0,
    debugModeSetMeToTheStringTrue: 0,
    testnetModeSetMeToTheStringTrue: 0,
}

// Load settings
for (const key of Object.keys(settings) as Array<keyof typeof settings>) {
    const storedVal = window.localStorage.getItem(storageKey(key))
    if (storedVal) {
        settings[key as keyof typeof settings] = storedVal as any
    }
}

export function setSetting<K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
) {
    window.localStorage.setItem(storageKey(key), value)
}

function storageKey(key: keyof typeof settings) {
    return `vaportrade_settings_${key}_v${settingsVersions[key]}`
}

export const config: Readonly<typeof settings> = settings
export const LS_SIGNED_ORDER_CACHE_KEY = "signedOrderCache"

export const prodOptionalCorsService = "https://cors.vaportrade.net/"
